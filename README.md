# AI Solar Verification Platform - Futuristic Redesign

License: MIT | Next.js 14 | Python 3.8+

This is a futuristic redesign of the AI Solar Verification Platform for India, built for the EcoInnovators Ideathon 2026 Challenge: AI-Powered Rooftop PV Detection. The platform features a modern UI with transparency, clean energy insights, and reward tracking while implementing the core challenge requirements for remote verification of rooftop solar installations.

## Challenge Overview

PM Surya Ghar: Muft Bijli Yojana is a government scheme aiming to provide free electricity to households in India. With an investment of over Rs. 75,000 crores, the scheme aims to light up 1 crore households by providing up to 300 units of free electricity every month.

Our solution addresses the governance need to verify rooftop solar installations remotely, ensuring subsidies reach genuine beneficiaries while maintaining public trust. The platform answers the critical question: "Has a rooftop solar system actually been installed here?"

## Core Objectives Implementation

### 1. Automated Image Retrieval
- Fetch high-resolution rooftop images for given coordinates using Google Static Maps API or ESRI API
- Handle geocoding jitters in WGS84 coordinates
- Support for multiple imagery sources

### 2. AI-Powered Classification
- Binary classification: Present / Not Present within buffer zones
- Support for 1200 sq. ft and 2400 sq. ft radius buffer zones
- Calibrated confidence scoring for reliable decision-making

### 3. Area Quantification
- Estimate total panel area (m²) with largest overlap calculation
- Accurate measurements for subsidy verification

### 4. Explainability & Auditability
- Generate polygon masks or bounding boxes for visual verification
- Quality Control (QC) status reporting
- Human-readable audit overlays

### 5. Structured Output Storage
- JSON records with standardized schema
- Artifact storage for audit purposes

## Inputs & Outputs

### Input Data (.xlsx file)
| Field | Description |
|-------|-------------|
| sample_id | Unique identifier for each site |
| latitude, longitude | WGS84 coordinates (may include small geocoding jitters) |

### Mandatory Output (JSON record per site)
```json
{
  "sample_id": 1234,
  "lat": 12.9716,
  "lon": 77.5946,
  "has_solar": true,
  "confidence": 0.92,
  "pv_area_sqm_est": 23.5,
  "buffer_radius_sqft": 1200,
  "qc_status": "VERIFIABLE",
  "bbox_or_mask": "<encoded polygon or bbox>",
  "image_metadata": {
    "source": "XYZ", 
    "capture_date": "YYYY-MM-DD"
  }
}
```

### Human-Readable Artifacts
- Audit overlay PNG/JPEG with polygon or bounding boxes
- Visual verification reports
- Confidence heatmaps

## Provided Data & Resources

We utilize images from the following sources to train our models:

1. Source 1: Alfred Weber Institute of Economics (Roboflow)
2. Source 2: LSGI547 Project (Roboflow)
3. Source 3: Piscinas Y Tenistable (Roboflow)

All sources are properly cited and used in compliance with their respective licenses.

## Technology Stack

### Frontend
- Framework: Next.js 15 with App Router
- Language: TypeScript
- Styling: Tailwind CSS with custom animations
- UI Components: Shadcn/ui, Lucide React icons
- State Management: React Context API
- Data Fetching: SWR
- Animations: Framer Motion
- Data Visualization: Recharts, React Simple Maps
- Internationalization: next-intl

### Backend
- Framework: FastAPI
- Language: Python 3.8+
- AI/ML Libraries: PyTorch, ONNX Runtime
- Computer Vision: OpenCV, Pillow
- Geospatial: GeoPandas
- API Documentation: Swagger UI

### AI Models
- Segmentation: U-Net for precise boundary detection
- Object Detection: YOLOv5 for fast detection
- Vision AI: Mistral AI Vision API for enhanced accuracy

## Key Features

### Futuristic UI Design
- Modern glassmorphism design with gradient backgrounds
- Animated solar wave background effect
- Smooth transitions and micro-interactions
- Responsive layout for all device sizes
- Dark/light mode support

### Enhanced Navigation
- Futuristic navbar with gradient logo
- Mobile-friendly navigation drawer
- Sticky header that adapts on scroll

### Dashboard Visualizations
- Interactive India map with heatmap visualization
- Real-time verification statistics with animated counters
- Progress tracking with visual indicators
- Rewards dashboard with charts and leaderboards

### AI-Powered Solar Panel Detection
- Upload aerial or satellite images for automatic solar panel detection
- Support for both segmentation (U-Net) and detection (YOLOv5) models
- Measure area and estimate energy capacity of solar installations
- Export results in multiple formats (JSON, CSV)
- Visualize detection results with overlays

### Component Improvements
- Modern card designs with glassmorphism effects
- Animated data visualizations
- Enhanced form components
- Improved accessibility features

## Design Highlights

### Color Scheme
- Primary: Solar Gold (#EAB308)
- Secondary: Eco Green (#10B981)
- Accent: Solar Orange (#F97316)

### Typography
- Headings: Space Grotesk
- Body: Urbanist

### Animations
- Entrance animations for all components
- Hover effects on interactive elements
- Smooth transitions between states
- Animated progress indicators

## Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly navigation
- Optimized performance on all devices

## Accessibility Features
- High contrast mode
- Font size adjustment
- Keyboard navigation support
- Screen reader compatibility
- Skip-to-content links

## Architecture

```
├── frontend/                 # Next.js React Application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable UI components
│   ├── public/              # Static assets
│   └── styles/              # Global styles
├── backend/                 # FastAPI Backend
│   ├── app/                 # API routes and business logic
│   ├── models/              # AI/ML models
│   ├── services/            # Business services
│   └── utils/              # Utility functions
├── weights/                 # Pre-trained model weights
├── data/                    # Sample data and resources
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- pnpm (preferred package manager)

### Frontend Setup
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload
```

### Environment Variables
Create a `.env` file in the root directory:
```env
# Backend
DATABASE_URL=sqlite:///./test.db
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
ROBOFLOW_API_KEY=your_roboflow_key
OPENAI_API_KEY=your_openai_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Solar Panel Detection Feature

### Accessing the Feature
- Navigate to `/solar-detection` in the web application
- Or use the "Solar Detection" link in the main navigation

### Supported Models
1. U-Net - Segmentation model for precise boundary detection
2. YOLOv5 - Object detection model for fast detection
3. Mistral AI Vision - Advanced vision model for enhanced accuracy

### Usage
1. Upload an aerial or satellite image (JPG, PNG, TIFF)
2. Enter coordinates and sample ID
3. Select detection model
4. Click "Detect Panels"
5. View results and export data

### Model Installation
To use the actual AI models:
1. Clone the original repository: `git clone https://github.com/saizk/Deep-Learning-for-Solar-Panel-Recognition.git`
2. Follow training instructions to generate model weights
3. Place `.pth` files in the `weights/` directory

## Evaluation Criteria Compliance

| Criterion | Implementation | Evidence |
|----------|----------------|----------|
| Detection Accuracy | F1 score optimization | Integrated Mistral AI Vision API for enhanced accuracy |
| Quantification Quality | RMSE minimization for PV area | Precise area calculation algorithms |
| Generalization & Robustness | Cross-state performance | Diverse training dataset from multiple sources |
| Code Quality & Documentation | Well-documented codebase | Comprehensive README and inline comments |
| Usability | Intuitive UI/UX | Modern, responsive design with clear workflows |

## Deliverables

This repository contains all required deliverables:

- Pipeline code: System code to run inference (.py)
- Environment details: requirements.txt, environment.yml, python version info
- Trained model files: .pt files for U-Net and YOLOv5 models
- Model card: Detailed PDF documentation of model capabilities
- Prediction files: JSON output files for training dataset
- Artifacts: JPG/PNG visual overlays for audit purposes
- Training Logs: CSV exports of training metrics
- README: Clear run instructions (this document)

## Team Attribution

This project was developed by:
- Goodwell Sreejith S
- Vasudha
- Nikhil

## License

MIT License

Copyright (c) 2026 Karnan Corps

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This project is licensed under the MIT License, an OSI-approved open source license that provides maximum permissiveness while maintaining proper attribution.