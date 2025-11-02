from typing import Optional
from app.models.schemas import SiteVerificationResponse
from app.core.database import get_db
from app.models.models import SiteVerification
from datetime import datetime

async def get_site_verification(sample_id: str) -> Optional[SiteVerificationResponse]:
    """
    Get site verification data by sample_id.
    """
    async with get_db() as db:
        verification = await db.query(SiteVerification).filter(SiteVerification.sample_id == sample_id).first()
        if verification:
            return SiteVerificationResponse(
                sample_id=verification.sample_id,
                lat=verification.lat,
                lon=verification.lon,
                has_solar=verification.has_solar,
                confidence=verification.confidence,
                panel_count_est=verification.panel_count_est,
                pv_area_sqm_est=verification.pv_area_sqm_est,
                capacity_kw_est=verification.capacity_kw_est,
                qc_status=verification.qc_status,
                qc_notes=verification.qc_notes or [],
                bbox_or_mask=verification.bbox_or_mask or {},
                image_metadata=verification.image_metadata or {},
                detection_evidence_hash=verification.detection_evidence_hash or "",
                certificate_url=verification.certificate_url,
                blockchain_tx=verification.blockchain_tx or {},
                created_at=verification.created_at or datetime.now(),
                updated_at=verification.updated_at or datetime.now()
            )
        return None