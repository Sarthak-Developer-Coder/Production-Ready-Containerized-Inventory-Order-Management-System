# 🌍 Production Deployment Guide

Complete guide to deploy the Inventory & Order Management System to production using free platforms.

---

## 📋 Prerequisites

- GitHub account
- Docker Hub account  
- Render account
- Vercel account
- Git installed
- Docker installed

---

## Phase 1: GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create repository: `inventory-management-system`
3. Choose "Public"
4. Do NOT initialize with README
5. Click "Create repository"

### Step 2: Initialize Git Locally

```bash
cd "c:\Users\sarth\OneDrive\Desktop\ethara ai"
git init
git add .
git commit -m "Initial commit: Inventory Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-system.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

---

## Phase 2: Docker Hub Setup

### Step 1: Create Docker Hub Account

1. Visit [hub.docker.com/signup](https://hub.docker.com/signup)
2. Complete registration
3. Create Personal Access Token:
   - Account Settings → Security → New Access Token
   - Save token securely

### Step 2: Build and Push Docker Image

```bash
# Login to Docker
docker login

# Build backend image
cd backend
docker build -t YOUR_USERNAME/inventory-management-backend:latest .
docker push YOUR_USERNAME/inventory-management-backend:latest

# Tag version
docker tag YOUR_USERNAME/inventory-management-backend:latest YOUR_USERNAME/inventory-management-backend:v1.0
docker push YOUR_USERNAME/inventory-management-backend:v1.0

# Tag with version
docker tag YOUR_USERNAME/inventory-backend:latest YOUR_USERNAME/inventory-backend:v1.0.0
docker push YOUR_USERNAME/inventory-backend:v1.0.0
```

Replace `YOUR_USERNAME` with your Docker Hub username.

**Docker Hub Link Format:**
```
https://hub.docker.com/r/YOUR_USERNAME/inventory-backend
```

---

## Phase 3: Backend Deployment (Render)

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up (or use GitHub OAuth)
3. Connect your GitHub account

### Step 2: Create Web Service

1. Dashboard → New → Web Service
2. Connect your repository: `inventory-management-system`
3. Configure:
   - **Name**: `inventory-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Branch**: `main`

### Step 3: Set Environment Variables

Add these environment variables in Render dashboard:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
SECRET_KEY=generate-a-random-secure-key-here
ENVIRONMENT=production
```

**Note:** For DATABASE_URL, you have options:
- Use Render's PostgreSQL (recommended)
- Use Railway PostgreSQL
- Use Neon serverless PostgreSQL (free tier available)

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Copy the service URL: `https://inventory-backend-xxx.onrender.com`

**Backend API URL:** Save this for later use

---

## Phase 3B: Backend Alternative (Railway)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Set Up PostgreSQL

1. Project → Add Services → PostgreSQL
2. Connect and note connection details

### Step 3: Deploy Backend

1. Add Services → GitHub repo
2. Select your repository
3. Railway auto-detects Python project

### Step 4: Set Environment Variables

Add environment variables in Railway:
- `DATABASE_URL`
- `SECRET_KEY`
- `ENVIRONMENT=production`

---

## Phase 4: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up (use GitHub OAuth for easiest setup)

### Step 2: Import Project

1. New Project → Import Git Repository
2. Select `inventory-management-system`

### Step 3: Configure Build

Vercel auto-detects React configuration. Just verify:
- **Framework Preset**: React
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables

Add in Vercel:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

Use the backend URL from Phase 3.

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build completion
3. Copy frontend URL: `https://inventory-xxx.vercel.app`

**Frontend URL:** Save this URL

---

## Phase 4B: Frontend Alternative (Netlify)

### Step 1: Create Netlify Account

1. Go to https://netlify.com
2. Sign up with GitHub

### Step 2: New Site from Git

1. New Site → Import an existing project
2. Select your repository

### Step 3: Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `build`

### Step 4: Environment Variables

Add in Netlify Site Settings:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

### Step 5: Deploy

Netlify auto-deploys on push to main. Copy your URL.

---

## Phase 5: Update Frontend Configuration

After deploying backend, update frontend:

1. Go to your deployment platform (Vercel/Netlify)
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` with actual backend URL
4. Trigger redeploy

---

## Phase 6: Verification

### Test Backend API

```bash
curl https://your-backend-url/health
# Should return: {"status": "healthy", "message": "API is running"}

curl https://your-backend-url/docs
# Should open API documentation
```

### Test Frontend

1. Visit your frontend URL in browser
2. Create a test product
3. Create a test customer
4. Create a test order

---

## 📋 Submission Checklist

Collect these URLs and submit:

- [ ] **GitHub Repository**: `https://github.com/YOUR_USERNAME/inventory-management-system`
- [ ] **Docker Hub Image**: `https://hub.docker.com/r/YOUR_USERNAME/inventory-backend`
- [ ] **Backend API URL**: `https://your-backend-url.onrender.com`
- [ ] **Frontend URL**: `https://your-frontend-url.vercel.app`

All URLs should be publicly accessible and fully functional.

---

## 🔧 Troubleshooting

### Backend not connecting to database
- Verify DATABASE_URL environment variable
- Check PostgreSQL service status
- Verify network connectivity

### Frontend showing API errors
- Check REACT_APP_API_URL in environment variables
- Verify backend is running and accessible
- Check browser console for CORS errors

### Docker build failing
- Ensure all required files are included
- Check Docker version compatibility
- Review Dockerfile syntax

### Deployment hangs
- Check build logs in dashboard
- Verify all dependencies are listed
- Check for timeout issues

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Docs](https://docs.docker.com)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://create-react-app.dev/deployment/)

---

**Your application is now production-ready!** 🎉
