# Deployment Guide

This guide covers deploying both the backend and frontend using Docker.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available disk space
- Ports 3000 and 8000 available

## Quick Start (Combined Deployment)

### Option 1: Deploy Both Services Together

From the frontend directory (`/home/mhki/pesabu/my-app`):

```bash
# Build and start both services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Deploy Services Separately

#### Backend Deployment

From the backend directory (`/home/mhki/sanctum/improved-carnival`):

```bash
# Build and start backend
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop backend
docker-compose down
```

#### Frontend Deployment

From the frontend directory (`/home/mhki/pesabu/my-app`):

```bash
# Build and start frontend (assumes backend is running on localhost:8000)
docker-compose -f docker-compose.standalone.yml up -d --build

# View logs
docker-compose -f docker-compose.standalone.yml logs -f

# Stop frontend
docker-compose -f docker-compose.standalone.yml down
```

## Environment Variables

### Backend

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///./data/sql.db
```

### Frontend

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update this to your backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Production Deployment

### Backend

1. Set a strong SECRET_KEY in environment variables
2. Use a production database (PostgreSQL recommended)
3. Update CORS settings if needed
4. Use environment variables for sensitive data

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d --build
```

### Frontend

1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Build with production optimizations
3. Consider using a reverse proxy (nginx) for SSL

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Troubleshooting

### Backend Issues

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up -d --build backend
```

### Frontend Issues

```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Database Issues

If the database doesn't initialize:

```bash
# Access backend container
docker exec -it pesabu-backend bash

# Initialize database manually
python -c "from auth.database import engine, Base; from auth.models import User; Base.metadata.create_all(bind=engine)"
```

### Connection Issues

If frontend can't connect to backend:

1. Check that both services are on the same network
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check backend health: `curl http://localhost:8000/`
4. Check CORS settings in backend

## Health Checks

Both services include health checks:

- Backend: `curl http://localhost:8000/`
- Frontend: `curl http://localhost:3000/`

## Volumes

- Backend data: `./data` - Contains SQLite database
- Backend output: `./output` - Contains processed files
- These are persisted across container restarts

## Updating Services

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

## Security Notes

1. **Never commit `.env` files** - Use environment variables
2. **Change SECRET_KEY** - Use a strong random key in production
3. **Use HTTPS** - In production, use a reverse proxy with SSL
4. **Database Security** - Consider PostgreSQL for production
5. **CORS Settings** - Update CORS origins for production
