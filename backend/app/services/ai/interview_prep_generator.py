import json
from app.services.ai.llm import call_llm


def generate_interview_prep(resume_text: str, job_description: str) -> dict:

    # step 1 — extract job details
    extract_prompt = f"""
Extract the following from the job description.
Respond with ONLY a valid JSON object — no markdown, no explanation.

{{
  "company_name": "<company name or Unknown>",
  "role_title": "<exact job title>",
  "technical_skills": ["skill1", "skill2"],
  "soft_skills": ["skill1", "skill2"],
  "key_responsibilities": ["resp1", "resp2"]
}}

JOB DESCRIPTION:
{job_description}
"""

    raw = call_llm(extract_prompt)
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()
    job_details = json.loads(cleaned)

    # step 2 — generate questions + talking points
    questions_prompt = f"""
You are an expert interview coach preparing a candidate for {job_details["role_title"]} at {job_details["company_name"]}.

Analyze the resume and job description carefully and generate a complete interview preparation guide.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "behavioral_questions": [
    "Tell me about a time you...",
    "Describe a situation where you..."
  ],
  "technical_questions": [
    "specific technical question based on job requirements",
    "another technical question"
  ],
  "situational_questions": [
    "What would you do if...",
    "How would you handle..."
  ],
  "questions_to_ask_interviewer": [
    "smart question showing research",
    "another smart question"
  ],
  "red_flags_to_address": [
    "potential weakness or gap the interviewer might probe",
    "how to address employment gap etc"
  ],
  "key_talking_points": [
    "strong point to weave into answers naturally",
    "another talking point"
  ]
}}

RULES:
- Generate exactly 8 behavioral questions
- Generate exactly 8 technical questions specific to the tech stack in the job description
- Generate exactly 5 situational questions
- Generate exactly 5 questions to ask the interviewer
- Generate exactly 3 red flags with how to address each
- Generate exactly 5 key talking points from the resume that match the job

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    raw2 = call_llm(questions_prompt)
    cleaned2 = raw2.strip()
    if cleaned2.startswith("```"):
        cleaned2 = cleaned2.split("```")[1]
        if cleaned2.startswith("json"):
            cleaned2 = cleaned2[4:]
    cleaned2 = cleaned2.strip()
    questions_data = json.loads(cleaned2)

    # step 3 — generate study topics with real resources
    resources_prompt = f"""
You are an expert technical interview coach.

Based on the job description and resume gaps, generate a structured study plan with real, specific learning resources.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "total_prep_days": <integer, realistic days needed to prepare>,
  "study_topics": [
    {{
      "topic": "<specific topic to study>",
      "why_important": "<why this topic will come up in the interview>",
      "days_needed": <integer>,
      "resources": [
        {{
          "title": "<exact resource name>",
          "url": "<real working url>",
          "type": "<video|article|course|book|practice>",
          "duration": "<realistic time to complete>",
          "priority": "<must|recommended|optional>"
        }}
      ]
    }}
  ]
}}

RULES:
- Generate 5-7 study topics based on gaps between resume and job description
- For each topic provide 3-4 real resources with actual URLs
- URLs must be real and working — use YouTube, Coursera, freeCodeCamp, LeetCode, official docs, Medium, GeeksForGeeks
- Prioritize free resources over paid ones
- Order topics by importance — most critical first
- Be specific — not "learn Python" but "Python async/await and concurrency"

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    raw3 = call_llm(resources_prompt)
    cleaned3 = raw3.strip()
    if cleaned3.startswith("```"):
        cleaned3 = cleaned3.split("```")[1]
        if cleaned3.startswith("json"):
            cleaned3 = cleaned3[4:]
    cleaned3 = cleaned3.strip()
    resources_data = json.loads(cleaned3)

    # step 4 — generate daily study plan
    plan_prompt = f"""
You are an expert interview coach.

Create a day by day study plan for {resources_data["total_prep_days"]} days to prepare for a {job_details["role_title"]} interview.

Based on these study topics:
{json.dumps(resources_data["study_topics"], indent=2)}

You MUST respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "daily_plan": [
    {{
      "day": <day number>,
      "focus": "<main focus area for the day>",
      "topics": ["specific topic 1", "specific topic 2"],
      "goal": "<what the candidate should be able to do by end of day>"
    }}
  ]
}}

RULES:
- Every day must have a clear focus and measurable goal
- Mix technical study with practice questions each day
- Last 2 days should be revision and mock interview practice
- Keep it realistic — 3-4 hours of study per day max
"""

    raw4 = call_llm(plan_prompt)
    cleaned4 = raw4.strip()
    if cleaned4.startswith("```"):
        cleaned4 = cleaned4.split("```")[1]
        if cleaned4.startswith("json"):
            cleaned4 = cleaned4[4:]
    cleaned4 = cleaned4.strip()
    plan_data = json.loads(cleaned4)

    # combine everything
    return {
        "role_title": job_details["role_title"],
        "company_name": job_details["company_name"],
        "total_prep_days": resources_data["total_prep_days"],
        "behavioral_questions": questions_data["behavioral_questions"],
        "technical_questions": questions_data["technical_questions"],
        "situational_questions": questions_data["situational_questions"],
        "questions_to_ask_interviewer": questions_data["questions_to_ask_interviewer"],
        "study_topics": resources_data["study_topics"],
        "daily_plan": plan_data["daily_plan"],
        "red_flags_to_address": questions_data["red_flags_to_address"],
        "key_talking_points": questions_data["key_talking_points"]
    }