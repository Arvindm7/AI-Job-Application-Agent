from pydantic import BaseModel

class CoverLetterResponse(BaseModel):
    cover_letter: str
    word_count: int
    hiring_manager: str
    company_name: str
    role_title: str