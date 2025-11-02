# Karnan - Solar Verification Backend

A fully working, well-documented, production-like backend that implements the full Karnan pipeline for solar panel verification.

## Features

- CSV upload of sites for solar panel verification
- Automated rooftop imagery fetching
- Model inference for solar panel detection
- Quality control and explainability artifacts
- Digital certificate generation
- Reward system with Solar Trust Points (STP)
- Multilingual chatbot (SuryaBot)
- Audit trail and reporting
- RESTful API with OpenAPI documentation

## Tech Stack

- Python 3.11
- FastAPI for HTTP API
- Uvicorn for ASGI
- PostgreSQL + SQLAlchemy + Alembic
- Redis for job queue (RQ)
- SQLite option for quick dev mode
- Docker + docker-compose for local dev
- Optional GPU-aware worker image (PyTorch)
- MinIO for storing images/artifacts
- IPFS mock for evidence storage
- PyTest for tests

## Project Structure

```
/backend
  /app
    /api (routers)
    /core (config)
    /models (ORM)
    /services (imagery, inference, qc, certificate, rewards)
    /workers
    /tests
  Dockerfile
  docker-compose.yml
  README.md
  scripts/
  data/examples/
  infra/
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11 (for local development)

### Running with Docker (Recommended)

1. Navigate to the backend directory: `cd backend`
2. Start all services: `docker-compose up -d`
3. Access the API documentation at `http://localhost:8000/docs`

### Running Locally (Development)

1. Create a virtual environment: `python -m venv venv`
2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start the development server: `uvicorn app.main:app --reload`
5. Access the API documentation at `http://localhost:8000/docs`

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

## Configuration

All configuration is managed through environment variables in the `.env` file or through the `config.yml` file.

## Testing

Run tests with `pytest` in the backend directory.

## Demo

To run the demo script:

1. Make sure Docker services are running: `docker-compose up -d`
2. On Unix/Linux/macOS: `chmod +x scripts/run_demo.sh && ./scripts/run_demo.sh`
3. On Windows: `scripts\run_demo.bat`

The demo will:
- Post a sample CSV file
- Process the sites
- Generate verification results
- Show where the output files are stored

For detailed demo instructions, see [DEMO_INSTRUCTIONS.md](DEMO_INSTRUCTIONS.md)

## Evaluation

To evaluate the system performance:

```bash
python scripts/evaluate.py --pred predictions.json --gt groundtruth.json
```

This will compute:
- Detection F1 score
- Area MAE
- Capacity RMSE

For more information on how our system meets competition criteria, see [COMPETITION_CRITERIA.md](COMPETITION_CRITERIA.md)