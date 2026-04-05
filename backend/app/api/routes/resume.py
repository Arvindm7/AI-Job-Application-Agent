from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume.resume_parse import parse_pdf

router = APIRouter()

@router.post("/parse", summary="Parse PDF Utility", description="Upload a PDF and extract raw text from it.")
async def upload_resume(file: UploadFile = File(...)):
    # validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()

    # validate file size (max 5MB)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB")

    text = parse_pdf(contents)

    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    return {
        "filename": file.filename,
        "character_count": len(text),
        "resume_text": text
    }