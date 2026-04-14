from pydantic import BaseModel
from typing import List, Optional


class Job(BaseModel):
    job_id: str
    title: str
    company: str
    company_portal: Optional[str] = None
    company_linkedin: Optional[str] = None
    location: str
    job_type: str
    remote: bool
    salary: str
    posted_date: str
    apply_url: str
    description_snippet: str
    match_score: Optional[int] = None
    match_reason: Optional[str] = None


class JobSearchResponse(BaseModel):
    total_found: int
    search_query: str
    jobs: List[Job]


class MatchedJobsResponse(BaseModel):
    extracted_title: str
    extracted_skills: List[str]
    total_found: int
    jobs: List[Job]