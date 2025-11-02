from fastapi import APIRouter
from app.models.schemas import MetricsResponse
from app.services.metrics_service import get_system_metrics

router = APIRouter()

@router.get("/", response_model=MetricsResponse)
async def get_metrics_endpoint():
    """
    Returns detection & quantification metrics (F1, MAE, RMSE) aggregated across dataset and per-state breakdown.
    """
    metrics = await get_system_metrics()
    return metrics