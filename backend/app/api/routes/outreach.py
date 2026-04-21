from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.schemas.outreach_schema import OutreachRequest, OutreachResponse
from app.services.ai.outreach_generator import generate_outreach
from app.services.resume.resume_parse import parse_pdf

router = APIRouter()


@router.post(
    "/generate",
    response_model=OutreachResponse,
    summary="Cold Outreach Engine",
    description="Generate personalized cold emails and LinkedIn messages."
)
async def generate_outreach_messages(
    target_company: str = Form(...),
    outreach_type: str = Form(...),
    target_name: str = Form(""),
    target_role: str = Form(""),
    applying_role: str = Form(""),
    file: Optional[UploadFile] = File(None)
):
    resume_text = ""

    if file and file.filename:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files accepted")
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Max 5MB")
        from app.services.resume.resume_parse import parse_pdf
        resume_text = parse_pdf(contents)

    try:
        result = generate_outreach(
            target_company=target_company,
            outreach_type=outreach_type,
            target_name=target_name,
            target_role=target_role,
            applying_role=applying_role,
            resume_text=resume_text
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outreach generation failed: {str(e)}")