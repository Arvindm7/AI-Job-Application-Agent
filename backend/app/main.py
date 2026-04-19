from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import test, resume , analyze, tailor_resume,cover_letter,interview_prep,jobs_search, pipeline, export, company, outreach
app = FastAPI(
    title="AI Job Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test.router, prefix="/test",tags=["Test"])
app.include_router(resume.router, prefix="/resume_parser", tags=["Resume-Text-Extraction"])
app.include_router(analyze.router, prefix="/analyze_resume", tags=["Analyze"])
app.include_router(tailor_resume.router, prefix="/tailor_resume", tags=["Tailor-Resume"])
app.include_router(cover_letter.router, prefix="/cover_letter", tags=["Cover-Letter"])
app.include_router(interview_prep.router, prefix="/interview_prep", tags=["Interview-Prep"])
app.include_router(jobs_search.router, prefix="/jobs_search", tags=["Job-Search"])
app.include_router(pipeline.router, prefix="/pipeline", tags=["Pipeline"])
app.include_router(export.router, prefix="/export", tags=["Export"])
app.include_router(company.router, prefix="/company", tags=["Company-Research"])
app.include_router(outreach.router, prefix="/outreach", tags=["Outreach"])


@app.get("/")
def root():
    return {"message": "AI Job Agent Backend Running 🚀"}
