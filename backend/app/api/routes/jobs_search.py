from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from app.services.resume.resume_parse import parse_pdf
from app.services.ai.job_matcher import find_matching_jobs
from app.services.jobs.job_search import search_jobs
from app.schemas.job_search_schema import JobSearchResponse, MatchedJobsResponse

router = APIRouter()


@router.post(
    "/match",
    response_model=MatchedJobsResponse,
    summary="Find Matching Jobs from Resume",
    description="Upload your resume PDF — AI extracts your profile and finds the best matching jobs."
)
async def match_jobs(
    file: UploadFile = File(...),
    location: str = Form("India"),
    remote_only: bool = Form(False)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB")

    resume_text = parse_pdf(contents)

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    try:
        result = find_matching_jobs(resume_text, location, remote_only)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")


@router.get(
    "/search",
    response_model=JobSearchResponse,
    summary="Search Jobs by Query",
    description="Search jobs directly by title and location."
)
def search(
    query: str = Query(..., description="Job title or keywords"),
    location: str = Query("India", description="Location to search in"),
    remote_only: bool = Query(False, description="Show remote jobs only"),
    employment_type: str = Query(None, description="FULLTIME, PARTTIME, INTERN, CONTRACTOR")
):
    try:
        jobs = search_jobs(
            query=query,
            location=location,
            remote_only=remote_only,
            employment_type=employment_type
        )
        return {
            "total_found": len(jobs),
            "search_query": query,
            "jobs": jobs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job search failed: {str(e)}")