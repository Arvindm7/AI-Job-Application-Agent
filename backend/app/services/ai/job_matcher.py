import json
from app.services.ai.llm import call_llm
from app.services.jobs.job_search import search_jobs


def extract_profile_from_resume(resume_text: str) -> dict:
    prompt = f"""
Analyze this resume and extract the candidate's job search profile.
Respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "job_title": "<most suitable job title to search for based on experience>",
  "alternate_titles": ["<alternate title 1>", "<alternate title 2>"],
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "experience_level": "<entry|mid|senior>",
  "preferred_location": "<location from resume or Remote>"
}}

RESUME:
{resume_text}
"""

    raw = call_llm(prompt)
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    return json.loads(cleaned)


def score_job_against_resume(resume_text: str, job: dict) -> dict:
    prompt = f"""
You are a job match scorer.

Score how well this job matches the candidate's resume on a scale of 0-100.
Respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "match_score": <integer 0-100>,
  "match_reason": "<one sentence explaining the score>"
}}

RESUME:
{resume_text}

JOB TITLE: {job["title"]}
COMPANY: {job["company"]}
JOB DESCRIPTION: {job["description_snippet"]}
"""

    raw = call_llm(prompt)
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    result = json.loads(cleaned)
    return result


def find_matching_jobs(resume_text: str, location: str = "India", remote_only: bool = False) -> dict:

    # step 1 — extract profile from resume
    profile = extract_profile_from_resume(resume_text)

    # step 2 — search jobs using primary title + skills
    search_query = f"{profile['job_title']} {' '.join(profile['top_skills'][:3])}"
    jobs = search_jobs(
        query=search_query,
        location=location,
        num_pages=2,
        remote_only=remote_only
    )

    # step 3 — also search with alternate titles and merge
    for alt_title in profile.get("alternate_titles", []):
        alt_jobs = search_jobs(
            query=alt_title,
            location=location,
            num_pages=1,
            remote_only=remote_only
        )
        # add only unique jobs
        existing_ids = {j["job_id"] for j in jobs}
        for job in alt_jobs:
            if job["job_id"] not in existing_ids:
                jobs.append(job)
                existing_ids.add(job["job_id"])

    # step 4 — score each job against resume
    scored_jobs = []
    for job in jobs[:15]:  # limit to 15 to avoid too many LLM calls
        try:
            score_data = score_job_against_resume(resume_text, job)
            job["match_score"] = score_data["match_score"]
            job["match_reason"] = score_data["match_reason"]
        except Exception:
            job["match_score"] = 0
            job["match_reason"] = "Could not score this job"
        scored_jobs.append(job)

    # step 5 — sort by match score highest first
    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "extracted_title": profile["job_title"],
        "extracted_skills": profile["top_skills"],
        "total_found": len(scored_jobs),
        "jobs": scored_jobs
    }