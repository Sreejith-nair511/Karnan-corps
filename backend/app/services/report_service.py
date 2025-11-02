import os
import uuid
from app.models.schemas import FraudReportRequest, FraudReportResponse
from app.core.database import get_db
from app.models.models import FraudReport
from datetime import datetime

async def submit_fraud_report(sample_id: str, reason: str, attachment=None) -> FraudReportResponse:
    """
    Submit a fraud report.
    """
    # Generate a unique report ID
    report_id = str(uuid.uuid4())
    
    # Handle attachment if provided
    attachment_path = None
    attachment_url = None
    
    if attachment:
        # Save attachment to file system
        attachment_filename = f"{report_id}_{attachment.filename}"
        attachment_path = f"data/reports/{attachment_filename}"
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(attachment_path), exist_ok=True)
        
        # Save file
        with open(attachment_path, "wb") as buffer:
            content = await attachment.read()
            buffer.write(content)
        
        attachment_url = f"/{attachment_path}"
    
    # Save to database
    async with get_db() as db:
        report = FraudReport(
            id=report_id,
            sample_id=sample_id,
            reason=reason,
            attachment_path=attachment_path
        )
        db.add(report)
        await db.commit()
    
    # Create response
    return FraudReportResponse(
        report_id=report_id,
        sample_id=sample_id,
        reason=reason,
        attachment_url=attachment_url,
        submitted_at=datetime.now()
    )