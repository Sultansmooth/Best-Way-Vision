# Docker Setup - Best Way Vision

## Overview

The frontend application is now fully Dockerized and ready to run in containers. The complete docker-compose.yml includes placeholders for the full stack (backend, database, redis) which can be uncommented when ready.

## Quick Start

### Option 1: Run Frontend Only (Current)

```bash
# Build and start the frontend
docker-compose up -d frontend

# View logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

Frontend will be available at: **http://localhost:3001**

### Option 2: Build Frontend Manually

```bash
cd frontend

# Build the Docker image
docker build -t bestway-vision-frontend .

# Run the container
docker run -p 3001:3001 --name bestway-vision bestway-vision-frontend

# Stop
docker stop bestway-vision
docker rm bestway-vision
```

## Configuration

### Port Configuration

**Development server** (npm run dev): Port 3000
**Docker container**: Port 3001

This allows both to run simultaneously without conflict.

### Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

Current environment variables:
- `PORT=3001` - Frontend port
- `NODE_ENV=production` - Node environment
- `NEXT_PUBLIC_API_URL` - Backend API URL (when ready)

## Docker Compose Services

### Current Services

#### Frontend (Active)
- **Container**: `bestway-vision-frontend`
- **Port**: 3001
- **Technology**: Next.js 14
- **Status**: ✅ Ready to run

### Future Services (Commented Out)

#### Backend
- **Container**: `bestway-vision-backend`
- **Port**: 8000
- **Technology**: Python (FastAPI/Flask)
- **Status**: 🚧 Placeholder ready

#### Database
- **Container**: `bestway-vision-db`
- **Port**: 5432
- **Technology**: PostgreSQL 15
- **Status**: 🚧 Placeholder ready

#### Redis
- **Container**: `bestway-vision-redis`
- **Port**: 6379
- **Technology**: Redis 7
- **Status**: 🚧 Placeholder ready

## Network Configuration

All services use a custom bridge network: `bestway-network`

This allows:
- Container-to-container communication
- Service discovery by name
- Network isolation

## Volumes

Persistent storage (when backend is ready):
- `postgres_data`: Database storage
- `snapshots`: Camera snapshot images

## Docker Commands Cheat Sheet

### Management
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart service
docker-compose restart frontend
```

### Monitoring
```bash
# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f frontend

# View running containers
docker-compose ps

# Check container health
docker stats
```

### Troubleshooting
```bash
# Rebuild without cache
docker-compose build --no-cache frontend

# Enter container shell
docker-compose exec frontend sh

# View container details
docker inspect bestway-vision-frontend

# Remove all stopped containers
docker system prune -a
```

## Production Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- Minimum 2GB RAM
- 10GB disk space

### Deployment Steps

1. **Clone Repository**
```bash
git clone https://github.com/Sultansmooth/Best-Way-Vision.git
cd Best-Way-Vision
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Build and Start**
```bash
docker-compose up -d
```

4. **Verify**
```bash
docker-compose ps
curl http://localhost:3001
```

5. **Access Application**
- Frontend: http://your-server-ip:3001

## Security Considerations

### Current Setup
- Non-root user in container (nextjs:nodejs)
- No sensitive data in images
- Environment variables for secrets
- .dockerignore excludes sensitive files

### Recommendations
- Use secrets management (Docker Secrets, Vault)
- Enable SSL/TLS (reverse proxy with nginx)
- Restrict network access
- Regular image updates
- Monitor container logs

## Reverse Proxy Setup (Optional)

For production with SSL:

```nginx
# nginx configuration
server {
    listen 80;
    server_name vision.bestway.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name vision.bestway.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Adding Backend Services

When Python backend is ready:

1. **Uncomment backend service** in `docker-compose.yml`
2. **Create backend/Dockerfile**
3. **Update environment variables**
4. **Rebuild stack**:
```bash
docker-compose up -d --build
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Change port in docker-compose.yml
ports:
  - "3002:3001"
```

### Build Fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Container Crashes
```bash
# Check logs
docker-compose logs frontend

# Check container status
docker-compose ps

# Restart with fresh state
docker-compose down -v
docker-compose up -d
```

## Resource Requirements

### Minimum (Frontend Only)
- CPU: 1 core
- RAM: 512MB
- Disk: 2GB

### Recommended (Full Stack)
- CPU: 4 cores
- RAM: 8GB
- Disk: 50GB (for snapshots/database)

## Next Steps

1. ✅ Frontend Dockerized
2. 🚧 Create Python backend service
3. 🚧 Uncomment database service
4. 🚧 Set up NVR connection
5. 🚧 Configure email service
6. 🚧 Production deployment

## Support

Issues or questions:
- Check logs: `docker-compose logs -f`
- Review documentation in `/docs/`
- Check GitHub issues
