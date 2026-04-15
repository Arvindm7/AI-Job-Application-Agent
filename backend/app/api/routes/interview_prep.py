from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.resume.resume_parse import parse_pdf
from app.services.ai.interview_prep_generator import generate_interview_prep
from app.schemas.interview_prep_schema import InterviewPrepResponse

router = APIRouter()


@router.post(
    "/prepare",
    response_model=InterviewPrepResponse,
    summary="Interview Preparation Kit",
    description="Upload resume PDF and job description — returns complete interview prep with questions, study plan and resources."
)
async def interview_prep(
    file: UploadFile = File(...),
    job_description: str = Form(...)
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
        result = generate_interview_prep(resume_text, job_description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview prep generation failed: {str(e)}")