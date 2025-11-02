import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import SingleVerificationRequest

client = TestClient(app)

def test_single_verification():
    # Test data
    test_request = {
        "sample_id": "test_001",
        "lat": 28.6139,
        "lon": 77.2090
    }
    
    response = client.post("/api/v1/verify/single", json=test_request)
    assert response.status_code == 200
    
    data = response.json()
    assert data["sample_id"] == test_request["sample_id"]
    assert data["lat"] == test_request["lat"]
    assert data["lon"] == test_request["lon"]
    assert "has_solar" in data
    assert "confidence" in data
    assert "qc_status" in data

def test_single_verification_missing_fields():
    # Test with missing required fields
    incomplete_request = {
        "sample_id": "test_002",
        "lat": 28.6139
        # lon is missing
    }
    
    response = client.post("/api/v1/verify/single", json=incomplete_request)
    assert response.status_code == 422  # Validation error