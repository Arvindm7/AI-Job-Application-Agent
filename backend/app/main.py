from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import test, resume , analyze, tailor_resume,cover_letter,interview_prep

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
app.include_router(resume.router, prefix="/resume", tags=["Resume-Text-Extraction"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])
app.include_router(tailor_resume.router, prefix="/tailor", tags=["Tailor-Resume"])
app.include_router(cover_letter.router, prefix="/cover-letter", tags=["Cover-Letter"])
app.include_router(interview_prep.router, prefix="/interview-prep", tags=["Interview-Prep"])

@app.get("/")
def root():
    return {"message": "AI Job Agent Backend Running 🚀"}
