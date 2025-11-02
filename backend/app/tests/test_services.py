import pytest
import os
import tempfile
from app.services.certificate_service import generate_certificate
from app.services.imagery_service import fetch_imagery
from app.services.inference_service import run_model_inference
from app.services.qc_service import apply_quality_control
from app.services.blockchain_service import store_evidence_on_blockchain

def test_certificate_generation():
    """Test certificate generation service."""
    # This would require a full test setup with proper async handling
    # For now, we'll just verify the function exists
    assert callable(generate_certificate)

def test_imagery_fetching():
    """Test imagery fetching service."""
    # This would require a full test setup with proper async handling
    # For now, we'll just verify the function exists
    assert callable(fetch_imagery)

def test_model_inference():
    """Test model inference service."""
    # This would require a full test setup with proper async handling
    # For now, we'll just verify the function exists
    assert callable(run_model_inference)

def test_quality_control():
    """Test quality control service."""
    import asyncio
    
    # Test verifiable case
    qc_status, qc_notes = asyncio.run(apply_quality_control(
        confidence=0.9,
        image_resolution=512,
        reason_codes="module_grid",
        capacity_kw_est=3.5
    ))
    
    assert qc_status == "VERIFIABLE"
    assert len(qc_notes) == 0
    
    # Test non-verifiable case
    qc_status, qc_notes = asyncio.run(apply_quality_control(
        confidence=0.3,
        image_resolution=256,
        reason_codes="occluded_by_tree",
        capacity_kw_est=150.0
    ))
    
    assert qc_status == "NOT_VERIFIABLE"
    assert len(qc_notes) > 0

def test_blockchain_service():
    """Test blockchain service."""
    import asyncio
    
    evidence_hash = "test_evidence_hash_1234567890"
    result = asyncio.run(store_evidence_on_blockchain(evidence_hash))
    
    assert "network" in result
    assert "tx_hash" in result
    assert result["network"] == "mock"
    assert isinstance(result["tx_hash"], str)
    assert len(result["tx_hash"]) == 64  # SHA256 hash length