#!/usr/bin/env python3

"""
Evaluation script for Karnan Solar Verification System
Computes:
- Detection F1 on has_solar
- Area MAE
- Capacity RMSE
"""

import json
import argparse
import sys
from typing import Dict, List, Tuple
from sklearn.metrics import f1_score, mean_absolute_error, mean_squared_error
import numpy as np

def load_json_file(filepath: str) -> Dict:
    """Load JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)

def compute_detection_f1(predictions: List[Dict], groundtruth: List[Dict]) -> float:
    """Compute F1 score for has_solar detection."""
    pred_labels = [1 if p.get('has_solar', False) else 0 for p in predictions]
    gt_labels = [1 if g.get('has_solar', False) else 0 for g in groundtruth]
    
    if len(set(gt_labels)) == 1:  # All same class
        return 1.0 if pred_labels == gt_labels else 0.0
    
    return f1_score(gt_labels, pred_labels, zero_division=0)

def compute_area_mae(predictions: List[Dict], groundtruth: List[Dict]) -> float:
    """Compute MAE for pv_area_sqm_est."""
    pred_areas = [p.get('pv_area_sqm_est', 0) or 0 for p in predictions]
    gt_areas = [g.get('pv_area_sqm_est', 0) or 0 for g in groundtruth]
    
    return mean_absolute_error(gt_areas, pred_areas)

def compute_capacity_rmse(predictions: List[Dict], groundtruth: List[Dict]) -> float:
    """Compute RMSE for capacity_kw_est."""
    pred_cap = [p.get('capacity_kw_est', 0) or 0 for p in predictions]
    gt_cap = [g.get('capacity_kw_est', 0) or 0 for g in groundtruth]
    
    return np.sqrt(mean_squared_error(gt_cap, pred_cap))

def main():
    parser = argparse.ArgumentParser(description='Evaluate Karnan predictions against ground truth')
    parser.add_argument('--pred', type=str, required=True, help='Path to predictions JSON file')
    parser.add_argument('--gt', type=str, required=True, help='Path to ground truth JSON file')
    
    args = parser.parse_args()
    
    try:
        predictions = load_json_file(args.pred)
        groundtruth = load_json_file(args.gt)
        
        # Convert to lists if they're dictionaries keyed by sample_id
        if isinstance(predictions, dict):
            predictions = list(predictions.values())
        if isinstance(groundtruth, dict):
            groundtruth = list(groundtruth.values())
        
        # Ensure same length
        if len(predictions) != len(groundtruth):
            print(f"Warning: Prediction count ({len(predictions)}) != Ground truth count ({len(groundtruth)})")
        
        # Compute metrics
        f1 = compute_detection_f1(predictions, groundtruth)
        mae = compute_area_mae(predictions, groundtruth)
        rmse = compute_capacity_rmse(predictions, groundtruth)
        
        print("=== Karnan Evaluation Results ===")
        print(f"Detection F1 Score: {f1:.4f}")
        print(f"Area MAE: {mae:.4f} sq.m")
        print(f"Capacity RMSE: {rmse:.4f} kW")
        
        return 0
        
    except Exception as e:
        print(f"Error during evaluation: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())