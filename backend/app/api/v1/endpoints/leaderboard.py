from fastapi import APIRouter
from app.models.schemas import LeaderboardResponse
from app.services.reward_service import get_leaderboard

router = APIRouter()

@router.get("/", response_model=LeaderboardResponse)
async def get_leaderboard_endpoint():
    """
    Return top districts/homes by STP.
    """
    leaderboard = await get_leaderboard()
    return leaderboard