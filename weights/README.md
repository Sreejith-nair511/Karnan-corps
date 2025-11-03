# Solar Panel Detection Model Weights

This directory contains the pretrained model weights for solar panel detection.

## Models

1. **U-Net Model** (`unet_final.pth`)
   - Segmentation model for precise solar panel boundary detection
   - Based on the implementation from [saizk/Deep-Learning-for-Solar-Panel-Recognition](https://github.com/saizk/Deep-Learning-for-Solar-Panel-Recognition)

2. **YOLOv5 Model** (`yolov5_final.pth`)
   - Object detection model for fast solar panel detection
   - Based on the implementation from [saizk/Deep-Learning-for-Solar-Panel-Recognition](https://github.com/saizk/Deep-Learning-for-Solar-Panel-Recognition)

## How to Obtain Weights

To use the solar panel detection functionality, you need to download the pretrained model weights:

1. Clone the original repository:
   ```bash
   git clone https://github.com/saizk/Deep-Learning-for-Solar-Panel-Recognition.git
   ```

2. Follow the training instructions in the repository to generate the model weights, or download pretrained weights if available.

3. Place the generated `.pth` files in this directory:
   - `unet_final.pth` for the U-Net model
   - `yolov5_final.pth` for the YOLOv5 model

## Model Conversion (Optional)

You can convert the PyTorch models to ONNX format for broader compatibility:

```bash
# For U-Net
python export_onnx.py --weights weights/unet_final.pth --img 512 512 --batch 1 --device cpu

# For YOLOv5
python export_onnx.py --weights weights/yolov5_final.pth --img 640 640 --batch 1 --device cpu
```

## Usage

The models are automatically loaded by the solar detection service when you run the detection endpoint:

```
POST /api/v1/solar/detect
```

The service will automatically detect which model to use based on the `model_type` parameter.