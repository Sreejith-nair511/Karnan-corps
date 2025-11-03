# Solar Panel Detection Feature

This document explains how to use the AI-powered solar panel detection feature integrated into the EcoInnovators platform.

## Overview

The solar panel detection feature allows users to:
1. Upload aerial or satellite images
2. Automatically detect and segment solar panels using pretrained AI models
3. Measure the area and estimate energy capacity of detected solar installations
4. Export results in multiple formats

## Supported Models

1. **U-Net** - Segmentation model for precise boundary detection
2. **YOLOv5** - Object detection model for fast detection

## API Endpoints

### Detect Solar Panels

```
POST /api/v1/solar/detect
```

**Parameters:**
- `image` (file): Uploaded image file (JPG, PNG, TIFF)
- `sample_id` (string): Unique identifier for the sample
- `lat` (float): Latitude coordinate
- `lon` (float): Longitude coordinate
- `model_type` (string): Model to use ("unet" or "yolov5")

**Response:**
Returns a `SiteVerificationResponse` with detection results including:
- Whether solar panels were detected
- Confidence score
- Estimated panel count
- Total area in square meters
- Estimated capacity in kW
- CO₂ offset estimation

## Frontend Interface

The solar detection feature is accessible through a dedicated page at `/solar-detection` with:

1. **File Upload Area** - Drag and drop or click to upload images
2. **Coordinate Input** - Enter latitude and longitude
3. **Sample ID** - Unique identifier for tracking
4. **Model Selection** - Choose between U-Net and YOLOv5
5. **Detection Button** - Process the image
6. **Results Display** - Visualize detection results
7. **Export Options** - Export results as JSON or CSV

## Model Installation

To use the actual AI models:

1. Clone the original repository:
   ```bash
   git clone https://github.com/saizk/Deep-Learning-for-Solar-Panel-Recognition.git
   ```

2. Follow the training instructions to generate model weights

3. Place the `.pth` files in the `weights/` directory:
   - `unet_final.pth` for U-Net model
   - `yolov5_final.pth` for YOLOv5 model

## Technical Implementation

### Backend Services

- **solar_detection_service.py** - Core detection logic
- **solar_detection.py** - API endpoint
- **models/** - PyTorch model implementations
- **weights/** - Pretrained model weights

### Frontend Components

- **/app/solar-detection/page.tsx** - Main detection interface
- **Navbar integration** - Added "Solar Detection" link

## Future Enhancements

1. **ONNX Runtime Support** - For faster inference
2. **Map Integration** - Display results on interactive maps
3. **Batch Processing** - Process multiple images simultaneously
4. **Model Comparison** - Compare results from different models
5. **Real-time Feedback** - Show progress during detection