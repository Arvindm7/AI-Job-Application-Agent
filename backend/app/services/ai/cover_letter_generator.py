import json
from app.services.ai.llm import call_llm


def generate_cover_letter(resume_text: str, job_description: str) -> dict:

    # first extract key details from job description
    extract_prompt = f"""
Extract the following details from the job description below.
Respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "company_name": "<company name or Unknown if not found>",
  "role_title": "<exact job title>",
  "hiring_manager": "<hiring manager name or Hiring Manager if not found>",
  "key_requirements": ["requirement1", "requirement2", "requirement3"],
  "company_values": ["value1", "value2"]
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

    # then generate the cover letter
    cover_prompt = f"""
You are an expert cover letter writer who crafts compelling, personalized cover letters that get interviews.

Write a professional cover letter for this candidate applying to the role of {job_details["role_title"]} at {job_details["company_name"]}.

STRUCTURE:
1. OPENING PARAGRAPH — Start with a strong hook. Mention the role and company directly. Show genuine interest with a specific insight about the company or role. Never start with "I am writing to express my interest".
2. BODY PARAGRAPH 1 — Connect the candidate's most relevant experience to the top 2-3 requirements of the job. Use specific examples and metrics from the resume.
3. BODY PARAGRAPH 2 — Show cultural fit and enthusiasm. Reference the company's values or mission. Explain why this specific company, not just any company.
4. CLOSING PARAGRAPH — Confident call to action. Thank them for their time. Express excitement about next steps.

STRICT RULES:
- Tone must be professional but human — not robotic or generic
- Never use cliche phrases like "I am a hard worker", "team player", "passion for excellence"
- Use specific details from BOTH the resume and job description
- Keep it to 4 paragraphs — concise and impactful
- Address to {job_details["hiring_manager"]}
- Sign off with the candidate's name from the resume

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY the cover letter text — no subject line, no markdown, no explanation.
"""

    cover_letter_text = call_llm(cover_prompt)
    cover_letter_text = cover_letter_text.strip()

    # fix — regular dict, not inside f-string
    return {
        "cover_letter": cover_letter_text,
        "word_count": len(cover_letter_text.split()),
        "hiring_manager": job_details["hiring_manager"],
        "company_name": job_details["company_name"],
        "role_title": job_details["role_title"]
    }