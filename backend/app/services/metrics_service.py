from app.models.schemas import MetricsResponse

async def get_system_metrics() -> MetricsResponse:
    """
    Get system metrics.
    This is a mock implementation for demonstration.
    """
    # Mock metrics data
    per_state_breakdown = {
        "Delhi": {
            "detection_f1": 0.85,
            "area_mae": 1.2,
            "capacity_rmse": 0.45
        },
        "Mumbai": {
            "detection_f1": 0.78,
            "area_mae": 1.8,
            "capacity_rmse": 0.62
        },
        "Bangalore": {
            "detection_f1": 0.92,
            "area_mae": 0.9,
            "capacity_rmse": 0.32
        }
    }
    
    top_failure_examples = [
        {"sample_id": "fail_001", "reason": "Low confidence", "lat": 12.97, "lon": 77.59},
        {"sample_id": "fail_002", "reason": "Cloudy image", "lat": 19.07, "lon": 72.87},
        {"sample_id": "fail_003", "reason": "Occlusion", "lat": 28.70, "lon": 77.10},
        {"sample_id": "fail_004", "reason": "Low resolution", "lat": 13.08, "lon": 80.27},
        {"sample_id": "fail_005", "reason": "Ambiguous shape", "lat": 22.57, "lon": 88.36}
    ]
    
    return MetricsResponse(
        detection_f1=0.85,
        area_mae=1.3,
        capacity_rmse=0.45,
        per_state_breakdown=per_state_breakdown,
        top_failure_examples=top_failure_examples
    )