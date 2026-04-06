from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

class SkillMatch(BaseModel):
    matched: List[str]
    missing: List[str]

class AnalyzeResponse(BaseModel):
    match_score: int                  # 0-100
    verdict: str                      # one line summary
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    gaps: List[str]
    quick_wins: List[str]

class ATSCheckResponse(BaseModel):
    ats_score: int
    verdict: str
    issues_found: List[str]
    improvements: List[str]
    missing_sections: List[str]
    formatting_issues: List[str]
    keyword_density: str
    overall_tips: List[str]