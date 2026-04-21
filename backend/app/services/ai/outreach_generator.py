import json
from app.services.ai.llm import call_llm


def generate_outreach(
    target_company: str,
    outreach_type: str,
    target_name: str = "",
    target_role: str = "",
    applying_role: str = "",
    resume_text: str = ""
) -> dict:

    # build context
    target_label = f"{target_name} ({target_role})" if target_name and target_role else target_name or "the hiring manager"
    role_label = applying_role if applying_role else "a relevant role"

    # extract key resume highlights for personalization
    resume_context = ""
    if resume_text:
        extract_prompt = f"""
Extract 3-4 strongest highlights from this resume in one line each.
Focus on achievements, skills and experience most relevant for {role_label}.
Return ONLY a JSON array of strings — no markdown.

RESUME:
{resume_text[:2000]}
"""
        try:
            raw = call_llm(extract_prompt)
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```")[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
            highlights = json.loads(cleaned.strip())
            resume_context = "\n".join([f"- {h}" for h in highlights])
        except Exception:
            resume_context = ""

    type_instructions = {
        "cold_email": """
Generate 3 cold email variants to a hiring manager or recruiter.
Each variant must have a subject line and email body.
Tones: Professional, Conversational, Bold
Length: 100-150 words each — short emails get more replies
Format: Start with a hook, connect your background, clear ask, easy CTA
""",
        "linkedin_connect": """
Generate 3 LinkedIn connection request note variants.
STRICT: LinkedIn connection notes have a 300 character limit — stay under 300 chars each.
Tones: Professional, Friendly, Direct
No subject line needed — just the connection note
Make it personal and specific — not generic
""",
        "linkedin_message": """
Generate 3 LinkedIn direct message variants after connecting.
Length: 100-150 words each
Tones: Professional, Conversational, Value-led
No subject line needed
Start with a warm opener since they already connected
""",
        "referral_request": """
Generate 3 employee referral request message variants.
These are sent to someone who works at the company — asking for a referral.
Tones: Friendly, Professional, Direct
Length: 100-130 words each
Make it easy for them to say yes — be specific about the role and what you need
"""
    }

    instructions = type_instructions.get(outreach_type, type_instructions["cold_email"])

    prompt = f"""
You are an expert career coach and copywriter specializing in job search outreach.

Generate outreach messages for this situation:
- Target: {target_label}
- Company: {target_company}
- Applying for: {role_label}
- Outreach type: {outreach_type.replace('_', ' ')}

{f"Candidate highlights:{chr(10)}{resume_context}" if resume_context else ""}

{instructions}

RULES:
- Be specific to {target_company} — mention something real about the company
- Never use cliche phrases like "I hope this email finds you well" or "I am reaching out because"
- Every message must have a clear single ask
- Sound human — not AI generated
- India context — candidate is based in India

You MUST respond with ONLY a valid JSON object — no markdown, no extra text.

Return exactly this structure:
{{
  "variants": [
    {{
      "tone": "<Professional|Conversational|Bold|Friendly|Direct|Value-led>",
      "subject": "<subject line if email, empty string if linkedin>",
      "message": "<full message text>",
      "word_count": <integer>,
      "why_it_works": "<one sentence explaining why this variant is effective>"
    }}
  ],
  "dos": [
    "<specific do for this type of outreach>",
    "<another do>",
    "<another do>",
    "<another do>"
  ],
  "donts": [
    "<specific dont>",
    "<another dont>",
    "<another dont>"
  ],
  "follow_up_message": "<a short follow up message to send after 5-7 days if no reply>",
  "best_time_to_send": "<best day and time to send this type of message for highest open rate>"
}}
"""

    raw = call_llm(prompt)
    cleaned = raw.strip()
    if "```" in cleaned:
        parts = cleaned.split("```")
        for part in parts:
            stripped = part.strip()
            if stripped.startswith("json"):
                stripped = stripped[4:].strip()
            if stripped.startswith("{"):
                cleaned = stripped
                break

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1:
        cleaned = cleaned[start:end + 1]

    result = json.loads(cleaned)

    # calculate word counts
    for variant in result.get("variants", []):
        variant["word_count"] = len(variant.get("message", "").split())

    return {
        "outreach_type": outreach_type,
        "target_company": target_company,
        "target_name": target_name,
        "applying_role": applying_role,
        "variants": result.get("variants", []),
        "dos": result.get("dos", []),
        "donts": result.get("donts", []),
        "follow_up_message": result.get("follow_up_message", ""),
        "best_time_to_send": result.get("best_time_to_send", "")
    }