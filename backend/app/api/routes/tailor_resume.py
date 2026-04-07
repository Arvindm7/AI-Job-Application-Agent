from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.resume.resume_parse import parse_pdf
from app.services.ai.resume_tailor import  generate_latex
from fastapi.responses import PlainTextResponse

router = APIRouter()

@router.post(
    "/resume/latex",
    response_class=PlainTextResponse,
    summary="Get ATS Optimized LaTeX Resume",
    description="Upload resume PDF and job description — returns raw LaTeX ready to paste into Overleaf."
)
async def tailor_latex(
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
        latex = generate_latex(resume_text, job_description)
        return latex
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LaTeX generation failed: {str(e)}")
    