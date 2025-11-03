from fastapi import APIRouter

from app.api.v1.endpoints import (
    uploads,
    jobs,
    sites,
    verification,
    leaderboard,
    reports,
    metrics,
    rewards,
    chat,
    solar_detection
)

api_router = APIRouter()
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(sites.router, prefix="/site", tags=["sites"])
api_router.include_router(verification.router, prefix="/verify", tags=["verification"])
api_router.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])
api_router.include_router(reports.router, prefix="/report", tags=["reports"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(solar_detection.router, prefix="/solar", tags=["solar_detection"])

# Health check endpoint
@api_router.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}