# AI Solar Verification Platform - Futuristic Redesign

This is a futuristic redesign of the AI Solar Verification Platform for India, featuring a modern UI with transparency, clean energy insights, and reward tracking.

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

## Technology Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Shadcn/ui, Lucide React icons
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Internationalization**: next-intl
- **Mapping**: react-simple-maps
- **AI/ML**: PyTorch, ONNX Runtime (optional)

## Team Attribution
This project was developed by:
- Goodwell Sreejith S
- Vasudha
- Nikhil

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Solar Panel Detection Feature

### Accessing the Feature
- Navigate to `/solar-detection` in the web application
- Or use the "Solar Detection" link in the main navigation

### Supported Models
1. **U-Net** - Segmentation model for precise boundary detection
2. **YOLOv5** - Object detection model for fast detection

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

## Design Highlights

### Color Scheme
- **Primary**: Solar Gold (#EAB308)
- **Secondary**: Eco Green (#10B981)
- **Accent**: Solar Orange (#F97316)

### Typography
- **Headings**: Space Grotesk
- **Body**: Urbanist

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

## License

MIT License

Copyright (c) 2025 Karnan Corps

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

This project is licensed under the MIT License, an OSI-approved open source license.