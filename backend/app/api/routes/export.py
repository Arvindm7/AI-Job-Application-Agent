from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.services.export.pack import build_zip_package

router = APIRouter()


@router.post(
    "/package",
    summary="Export Full Job Application Package",
    description="Pass pipeline results and get a ZIP with resume, cover letter, reports and interview prep."
)
def export_package(pipeline_result: dict):
    try:
        zip_bytes = build_zip_package(pipeline_result)
        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=job_application_package.zip"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")