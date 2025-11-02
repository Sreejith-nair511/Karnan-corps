from typing import Tuple, List

async def apply_quality_control(
    confidence: float,
    image_resolution: int,
    reason_codes: str,
    capacity_kw_est: float
) -> Tuple[str, List[str]]:
    """
    Apply quality control rules to determine if a verification is verifiable.
    
    Args:
        confidence: Model confidence score
        image_resolution: Image resolution in pixels
        reason_codes: Reason codes from model inference
        capacity_kw_est: Estimated capacity in kW
        
    Returns:
        Tuple of (qc_status, qc_notes)
    """
    qc_notes = []
    
    # Check confidence threshold
    confidence_threshold = 0.7  # This would come from config in a real implementation
    if confidence < confidence_threshold:
        qc_notes.append("Low confidence score")
    
    # Check image resolution
    min_resolution = 512  # This would come from config in a real implementation
    if image_resolution < min_resolution:
        qc_notes.append("Low image resolution")
    
    # Check for occlusion or cloudiness (mock detection)
    if "occluded_by_tree" in reason_codes or "cloudy" in reason_codes:
        qc_notes.append("Image occlusion or cloudiness detected")
    
    # Check for inconsistent capacity (mock detection)
    if capacity_kw_est and capacity_kw_est > 100:  # Unrealistic capacity
        qc_notes.append("Unrealistic capacity estimate")
    
    # Determine QC status
    if len(qc_notes) == 0:
        qc_status = "VERIFIABLE"
    else:
        qc_status = "NOT_VERIFIABLE"
    
    return qc_status, qc_notes