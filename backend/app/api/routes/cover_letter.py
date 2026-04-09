from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.resume.resume_parse import parse_pdf
from app.services.ai.cover_letter_generator import generate_cover_letter
from app.schemas.cover_letter_schema import CoverLetterResponse

router = APIRouter()


@router.post(
    "/generate",
    response_model=CoverLetterResponse,
    summary="Cover Letter Generator",
    description="Upload resume PDF and job description — returns a personalized cover letter."
)
async def cover_letter(
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
        result = generate_cover_letter(resume_text, job_description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")