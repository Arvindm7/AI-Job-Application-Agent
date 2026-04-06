from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.resume.resume_parse import parse_pdf
from app.services.ai.analyzer import analyze_resume ,check_ats
from app.schemas.analyze_schema import AnalyzeRequest, AnalyzeResponse, ATSCheckResponse

router = APIRouter()

@router.post("/resume", response_model=AnalyzeResponse)
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # validate file
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB")

    # parse pdf → text
    resume_text = parse_pdf(contents)

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # run analysis
    try:
        result = analyze_resume(resume_text, job_description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
@router.post(
    "/ats-check",
    response_model=ATSCheckResponse,
    summary="ATS Resume Health Check",
    description="Upload your resume PDF and get a full ATS health check — no job description needed."
)
async def ats_check(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB")

    resume_text = parse_pdf(contents)

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    try:
        result = check_ats(resume_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS check failed: {str(e)}")