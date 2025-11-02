from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class JobResponse(BaseModel):
    job_id: str
    status: str
    progress: int

class JobStatusResponse(BaseModel):
    job_id: str
    status: str  # queued | processing | done | failed
    progress: int  # 0-100

class SingleVerificationRequest(BaseModel):
    sample_id: str
    lat: float
    lon: float
    image_urls: Optional[List[str]] = None

class SiteVerificationResponse(BaseModel):
    sample_id: str
    lat: float
    lon: float
    has_solar: Optional[bool]
    confidence: Optional[float]
    panel_count_est: Optional[int]
    pv_area_sqm_est: Optional[float]
    capacity_kw_est: Optional[float]
    qc_status: str  # VERIFIABLE | NOT_VERIFIABLE
    qc_notes: List[str]
    bbox_or_mask: Dict[str, Any]  # {type: bbox|mask, data: path-or-base64}
    image_metadata: Dict[str, Any]  # {source: mock|provider, capture_date: YYYY-MM-DD}
    detection_evidence_hash: str
    certificate_url: Optional[str]
    blockchain_tx: Dict[str, Any]  # {network: mock, tx_hash: ..., block: null}
    created_at: datetime
    updated_at: datetime

class LeaderboardEntry(BaseModel):
    rank: int
    sample_id: str
    stp_points: int
    location: str

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]

class FraudReportRequest(BaseModel):
    sample_id: str
    reason: str
    attachment_path: Optional[str] = None

class FraudReportResponse(BaseModel):
    report_id: str
    sample_id: str
    reason: str
    attachment_url: Optional[str] = None
    submitted_at: datetime

class MetricsResponse(BaseModel):
    detection_f1: float
    area_mae: float
    capacity_rmse: float
    per_state_breakdown: Dict[str, Dict[str, float]]
    top_failure_examples: List[Dict[str, Any]]

class RewardEntry(BaseModel):
    points: int
    reason: str
    issuance_date: datetime
    tx_hash: Optional[str]

class RewardHistoryResponse(BaseModel):
    sample_id: str
    total_points: int
    reward_history: List[RewardEntry]
    redeem_options: List[str]

class ChatRequest(BaseModel):
    lang: str  # en|hi|ml|ta
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    lang: str
    context: Optional[Dict[str, Any]] = None