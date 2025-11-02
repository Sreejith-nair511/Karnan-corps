from typing import List
from app.models.schemas import LeaderboardResponse, LeaderboardEntry, RewardHistoryResponse, RewardEntry
from app.core.database import get_db
from app.models.models import Reward

async def get_leaderboard() -> LeaderboardResponse:
    """
    Get the reward leaderboard.
    This is a mock implementation for demonstration.
    """
    # Mock leaderboard data
    entries = [
        LeaderboardEntry(rank=1, sample_id="sample_001", stp_points=1500, location="Delhi"),
        LeaderboardEntry(rank=2, sample_id="sample_002", stp_points=1200, location="Mumbai"),
        LeaderboardEntry(rank=3, sample_id="sample_003", stp_points=1000, location="Bangalore"),
        LeaderboardEntry(rank=4, sample_id="sample_004", stp_points=900, location="Chennai"),
        LeaderboardEntry(rank=5, sample_id="sample_005", stp_points=800, location="Kolkata"),
    ]
    
    return LeaderboardResponse(entries=entries)

async def get_reward_history(sample_id: str) -> RewardHistoryResponse:
    """
    Get reward history for a sample_id.
    """
    async with get_db() as db:
        rewards = await db.query(Reward).filter(Reward.sample_id == sample_id).all()
        
        reward_entries = []
        total_points = 0
        
        for reward in rewards:
            reward_entries.append(
                RewardEntry(
                    points=reward.points,
                    reason=reward.reason,
                    issuance_date=reward.issuance_date,
                    tx_hash=reward.tx_hash
                )
            )
            total_points += reward.points or 0
        
        return RewardHistoryResponse(
            sample_id=sample_id,
            total_points=total_points,
            reward_history=reward_entries,
            redeem_options=["Discount Coupons", "Solar Equipment Voucher", "Cashback"]
        )