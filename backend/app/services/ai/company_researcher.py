import json
from app.services.ai.llm import call_llm
from app.services.scrapers.news_scraper import get_company_news
from app.services.scrapers.jobs_scraper import get_company_jobs


def research_company(company_name: str, role: str = "") -> dict:

    news_data = get_company_news(company_name)
    jobs_data = get_company_jobs(company_name)

    news_text = "\n".join([
        f"- {n['title']} ({n['date']}): {n['snippet']}"
        for n in news_data[:6]
    ]) if news_data else "No recent news found."

    jobs_text = "\n".join([
        f"- {j['title']} | {j['location']} | {j['type']}"
        for j in jobs_data[:5]
    ]) if jobs_data else "No active job postings found."

    research_prompt = f"""
You are an elite company research analyst and interview coach.

Research the company "{company_name}" extremely thoroughly.
{f'The candidate is applying for: {role}' if role else ''}

IMPORTANT LOCATION RULES — follow strictly:
- All salary ranges MUST be in Indian Rupees (INR) per annum
- Focus on India offices, India operations, India hiring
- If the company has an India office mention it specifically
- If it is an Indian company focus on Indian market context
- headquarters should mention India office if it exists
- employee_count should mention India headcount if available
- If it is a foreign company mention their India office location, India team size and India-specific roles

Real scraped data to enhance accuracy:

RECENT NEWS:
{news_text}

ACTIVE JOB POSTINGS:
{jobs_text}

You MUST respond with ONLY a valid JSON object — no markdown, no explanation.

Return exactly this structure:
{{
  "company_name": "{company_name}",
  "industry": "<industry>",
  "founded": "<year>",
  "headquarters": "<city, country>",
  "company_size": "<employee range + India headcount if available>",
  "website": "<official url>",

  "what_they_do": "<3-4 sentence description of exactly what they do, their core product and who uses it, mention India operations if relevant>",
  "mission": "<official or inferred mission statement>",
  "vision": "<long term vision of the company>",
  "core_values": ["value1", "value2", "value3", "value4"],
  "products": ["product1", "product2", "product3"],
  "tech_stack": ["tech1", "tech2", "tech3", "tech4", "tech5"],
  "target_customers": "<who are their main customers — B2B, B2C, enterprise, etc>",
  "business_model": "<how they make money — subscription, marketplace, ads, etc>",

  "leadership": [
    {{
      "name": "<full name>",
      "role": "<CEO, CTO, etc>",
      "background": "<1 sentence background>"
    }}
  ],
  "ceo_quote": "<a real or representative quote from the CEO about company direction>",

  "culture_summary": "<4-5 sentences about company culture based on employee reviews and public info, mention India office culture if relevant>",
  "work_life_balance": "<poor|average|good|excellent>",
  "pros": ["pro1", "pro2", "pro3", "pro4", "pro5"],
  "cons": ["con1", "con2", "con3", "con4"],
  "glassdoor_rating": "<rating out of 5 or Unknown>",
  "employee_count": "<approximate number>",
  "notable_perks": ["perk1", "perk2", "perk3", "perk4"],

  "market_position": "<are they a market leader, challenger, niche player — explain in 2 sentences>",
  "competitors": [
    {{
      "name": "<competitor name>",
      "how_different": "<how company is different from this competitor>"
    }}
  ],
  "competitive_advantage": "<what makes them genuinely better than competitors>",
  "market_size": "<total addressable market size>",
  "recent_achievements": [
    "<specific achievement like award, milestone, product launch, partnership>",
    "<another achievement>",
    "<another achievement>"
  ],

  "funding_status": "<bootstrapped|seed|series-a|series-b|series-c|public|profitable>",
  "funding_rounds": [
    {{
      "round": "<round name>",
      "amount": "<amount>",
      "date": "<date>"
    }}
  ],
  "total_funding": "<total amount raised>",
  "revenue": "<annual revenue or range>",
  "growth_stage": "<early-stage|growth|mature|enterprise>",
  "valuation": "<company valuation or Unknown>",
  "investors": ["investor1", "investor2", "investor3"],

  "interview_difficulty": "<easy|medium|hard|very-hard>",
  "interview_process": [
    {{
      "stage": "<stage name>",
      "description": "<detailed description of what happens>"
    }}
  ],
  "commonly_asked_topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "interview_tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],

  "recent_news": [
    {{
      "title": "<headline>",
      "summary": "<2 sentence summary>",
      "url": "<url>",
      "date": "<date>"
    }}
  ],

  "interview_talking_points": [
    {{
      "category": "<Product|Growth|Mission|Culture|Technology|Market>",
      "what_to_say": "<exact words the candidate can say in interview — 2-3 sentences they can memorize and use>",
      "why_it_impresses": "<why saying this will impress the interviewer>"
    }}
  ],

  "why_work_here": [
    "<specific compelling reason to work here — not generic, based on actual company facts>",
    "<another specific reason>",
    "<another specific reason>",
    "<another specific reason>"
  ],

  "questions_to_ask": [
    "<smart specific question the candidate can ask the interviewer that shows deep research>",
    "<another smart question>",
    "<another smart question>",
    "<another smart question>",
    "<another smart question>"
  ],

  "company_challenges": [
    "<a real challenge or problem the company is currently facing>",
    "<another challenge>",
    "<another challenge>"
  ],

  "how_you_can_contribute": "<2-3 sentences on how someone in the role of {role if role else 'this position'} can specifically help the company with its current challenges and goals>",

  "overall_verdict": "<4-5 sentence honest overall verdict as an employer>",
  "red_flags": ["red flag1", "red flag2", "red flag3"],
  "green_flags": ["green flag1", "green flag2", "green flag3", "green flag4"],
  "recommended_for": "<what type of person thrives here>",
  "salary_range": "<salary range in INR per annum for {role if role else 'engineering roles'} in India — e.g. ₹12 LPA - ₹25 LPA>"
}}

CRITICAL: salary_range must always be in INR (Indian Rupees) format like ₹8 LPA - ₹15 LPA

IMPORTANT RULES:
- interview_talking_points must have 6-8 items covering different categories
- questions_to_ask must be specific to this company — not generic questions
- why_work_here must reference actual company facts not generic reasons
- Be honest about red flags — do not sugarcoat
- recent_news should use the scraped data provided above
"""

    raw = call_llm(research_prompt)
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    result = json.loads(cleaned)

    # inject real scraped news
    if news_data:
        result["recent_news"] = [
            {
                "title": n["title"],
                "summary": n["snippet"] or "Click to read full article.",
                "url": n["url"],
                "date": n["date"]
            }
            for n in news_data[:5]
        ]

    return result