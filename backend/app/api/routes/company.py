from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from app.services.ai.company_researcher import research_company
from app.schemas.company_schema import CompanyResearchResponse

router = APIRouter()


class CompanyRequest(BaseModel):
    company_name: str
    role: str = ""

    @field_validator('company_name')
    def validate_company_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Company name cannot be empty')
        return v

    @field_validator('role')
    def validate_role(cls, v):
        return v.strip() if v else ""


@router.post(
    "/research",
    response_model=CompanyResearchResponse,
    summary="Company Research Agent",
    description="Enter a company name and get a full insider brief."
)
def company_research(data: CompanyRequest):
    try:
        result = research_company(data.company_name, data.role)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")