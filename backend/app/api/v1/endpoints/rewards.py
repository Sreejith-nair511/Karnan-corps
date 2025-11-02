from fastapi import APIRouter
from app.models.schemas import RewardHistoryResponse
from app.services.reward_service import get_reward_history

router = APIRouter()

@router.get("/{sample_id}", response_model=RewardHistoryResponse)
async def get_reward_history_endpoint(sample_id: str):
    """
    Get reward history, points, and redeem options for a sample_id.
    """
    history = await get_reward_history(sample_id)
    return history