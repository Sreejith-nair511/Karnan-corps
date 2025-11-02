#!/usr/bin/env python3
"""
Simple demo script for Karnan Solar Verification Backend
This script demonstrates the full pipeline without Docker Compose
"""

import asyncio
import httpx
import json
import os
import sys

# Add the app directory to the path so we can import our modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.services.verification_service import verify_single_site
from app.models.schemas import SingleVerificationRequest

async def run_simple_demo():
    """Run a simple demo of the solar verification pipeline"""
    print("=== Karnan Solar Verification Demo ===")
    print("Running verification for sample sites...\n")
    
    # Sample sites to verify
    sample_sites = [
        {"sample_id": "site_001", "lat": 28.6139, "lon": 77.2090},  # Delhi
        {"sample_id": "site_002", "lat": 19.0760, "lon": 72.8777},  # Mumbai
        {"sample_id": "site_003", "lat": 12.9716, "lon": 77.5946},  # Karnataka
    ]
    
    # Run verification for each site
    for site in sample_sites:
        print(f"Verifying site: {site['sample_id']}")
        print(f"Location: {site['lat']}, {site['lon']}")
        
        try:
            # Create verification request
            request = SingleVerificationRequest(
                sample_id=site["sample_id"],
                lat=site["lat"],
                lon=site["lon"]
            )
            
            # Run verification
            result = await verify_single_site(request)
            
            # Print results
            print(f"  Has solar: {result.has_solar}")
            print(f"  Confidence: {result.confidence:.2f}")
            print(f"  Panel count: {result.panel_count_est}")
            print(f"  Capacity: {result.capacity_kw_est} kW")
            print(f"  QC status: {result.qc_status}")
            print(f"  Certificate URL: {result.certificate_url}")
            print()
            
        except Exception as e:
            print(f"  Error verifying site: {e}")
            print()
    
    print("=== Demo Results ===")
    print("Audit folders are located in: data/outputs/")
    print("Certificates are located in: data/certificates/")
    print("Images are located in: data/images/")
    print("\nDemo completed successfully!")

if __name__ == "__main__":
    asyncio.run(run_simple_demo())