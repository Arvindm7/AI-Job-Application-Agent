from pydantic import BaseModel
from typing import List


class OutreachRequest(BaseModel):
    resume_text: str = ""
    target_name: str = ""
    target_role: str = ""
    target_company: str
    applying_role: str = ""
    outreach_type: str  # cold_email | linkedin_connect | linkedin_message | referral_request


class OutreachVariant(BaseModel):
    tone: str
    subject: str = ""
    message: str
    word_count: int
    why_it_works: str


class OutreachResponse(BaseModel):
    outreach_type: str
    target_company: str
    target_name: str
    applying_role: str
    variants: List[OutreachVariant]
    dos: List[str]
    donts: List[str]
    follow_up_message: str
    best_time_to_send: str