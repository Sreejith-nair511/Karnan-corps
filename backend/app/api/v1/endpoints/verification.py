from fastapi import APIRouter
from app.models.schemas import SingleVerificationRequest, SiteVerificationResponse
from app.services.verification_service import verify_single_site

router = APIRouter()

@router.post("/single", response_model=SiteVerificationResponse)
async def verify_single_site_endpoint(request: SingleVerificationRequest):
    """
    Accepts JSON: { sample_id, lat, lon, optional image_urls } to run one-off verification synchronously.
    """
    result = await verify_single_site(request)
    return result