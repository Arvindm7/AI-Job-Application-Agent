from pydantic import BaseModel
from typing import List


class Resource(BaseModel):
    title: str
    url: str
    type: str            # "video", "article", "course", "book", "practice"
    duration: str        # "2 hours", "1 week", "30 mins"
    priority: str        # "must", "recommended", "optional"


class StudyTopic(BaseModel):
    topic: str
    why_important: str
    days_needed: int
    resources: List[Resource]


class DailyPlan(BaseModel):
    day: int
    focus: str
    topics: List[str]
    goal: str


class InterviewPrepResponse(BaseModel):
    role_title: str
    company_name: str
    total_prep_days: int
    behavioral_questions: List[str]
    technical_questions: List[str]
    situational_questions: List[str]
    questions_to_ask_interviewer: List[str]
    study_topics: List[StudyTopic]
    daily_plan: List[DailyPlan]
    red_flags_to_address: List[str]
    key_talking_points: List[str]