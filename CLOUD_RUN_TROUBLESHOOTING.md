# Google Cloud Run Deployment - Troubleshooting Guide

## The Error You Encountered

```
invalid argument "europe-west1-docker.pkg.dev/disco-aegis-474109-m3/cloud-run-source-deploy/mpga-web-app-/adamwebapp:..." 
for "-t, --tag" flag: invalid reference format
```

**Cause:** Double slashes (`//`) in the Docker image path, which is an invalid format.

---

## ✅ Solution: Use Correct Deployment Method

### Method 1: Using cloudbuild.yaml (Recommended)

We've created a `cloudbuild.yaml` file that uses the correct image format.

**Deploy with:**
```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Submit the build
gcloud builds submit --config=cloudbuild.yaml
```

The `cloudbuild.yaml` file uses the simpler `gcr.io` format which doesn't have path issues.

---

### Method 2: Using Deploy Script (Easiest)

**On Windows PowerShell:**
```powershell
.\deploy.ps1
```

**On Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Check your gcloud installation
2. Enable required APIs
3. Build the Docker image correctly
4. Deploy to Cloud Run
5. Show you the live URL

---

### Method 3: Manual Step-by-Step

```bash
# 1. Set your project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# 2. Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# 3. Build the image (using gcr.io - no double slashes!)
gcloud builds submit --tag gcr.io/$PROJECT_ID/mpga-webapp

# 4. Deploy to Cloud Run
gcloud run deploy mpga-webapp \
  --image gcr.io/$PROJECT_ID/mpga-webapp \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --port 8080
```

---

## 🔍 Understanding the Issue

### ❌ Bad Image Format (what failed)
```
europe-west1-docker.pkg.dev/project/repo/mpga-web-app-/adamwebapp:tag
                                              ^^ double slash!
```

### ✅ Good Image Formats

**Container Registry (gcr.io) - Recommended:**
```
gcr.io/PROJECT_ID/mpga-webapp
gcr.io/PROJECT_ID/mpga-webapp:latest
gcr.io/PROJECT_ID/mpga-webapp:v1.0.0
```

**Artifact Registry (if you need it):**
```
REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY/mpga-webapp
europe-west1-docker.pkg.dev/my-project/my-repo/mpga-webapp
```

---

## 🚀 Quick Deployment Commands

### Option A: Use Our cloudbuild.yaml
```bash
gcloud builds submit --config=cloudbuild.yaml
```

### Option B: Direct build + deploy
```bash
# Build
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/mpga-webapp

# Deploy
gcloud run deploy mpga-webapp \
  --image gcr.io/$(gcloud config get-value project)/mpga-webapp \
  --region europe-west1 \
  --allow-unauthenticated
```

### Option C: From source (Cloud Run will build for you)
```bash
gcloud run deploy mpga-webapp \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated
```

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] gcloud CLI is installed
- [ ] You're authenticated: `gcloud auth login`
- [ ] Project is set: `gcloud config set project YOUR_PROJECT_ID`
- [ ] Billing is enabled on your project
- [ ] Required APIs are enabled
- [ ] You're in the project directory
- [ ] `Dockerfile` exists and is correct
- [ ] `requirements.txt` exists
- [ ] `app.py` exists

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Permission Denied"
**Solution:**
```bash
gcloud auth login
gcloud auth application-default login
```

### Issue 2: "Project not found"
**Solution:**
```bash
# List your projects
gcloud projects list

# Set the correct project
gcloud config set project YOUR_PROJECT_ID
```

### Issue 3: "API not enabled"
**Solution:**
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Issue 4: "Billing not enabled"
**Solution:**
1. Go to https://console.cloud.google.com/billing
2. Link a billing account to your project

### Issue 5: "Build timeout"
**Solution:**
```bash
# Increase timeout in cloudbuild.yaml
timeout: 1800s  # 30 minutes

# Or in command
gcloud builds submit --timeout=30m --tag gcr.io/PROJECT_ID/mpga-webapp
```

### Issue 6: "Not enough quota"
**Solution:**
```bash
# Use smaller machine type
gcloud builds submit \
  --machine-type=e2-medium \
  --tag gcr.io/PROJECT_ID/mpga-webapp
```

### Issue 7: "Image not found during deploy"
**Solution:**
```bash
# Verify image exists
gcloud container images list --repository=gcr.io/PROJECT_ID

# If not, rebuild
gcloud builds submit --tag gcr.io/PROJECT_ID/mpga-webapp
```

---

## 🔧 Debugging Failed Builds

### View build logs:
```bash
# List recent builds
gcloud builds list --limit=5

# Get specific build log
gcloud builds log BUILD_ID
```

### Common build failures:

**1. Dockerfile errors:**
- Check `Dockerfile` syntax
- Ensure base image is accessible
- Verify file paths are correct

**2. Dependency errors:**
- Check `requirements.txt` versions
- Ensure all packages are available on PyPI

**3. Port configuration:**
- Ensure `EXPOSE 8080` in Dockerfile
- App must listen on `PORT` environment variable

---

## 🎯 Recommended Deployment Flow

### First Time Setup:
```bash
# 1. Authenticate
gcloud auth login

# 2. Set project
gcloud config set project YOUR_PROJECT_ID

# 3. Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 4. Deploy using our script
.\deploy.ps1  # Windows
./deploy.sh   # Linux/Mac
```

### Subsequent Deployments:
```bash
# Quick redeploy
gcloud builds submit --config=cloudbuild.yaml
```

---

## 📊 Verify Deployment

After deployment, test your app:

```bash
# Get the URL
SERVICE_URL=$(gcloud run services describe mpga-webapp \
  --region europe-west1 \
  --format 'value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# Test main page
curl $SERVICE_URL/

# Test prediction
curl -X POST $SERVICE_URL/predict \
  -F "file=@sample_data.csv" \
  -F "dataset_type=kepler"
```

Expected responses:
- `/health` → `{"status":"healthy"}`
- `/` → HTML content
- `/predict` → JSON with predictions

---

## 🔐 Security Best Practices

### 1. Restrict Public Access (Optional)
```bash
# Remove public access
gcloud run services update mpga-webapp \
  --region europe-west1 \
  --no-allow-unauthenticated

# Access will require authentication
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  $SERVICE_URL/health
```

### 2. Set up Custom Domain
```bash
# Map custom domain
gcloud run domain-mappings create \
  --service mpga-webapp \
  --domain your-domain.com \
  --region europe-west1
```

### 3. Add Environment Variables
```bash
# Set environment variables
gcloud run services update mpga-webapp \
  --region europe-west1 \
  --set-env-vars "ENV=production,LOG_LEVEL=info"
```

---

## 💰 Cost Optimization

### 1. Set resource limits:
```bash
gcloud run services update mpga-webapp \
  --region europe-west1 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 5
```

### 2. Set minimum instances (for faster cold starts):
```bash
gcloud run services update mpga-webapp \
  --region europe-west1 \
  --min-instances 0  # 0 for lowest cost
  # or --min-instances 1  # for faster response
```

### 3. Monitor costs:
- Visit: https://console.cloud.google.com/billing
- Set up budget alerts

---

## 📱 Monitoring & Logs

### View logs:
```bash
# Stream logs
gcloud run services logs read mpga-webapp \
  --region europe-west1 \
  --follow

# View in Cloud Console
# https://console.cloud.google.com/run
```

### Monitor metrics:
```bash
# Get service details
gcloud run services describe mpga-webapp \
  --region europe-west1
```

---

## 🎓 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Container Registry](https://cloud.google.com/container-registry/docs)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

---

## ✅ Success Checklist

After deployment, you should have:
- [ ] Service deployed and running
- [ ] Public URL accessible
- [ ] Health check returns 200
- [ ] Main page loads correctly
- [ ] CSV upload works
- [ ] Predictions return valid JSON
- [ ] No errors in logs

---

## 🆘 Still Having Issues?

If you're still stuck:

1. **Check the build logs:**
   ```bash
   gcloud builds list --limit=1
   gcloud builds log [BUILD_ID]
   ```

2. **Check the service logs:**
   ```bash
   gcloud run services logs read mpga-webapp --region europe-west1 --limit=50
   ```

3. **Verify the image exists:**
   ```bash
   gcloud container images list --repository=gcr.io/$(gcloud config get-value project)
   ```

4. **Test locally first:**
   ```bash
   docker build -t mpga-webapp .
   docker run -p 8080:8080 mpga-webapp
   ```

---

**Need Help?**
- Open an issue on GitHub
- Check Cloud Run status: https://status.cloud.google.com/
- Google Cloud Support: https://cloud.google.com/support

---

**Remember:** The key fix for your specific error is using `gcr.io/PROJECT_ID/IMAGE_NAME` format instead of the Artifact Registry path with double slashes!
