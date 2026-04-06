import json
from app.services.ai.llm import call_llm

def analyze_resume(resume_text: str, job_description: str) -> dict:
    prompt = f"""
You are an expert ATS analyst and career coach.

Analyze the match between the resume and job description below.
You MUST respond with ONLY a valid JSON object — no explanation, no markdown, no extra text.

Return exactly this structure:
{{
  "match_score": <integer 0-100>,
  "verdict": "<one sentence summary>",
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2", "gap3"],
  "quick_wins": ["win1", "win2", "win3"]
}}

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    raw = call_llm(prompt)

    # clean response in case LLM adds markdown code blocks
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    return json.loads(cleaned)

def check_ats(resume_text: str) -> dict:
    prompt = f"""
You are an expert ATS (Applicant Tracking System) resume analyst.

Thoroughly analyze the resume below as a general health check.
Do NOT compare it to any job description — evaluate it on its own merit.

Check for the following:
1. ATS compatibility — will ATS systems parse it correctly
2. Required sections — contact info, summary, experience, education, skills
3. Formatting issues — tables, columns, graphics, headers/footers that break ATS
4. Bullet point quality — weak verbs, vague descriptions, missing metrics
5. Keyword density — are there enough industry-relevant keywords
6. Grammar and spelling issues
7. Quantified achievements — are results measurable
8. Overall structure and readability

You MUST respond with ONLY a valid JSON object — no markdown, no extra text.

Return exactly this structure:
{{
  "ats_score": <integer 0-100>,
  "verdict": "<one sentence overall summary>",
  "issues_found": [
    "specific issue found in the resume",
    "another specific issue"
  ],
  "improvements": [
    "specific actionable improvement step",
    "another improvement step"
  ],
  "missing_sections": [
    "section that is missing or incomplete"
  ],
  "formatting_issues": [
    "specific formatting problem that hurts ATS parsing"
  ],
  "keyword_density": "<low | medium | high> — one word only",
  "overall_tips": [
    "general best practice tip",
    "another tip"
  ]
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