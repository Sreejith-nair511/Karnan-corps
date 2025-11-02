from fastapi import APIRouter, UploadFile, File, Depends
from uuid import uuid4
from app.models.schemas import JobResponse
from app.services.job_service import enqueue_csv_processing

router = APIRouter()

@router.post("/csv", response_model=JobResponse)
async def upload_csv(file: UploadFile = File(...)):
    """
    Accept CSV upload of sites. Returns job_id.
    Expected CSV columns: sample_id, lat, lon, optional hint fields
    """
    # Generate a unique job ID
    job_id = str(uuid4())
    
    # Save the uploaded file temporarily
    file_path = f"data/temp/{job_id}_{file.filename}"
    
    # Create directory if it doesn't exist
    import os
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Enqueue the job for processing
    await enqueue_csv_processing(job_id, file_path)
    
    return JobResponse(
        job_id=job_id,
        status="queued",
        progress=0
    )