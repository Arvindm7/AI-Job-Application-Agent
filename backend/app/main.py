from fastapi import FastAPI
from app.api.routes import test, resume

app = FastAPI(
    title="AI Job Agent",
    version="1.0.0"
)

app.include_router(test.router, prefix="/test",tags=["Test"])
app.include_router(resume.router, prefix="/resume", tags=["Resume"])

@app.get("/")
def root():
    return {"message": "AI Job Agent Backend Running 🚀"}
