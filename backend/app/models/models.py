from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB, UUID
import uuid

Base = declarative_base()

class SiteVerification(Base):
    __tablename__ = "site_verifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sample_id = Column(String, unique=True, index=True)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    has_solar = Column(Boolean)
    confidence = Column(Float)
    panel_count_est = Column(Integer)
    pv_area_sqm_est = Column(Float)
    capacity_kw_est = Column(Float)
    qc_status = Column(String)  # VERIFIABLE | NOT_VERIFIABLE
    qc_notes = Column(JSONB)  # List of strings
    bbox_or_mask = Column(JSONB)  # {type: bbox|mask, data: path-or-base64}
    image_metadata = Column(JSONB)  # {source: mock|provider, capture_date: YYYY-MM-DD}
    detection_evidence_hash = Column(String)
    certificate_url = Column(String)
    blockchain_tx = Column(JSONB)  # {network: mock, tx_hash: ..., block: null}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String)  # queued | processing | done | failed
    progress = Column(Integer, default=0)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sample_id = Column(String, ForeignKey("site_verifications.sample_id"))
    points = Column(Integer)
    issuance_date = Column(DateTime(timezone=True), server_default=func.now())
    reason = Column(String)
    tx_hash = Column(String)  # For blockchain stub
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FraudReport(Base):
    __tablename__ = "fraud_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sample_id = Column(String)
    reason = Column(Text)
    attachment_path = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed = Column(Boolean, default=False)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lang = Column(String)  # en|hi|ml|ta
    message = Column(Text)
    response = Column(Text)
    context = Column(JSONB)  # Optional context
    created_at = Column(DateTime(timezone=True), server_default=func.now())