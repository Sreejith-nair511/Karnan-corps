import os
import uuid
from typing import Dict, Any
from app.models.schemas import SingleVerificationRequest, SiteVerificationResponse
from app.core.database import get_db
from app.models.models import SiteVerification
from datetime import datetime

async def verify_single_site(request: SingleVerificationRequest) -> SiteVerificationResponse:
    """
    Run single site verification synchronously.
    This is a mock implementation for demonstration.
    """
    # Generate a mock verification result
    has_solar = request.lat > 0  # Simple mock logic
    confidence = 0.85 if has_solar else 0.2
    panel_count = 12 if has_solar else None
    pv_area = 20.5 if has_solar else None
    capacity = 3.5 if has_solar else None
    
    # Mock QC status
    qc_status = "VERIFIABLE" if confidence > 0.7 else "NOT_VERIFIABLE"
    qc_notes = [] if qc_status == "VERIFIABLE" else ["Low confidence score"]
    
    # Mock bbox/mask
    bbox_or_mask = {
        "type": "bbox",
        "data": "mock_bbox_data"
    }
    
    # Mock image metadata
    image_metadata = {
        "source": "mock",
        "capture_date": "2023-01-15"
    }
    
    # Mock evidence hash
    detection_evidence_hash = str(uuid.uuid4())
    
    # Mock certificate URL
    certificate_url = f"/data/outputs/{request.sample_id}/certificate.pdf" if has_solar and qc_status == "VERIFIABLE" else None
    
    # Mock blockchain transaction
    blockchain_tx = {
        "network": "mock",
        "tx_hash": str(uuid.uuid4()) if has_solar and qc_status == "VERIFIABLE" else None,
        "block": None
    }
    
    # Create the response
    response = SiteVerificationResponse(
        sample_id=request.sample_id,
        lat=request.lat,
        lon=request.lon,
        has_solar=has_solar,
        confidence=confidence,
        panel_count_est=panel_count,
        pv_area_sqm_est=pv_area,
        capacity_kw_est=capacity,
        qc_status=qc_status,
        qc_notes=qc_notes,
        bbox_or_mask=bbox_or_mask,
        image_metadata=image_metadata,
        detection_evidence_hash=detection_evidence_hash,
        certificate_url=certificate_url,
        blockchain_tx=blockchain_tx,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    # Save to database
    await save_verification_result(response)
    
    return response

async def save_verification_result(result: SiteVerificationResponse):
    """
    Save verification result to database.
    """
    async with get_db() as db:
        verification = SiteVerification(
            sample_id=result.sample_id,
            lat=result.lat,
            lon=result.lon,
            has_solar=result.has_solar,
            confidence=result.confidence,
            panel_count_est=result.panel_count_est,
            pv_area_sqm_est=result.pv_area_sqm_est,
            capacity_kw_est=result.capacity_kw_est,
            qc_status=result.qc_status,
            qc_notes=result.qc_notes,
            bbox_or_mask=result.bbox_or_mask,
            image_metadata=result.image_metadata,
            detection_evidence_hash=result.detection_evidence_hash,
            certificate_url=result.certificate_url,
            blockchain_tx=result.blockchain_tx
        )
        db.add(verification)
        await db.commit()