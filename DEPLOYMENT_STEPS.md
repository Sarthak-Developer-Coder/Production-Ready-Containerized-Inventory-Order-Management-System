# Complete Deployment Guide: Vercel, Render & Docker Hub

## 📋 Prerequisites
- GitHub account (already set up ✅)
- Docker Hub account (create at https://hub.docker.com/)
- Render.com account (create at https://render.com/)
- Vercel account (create at https://vercel.com/)

---

## 🐳 PART 1: DOCKER HUB - Backend Docker Image

### Step 1: Create Docker Hub Account & Repository
1. Go to https://hub.docker.com/
2. Sign up or login
3. Click **"Create Repository"**
4. Repository name: `ethara-ai-backend`
5. Description: "Inventory & Order Management System Backend"
6. Visibility: **Public**
7. Click **Create**

### Step 2: Login to Docker Hub Locally
```bash
docker login
# Enter your Docker Hub username and password
```

### Step 3: Build & Push Backend Image
```bash
cd "c:\Users\sarth\OneDrive\Desktop\ethara ai"

# Build the image with your Docker Hub username
docker build -t YOUR_DOCKER_USERNAME/ethara-ai-backend:latest ./backend

# Push to Docker Hub
docker push YOUR_DOCKER_USERNAME/ethara-ai-backend:latest
```

### Step 4: Your Backend Docker Hub Image Link
```
docker pull YOUR_DOCKER_USERNAME/ethara-ai-backend:latest
```

**Example:**
```
docker pull sarthakdevcode/ethara-ai-backend:latest
```

---

## 🚀 PART 2: VERCEL - Frontend Deployment

### Step 1: Create Vercel Account
1. Go to https://vercel.com/
2. Sign up with GitHub (use your existing account)

### Step 2: Import Project from GitHub
1. Click **"New Project"**
2. Select **"Import Git Repository"**
3. Paste: `https://github.com/Sarthak-Developer-Coder/Production-Ready-Containerized-Inventory-Order-Management-System.git`
4. Select project and click **Continue**

### Step 3: Configure Project Settings
1. **Framework Preset**: React
2. **Root Directory**: `./frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### Step 4: Set Environment Variables
1. Under **Environment Variables**, add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-render-backend-url.onrender.com` (add this after deploying backend)

2. Click **Add**

### Step 5: Deploy
1. Click **Deploy**
2. Wait for deployment to complete (2-3 minutes)
3. Your frontend URL: `https://your-project.vercel.app`

### Step 6: Update Backend URL
Once Render backend is deployed (see Part 3), update the environment variable:
1. Go to **Settings** → **Environment Variables**
2. Edit `REACT_APP_API_URL` with your Render backend URL
3. Redeploy

---

## 🌐 PART 3: RENDER - Backend Deployment

### Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub

### Step 2: Create Web Service
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Paste GitHub URL: `https://github.com/Sarthak-Developer-Coder/Production-Ready-Containerized-Inventory-Order-Management-System.git`
5. Click **Next**

### Step 3: Configure Web Service
- **Name**: `ethara-ai-backend`
- **Environment**: Docker
- **Region**: Choose closest to you
- **Branch**: `main`

### Step 4: Build Settings
- **Root Directory**: `backend`
- **Dockerfile**: Leave default (or set to `Dockerfile`)

### Step 5: Environment Variables
Add the following:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/inventory_db
SECRET_KEY=your-random-secret-key-here-change-this
ENVIRONMENT=production
```

**For DATABASE_URL:**
1. Click **"Create Database"** in Render Dashboard
2. Create PostgreSQL database
3. Copy connection string
4. Format: `postgresql://username:password@host:5432/inventory_db`

### Step 6: Deploy
1. Select **"Free"** or **"Paid"** tier
2. Click **"Create Web Service"**
3. Render will automatically deploy (5-10 minutes)
4. Your backend URL: `https://ethara-ai-backend.onrender.com`

### Step 7: Test Backend
```bash
# Test API health
curl https://ethara-ai-backend.onrender.com/health

# View API docs
https://ethara-ai-backend.onrender.com/docs
```

---

## 📱 PART 4: CONNECT FRONTEND TO BACKEND

### Step 1: Update Vercel Environment Variable
1. Go to Vercel Dashboard
2. Select your frontend project
3. **Settings** → **Environment Variables**
4. Update `REACT_APP_API_URL`: `https://ethara-ai-backend.onrender.com`
5. **Redeploy**

### Step 2: Verify Connection
1. Visit your Vercel frontend URL
2. Test by:
   - Creating a product
   - Creating a customer
   - Creating an order
3. Check if data is saved and retrieved

---

## ✅ FINAL DEPLOYMENT LINKS

After completing all steps, you'll have:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | `https://your-app.vercel.app` | 🟢 Live |
| **Backend (Render)** | `https://ethara-ai-backend.onrender.com` | 🟢 Live |
| **Backend Docker (Hub)** | `docker pull YOUR_DOCKER_USERNAME/ethara-ai-backend:latest` | 🟢 Ready |
| **Database (Render)** | Managed by Render | 🟢 Included |

---

## 🔒 Production Security Checklist

- [ ] Change `SECRET_KEY` in Render to a random secure value
- [ ] Set `ENVIRONMENT=production` in Render
- [ ] Enable HTTPS (automatic on Vercel and Render)
- [ ] Configure CORS for production domain
- [ ] Set up database backups in Render
- [ ] Monitor logs in both Render and Vercel dashboards

---

## 🐛 Troubleshooting

### Backend Not Connecting
1. Check Render logs: Dashboard → Web Service → Logs
2. Verify `DATABASE_URL` is correct
3. Check if PostgreSQL database is running

### Frontend Shows Error
1. Check Vercel logs: Deployments → Logs
2. Verify `REACT_APP_API_URL` is set correctly
3. Clear browser cache and reload

### Docker Push Issues
```bash
# Logout and login again
docker logout
docker login

# Check image exists
docker images | grep ethara-ai-backend
```

---

## 📞 Support Links

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Docker Hub: https://docs.docker.com/docker-hub/
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/

---

**Project Status**: ✅ Production Ready
**Last Updated**: 2026-06-22
**Version**: 1.0.0 - Finalized
