# Model Card: Karnan Solar Panel Detection Model

## Model Details

- **Model Name**: Karnan Solar Panel Detector
- **Model Type**: Mock deterministic model (for demonstration)
- **Developed By**: Karnan Team
- **Version**: 1.0.0
- **Date**: 2023-01-15

## Model Overview

The Karnan Solar Panel Detection Model is designed to automatically detect and quantify solar panels in satellite/aerial imagery. The model processes rooftop images to determine the presence of solar panels, estimate the number of panels, calculate the total area, and estimate the energy generation capacity.

## Intended Use

This model is intended for:
- Government solar energy programs to verify installations
- Solar energy companies to assess market penetration
- Researchers studying renewable energy adoption
- Policy makers to understand solar deployment patterns

## Limitations

- The current implementation is a mock model for demonstration purposes
- Real-world performance would require training on actual solar panel imagery
- The model may not generalize well to different geographic regions without retraining
- Image quality and resolution significantly impact performance

## Metrics

For the mock model, we provide deterministic outputs based on input coordinates:
- **Detection F1 Score**: 0.85 (mock)
- **Area MAE**: 1.2 sq.m (mock)
- **Capacity RMSE**: 0.45 kW (mock)

## References

- [PM Surya Ghar Scheme](https://pmsuryaghar.gov.in/)
- [ISRO Bhuvan Platform](https://bhuvan.nrsc.gov.in/)
- [Google Earth Engine](https://earthengine.google.com/)

## Contact

For questions about this model, please contact the Karnan team.