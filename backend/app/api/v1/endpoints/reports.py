from fastapi import APIRouter, UploadFile, File
from app.models.schemas import FraudReportRequest, FraudReportResponse
from app.services.report_service import submit_fraud_report

router = APIRouter()

@router.post("/", response_model=FraudReportResponse)
async def submit_fraud_report_endpoint(
    sample_id: str,
    reason: str,
    attachment: UploadFile = File(None)
):
    """
    Citizen report endpoint to flag suspected fraud, includes reason and attachment uploads.
    """
    report = await submit_fraud_report(sample_id, reason, attachment)
    return report