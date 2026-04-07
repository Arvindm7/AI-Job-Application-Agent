from pydantic import BaseModel
from typing import List

class TailoredResumeResponse(BaseModel):
    original_score: int
    optimized_score: int
    improvement: int
    keywords_added: List[str]
    sections_modified: List[str]
    ats_tips: List[str]