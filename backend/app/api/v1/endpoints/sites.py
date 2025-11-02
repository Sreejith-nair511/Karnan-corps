from fastapi import APIRouter, HTTPException
from app.models.schemas import SiteVerificationResponse
from app.services.site_service import get_site_verification

router = APIRouter()

@router.get("/{sample_id}", response_model=SiteVerificationResponse)
async def get_site_verification_endpoint(sample_id: str):
    """
    Return the JSON verification record for a sample_id.
    """
    verification = await get_site_verification(sample_id)
    if not verification:
        raise HTTPException(status_code=404, detail="Site verification not found")
    return verification

@router.get("/{sample_id}/artifact/{artifact_type}")
async def get_site_artifact(sample_id: str, artifact_type: str):
    """
    Returns overlay image / certificate / raw images / mask.
    Artifact types: overlay, certificate, raw, mask
    """
    # TODO: Implement artifact retrieval
    return {"sample_id": sample_id, "artifact_type": artifact_type, "url": f"/data/outputs/{sample_id}/{artifact_type}"}