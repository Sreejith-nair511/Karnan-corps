import os
import uuid
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import qrcode
from io import BytesIO

async def generate_certificate(
    sample_id: str,
    lat: float,
    lon: float,
    capacity_kw_est: float,
    confidence: float,
    qc_status: str
) -> str:
    """
    Generate a digital certificate PDF for a verified solar installation.
    
    Args:
        sample_id: The sample ID
        lat: Latitude
        lon: Longitude
        capacity_kw_est: Estimated capacity in kW
        confidence: Confidence score
        qc_status: Quality control status
        
    Returns:
        Path to the generated certificate PDF
    """
    # Create certificates directory if it doesn't exist
    cert_dir = "data/certificates"
    os.makedirs(cert_dir, exist_ok=True)
    
    # Generate certificate filename
    cert_filename = f"{sample_id}_certificate.pdf"
    cert_path = os.path.join(cert_dir, cert_filename)
    
    # Create PDF
    doc = SimpleDocTemplate(cert_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph("Solar Installation Verification Certificate", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 0.2*inch))
    
    # Certificate ID
    cert_id = str(uuid.uuid4())
    cert_id_para = Paragraph(f"Certificate ID: {cert_id}", styles['Normal'])
    story.append(cert_id_para)
    story.append(Spacer(1, 0.2*inch))
    
    # Details
    details = [
        f"Sample ID: {sample_id}",
        f"Location: {lat}, {lon}",
        f"Estimated Capacity: {capacity_kw_est} kW",
        f"Confidence Score: {confidence}",
        f"QC Status: {qc_status}",
        f"Issue Date: {datetime.now().strftime('%Y-%m-%d')}"
    ]
    
    for detail in details:
        para = Paragraph(detail, styles['Normal'])
        story.append(para)
        story.append(Spacer(1, 0.1*inch))
    
    # QR Code linking to verification JSON
    qr_data = f"http://localhost:8000/api/v1/site/{sample_id}"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer, format='PNG')
    
    # Note: In a real implementation, we would add the QR code to the PDF
    # For simplicity, we're just generating it here
    
    # Build PDF
    doc.build(story)
    
    return cert_path