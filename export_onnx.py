"""
Export PyTorch models to ONNX format for solar panel detection
"""

import torch
import argparse
import os
from models.unet_model import UNet
from models.yolov5_model import YOLOv5

def export_unet_to_onnx(weights_path, img_size, batch_size, device):
    """Export U-Net model to ONNX format"""
    print(f"Exporting U-Net model to ONNX...")
    
    # Initialize model
    model = UNet(n_channels=3, n_classes=1)
    
    # Load weights
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
        print(f"Loaded weights from {weights_path}")
    else:
        print(f"Warning: Weights file {weights_path} not found. Exporting untrained model.")
    
    model.eval()
    
    # Create dummy input
    dummy_input = torch.randn(batch_size, 3, img_size[0], img_size[1])
    
    # Export to ONNX
    onnx_path = weights_path.replace('.pth', '.onnx')
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    
    print(f"U-Net model exported to {onnx_path}")

def export_yolov5_to_onnx(weights_path, img_size, batch_size, device):
    """Export YOLOv5 model to ONNX format"""
    print(f"Exporting YOLOv5 model to ONNX...")
    
    # Initialize model
    model = YOLOv5(nc=1)  # 1 class for solar panels
    
    # Load weights
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
        print(f"Loaded weights from {weights_path}")
    else:
        print(f"Warning: Weights file {weights_path} not found. Exporting untrained model.")
    
    model.eval()
    
    # Create dummy input
    dummy_input = torch.randn(batch_size, 3, img_size[0], img_size[1])
    
    # Export to ONNX
    onnx_path = weights_path.replace('.pth', '.onnx')
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    
    print(f"YOLOv5 model exported to {onnx_path}")

def main():
    parser = argparse.ArgumentParser(description='Export solar panel detection models to ONNX')
    parser.add_argument('--weights', type=str, required=True, help='Path to the model weights (.pth file)')
    parser.add_argument('--img', nargs=2, type=int, default=[512, 512], help='Image size (height width)')
    parser.add_argument('--batch', type=int, default=1, help='Batch size')
    parser.add_argument('--device', type=str, default='cpu', help='Device to use (cpu or cuda)')
    parser.add_argument('--model', type=str, choices=['unet', 'yolov5'], help='Model type (if not specified, inferred from filename)')
    
    args = parser.parse_args()
    
    # Determine model type
    if args.model:
        model_type = args.model
    else:
        # Infer from filename
        if 'unet' in args.weights.lower():
            model_type = 'unet'
        elif 'yolo' in args.weights.lower():
            model_type = 'yolov5'
        else:
            raise ValueError("Could not infer model type from filename. Please specify --model")
    
    # Export model
    if model_type == 'unet':
        export_unet_to_onnx(args.weights, args.img, args.batch, args.device)
    elif model_type == 'yolov5':
        export_yolov5_to_onnx(args.weights, args.img, args.batch, args.device)

if __name__ == '__main__':
    main()