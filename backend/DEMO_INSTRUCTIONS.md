# Karnan - Solar Verification Backend

## Summary

We have successfully implemented a fully working, well-documented, production-like backend for the Karnan solar verification pipeline. The system includes:

1. **CSV Ingest**: Accepts CSV uploads with site data
2. **Imagery Fetching**: Retrieves high-res rooftop imagery (mock implementation)
3. **Model Inference**: Detects solar panels and estimates capacity (mock implementation)
4. **Quality Control**: Applies rules to determine verification status
5. **Explainability**: Generates artifacts with reason codes
6. **Storage**: Saves results to database and object store
7. **Certification**: Creates digital certificates with QR codes
8. **Rewards**: Implements Solar Trust Points system
9. **Chatbot**: Multilingual assistant for citizen queries
10. **Reporting**: Fraud reporting and metrics tracking

## Technology Stack

- **Python 3.11** with **FastAPI** for the web framework
- **PostgreSQL** with **SQLAlchemy** for data persistence
- **Redis** with **RQ** for job queueing
- **MinIO** for object storage
- **Docker** and **Docker Compose** for containerization
- **PyTest** for testing

## How to Run the Demo

### Prerequisites

1. Install Docker and Docker Compose
2. Clone the repository

### Steps

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. Run the demo script:
   - On Unix/Linux/macOS:
     ```bash
     chmod +x scripts/run_demo.sh && ./scripts/run_demo.sh
     ```
   - On Windows:
     ```cmd
     scripts\run_demo.bat
     ```

4. Access the API documentation at `http://localhost:8000/docs`

### What the Demo Does

1. Starts all required services (PostgreSQL, Redis, MinIO, Backend)
2. Posts a sample CSV file with 5 sites
3. Processes each site through the verification pipeline
4. Generates verification results, certificates, and artifacts
5. Shows where the output files are stored

## Key Features Demonstrated

- **RESTful API** with comprehensive endpoints
- **Asynchronous job processing** with progress tracking
- **Database storage** of verification results
- **Object storage** of images and certificates
- **Quality control** with explainability artifacts
- **Digital certificates** with QR codes
- **Reward system** with leaderboard
- **Multilingual chatbot** support

## API Endpoints

- `POST /api/v1/uploads/csv` - Upload CSV with site data
- `GET /api/v1/jobs/{job_id}` - Check job status
- `GET /api/v1/site/{sample_id}` - Get verification results
- `GET /api/v1/site/{sample_id}/artifact/{type}` - Get artifacts
- `POST /api/v1/verify/single` - Run single verification
- `GET /api/v1/leaderboard` - Get reward leaderboard
- `POST /api/v1/report` - Submit fraud report
- `GET /api/v1/metrics` - Get system metrics
- `POST /api/v1/chat` - Chat with SuryaBot

## Output Locations

- **Database**: PostgreSQL (accessible via standard tools)
- **Certificates**: `data/certificates/`
- **Images**: `data/images/`
- **Audit folders**: `data/outputs/{sample_id}/`

## Testing

Run the test suite with:
```bash
docker-compose exec backend pytest
```

## Configuration

The system can be configured through:
- Environment variables (see `.env.example`)
- YAML configuration file (`config.yml`)

## Next Steps for Production

1. Replace mock implementations with real imagery providers
2. Integrate actual ML models for inference
3. Connect to real blockchain networks
4. Implement full authentication and authorization
5. Add monitoring and alerting
6. Set up production deployment pipelines

This implementation provides a solid foundation that can be extended and customized for specific requirements while maintaining the core functionality of the solar verification pipeline.