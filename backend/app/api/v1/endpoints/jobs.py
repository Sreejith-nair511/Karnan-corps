from fastapi import APIRouter, HTTPException
from app.models.schemas import JobStatusResponse
from app.services.job_service import get_job_status

router = APIRouter()

@router.get("/{job_id}", response_model=JobStatusResponse)
async def get_job_status_endpoint(job_id: str):
    """
    Get job status (queued / processing / done / failed) + progress.
    """
    status = await get_job_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")
    return status