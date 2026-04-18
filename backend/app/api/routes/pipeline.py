from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.resume.resume_parse import parse_pdf
from app.services.ai.analyzer import analyze_resume, check_ats
from app.services.ai.resume_tailor import generate_latex
from app.services.ai.cover_letter_generator import generate_cover_letter
from app.services.ai.interview_prep_generator import generate_interview_prep
import asyncio
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()

executor = ThreadPoolExecutor(max_workers=6)

async def run_in_thread(fn, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, fn, *args)


@router.post("/run")
async def run_pipeline(
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

    # run all agents in parallel
    tasks = await asyncio.gather(
        run_in_thread(check_ats, resume_text),
        run_in_thread(analyze_resume, resume_text, job_description),
        run_in_thread(generate_latex, resume_text, job_description),
        run_in_thread(generate_cover_letter, resume_text, job_description),
        run_in_thread(generate_interview_prep, resume_text, job_description),
        return_exceptions=True
    )

    def safe(result, fallback):
        if isinstance(result, Exception):
            return {"error": str(result), "failed": True}
        return result

    return {
        "ats_check":      safe(tasks[0], {}),
        "match_analysis": safe(tasks[1], {}),
        "latex_resume":   safe(tasks[2], ""),
        "cover_letter":   safe(tasks[3], {}),
        "interview_prep": safe(tasks[4], {}),
    }