import pytest
from app.models.models import SiteVerification, Job, Reward, FraudReport, ChatMessage
from datetime import datetime

def test_site_verification_model():
    """Test SiteVerification model creation."""
    site = SiteVerification(
        sample_id="test_001",
        lat=28.6139,
        lon=77.2090,
        has_solar=True,
        confidence=0.95,
        panel_count_est=12,
        pv_area_sqm_est=20.5,
        capacity_kw_est=3.5,
        qc_status="VERIFIABLE",
        qc_notes=["High confidence", "Clear panels"],
        bbox_or_mask={"type": "bbox", "data": "test_data"},
        image_metadata={"source": "mock", "capture_date": "2023-01-15"},
        detection_evidence_hash="test_hash_123",
        certificate_url="/certificates/test_001.pdf",
        blockchain_tx={"network": "mock", "tx_hash": "tx_123", "block": None}
    )
    
    assert site.sample_id == "test_001"
    assert site.lat == 28.6139
    assert site.lon == 77.2090
    assert site.has_solar == True
    assert site.confidence == 0.95
    assert site.panel_count_est == 12
    assert site.pv_area_sqm_est == 20.5
    assert site.capacity_kw_est == 3.5
    assert site.qc_status == "VERIFIABLE"
    assert site.qc_notes == ["High confidence", "Clear panels"]
    assert site.bbox_or_mask == {"type": "bbox", "data": "test_data"}
    assert site.image_metadata == {"source": "mock", "capture_date": "2023-01-15"}
    assert site.detection_evidence_hash == "test_hash_123"
    assert site.certificate_url == "/certificates/test_001.pdf"
    assert site.blockchain_tx == {"network": "mock", "tx_hash": "tx_123", "block": None}

def test_job_model():
    """Test Job model creation."""
    job = Job(
        status="processing",
        progress=50
    )
    
    assert job.status == "processing"
    assert job.progress == 50

def test_reward_model():
    """Test Reward model creation."""
    reward = Reward(
        sample_id="test_001",
        points=100,
        reason="Verified solar installation",
        tx_hash="tx_reward_123"
    )
    
    assert reward.sample_id == "test_001"
    assert reward.points == 100
    assert reward.reason == "Verified solar installation"
    assert reward.tx_hash == "tx_reward_123"

def test_fraud_report_model():
    """Test FraudReport model creation."""
    report = FraudReport(
        sample_id="test_001",
        reason="Suspicious installation",
        attachment_path="/reports/test_001.jpg"
    )
    
    assert report.sample_id == "test_001"
    assert report.reason == "Suspicious installation"
    assert report.attachment_path == "/reports/test_001.jpg"
    assert report.reviewed == False

def test_chat_message_model():
    """Test ChatMessage model creation."""
    message = ChatMessage(
        lang="en",
        message="What are the requirements for PM Surya Ghar?",
        response="You need to be a resident of India with a suitable rooftop.",
        context={"user_id": "user_123"}
    )
    
    assert message.lang == "en"
    assert message.message == "What are the requirements for PM Surya Ghar?"
    assert message.response == "You need to be a resident of India with a suitable rooftop."
    assert message.context == {"user_id": "user_123"}