# Best Way Vision

AI-powered warehouse monitoring system using existing NVR and security cameras to automatically track pallets and trailers.

## Features
- Count cartons on pallets in scan zones
- Log pallet movements in/out of building
- Track trailer arrivals/departures at docks
- Web dashboard for viewing data and snapshots
- Automated email reports (Excel/CSV)

## Tech Stack
- **Backend**: Python (NVR integration, AI/CV, database, reports) - *In Development*
- **Frontend**: Next.js 14 + TypeScript + Tailwind - **✅ Complete**
- **Cameras**: Hikvision/Dahua NVR (RTSP/ONVIF)
- **Deployment**: Docker Compose

## Current Status

**Frontend Application: 100% Complete**
- Dashboard with real-time statistics
- Event listing with search, filters, and tabs
- Event detail pages for all event types
- Admin panel for email configuration
- CSV/Excel export functionality
- Mock data system (works standalone)
- Professional, responsive UI

**Backend: Not Started**
- Python service for NVR connection
- AI/CV processing for pallet/trailer detection
- Database integration
- Email reporting system

## Quick Start

### Option 1: Development Mode
```bash
cd frontend
npm install
npm run dev
```
Visit: http://localhost:3000

### Option 2: Docker (Production)
```bash
docker-compose up -d frontend
```
Visit: http://localhost:3001

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.
See [DOCKER.md](DOCKER.md) for Docker setup & deployment.

## Repository
GitHub: https://github.com/Sultansmooth/Best-Way-Vision

## Documentation
See `/docs/` folder for complete documentation:
- **[QUICKSTART.md](QUICKSTART.md)** - Get started immediately
- **[DOCKER.md](DOCKER.md)** - Docker setup & deployment guide
- [Project Info & Log](docs/PROJECT-INFO.md) - Repository, guidelines, and progress log
- [Frontend Architecture](docs/FRONTEND-ARCHITECTURE.md) - Frontend design & structure
- [Frontend Complete](docs/FRONTEND-COMPLETE.md) - Feature list & integration guide
- [Project Overview](docs/Project%20Overview.md) - Detailed project requirements
- [Environment Variables](docs/env.md) - Configuration template
