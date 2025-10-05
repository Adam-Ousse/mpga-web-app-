# 🚀 QUICK DEPLOY GUIDE - Google Cloud Run

## Your Error (FIXED!)

**The Problem:**
```
invalid argument "...mpga-web-app-/adamwebapp..." for "-t, --tag" flag
```
This was caused by double slashes in the Docker image path.

**The Solution:**
We've created proper deployment files that use the correct image format.

---

## 🎯 Deploy in 3 Steps

### Step 1: Set Your Project
```bash
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Run the Deploy Script

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 3: Get Your URL
The script will show you the live URL at the end!

---

## 🛠️ Alternative: Manual Deployment

If you prefer manual control:

```bash
# 1. Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 2. Build using cloudbuild.yaml (correct format)
gcloud builds submit --config=cloudbuild.yaml

# That's it! The cloudbuild.yaml automatically deploys to Cloud Run
```

---

## 📋 Files We Created For You

### `cloudbuild.yaml`
- Correct Docker image format (`gcr.io/PROJECT_ID/mpga-webapp`)
- Automated build and deploy
- No double-slash issues

### `deploy.ps1` (Windows)
- Interactive deployment script
- Checks prerequisites
- Shows live URL after deployment

### `deploy.sh` (Linux/Mac)
- Same as above for Unix systems

### `CLOUD_RUN_TROUBLESHOOTING.md`
- Comprehensive troubleshooting guide
- Common errors and solutions
- Cost optimization tips

---

## ✅ What Each Method Does

### Method 1: Using deploy.ps1/deploy.sh
```
1. Checks gcloud is installed
2. Confirms your project
3. Enables required APIs
4. Builds Docker image (correct format)
5. Deploys to Cloud Run
6. Shows you the URL
```

### Method 2: Using cloudbuild.yaml
```
1. Builds image: gcr.io/PROJECT_ID/mpga-webapp
2. Pushes to Container Registry
3. Deploys to Cloud Run automatically
4. All in one command!
```

---

## 🎨 Your App Will Be Deployed As:

- **Service Name:** `mpga-webapp`
- **Region:** `europe-west1`
- **Image:** `gcr.io/YOUR_PROJECT_ID/mpga-webapp`
- **Memory:** 1 GB
- **CPU:** 1
- **Timeout:** 300 seconds
- **Public Access:** Yes (unauthenticated)
- **Port:** 8080

---

## 🧪 Test Your Deployment

After deployment, test these endpoints:

```bash
# Replace YOUR_URL with the URL from deployment
SERVICE_URL="https://mpga-webapp-xxx-ew.a.run.app"

# 1. Health check
curl $SERVICE_URL/health

# 2. Main page
curl $SERVICE_URL/

# 3. Prediction
curl -X POST $SERVICE_URL/predict \
  -F "file=@sample_data.csv" \
  -F "dataset_type=kepler"
```

---

## 🔍 Troubleshooting

### If build fails:
```bash
# View build logs
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]
```

### If deploy fails:
```bash
# View service logs
gcloud run services logs read mpga-webapp --region europe-west1 --limit=50
```

### If you see "Permission denied":
```bash
gcloud auth login
```

### If you see "Project not found":
```bash
gcloud projects list
gcloud config set project YOUR_PROJECT_ID
```

---

## 💡 Pro Tips

1. **First deployment takes longer** (2-5 minutes)
   - Subsequent deployments are faster

2. **The URL will look like:**
   ```
   https://mpga-webapp-[hash]-ew.a.run.app
   ```

3. **You can redeploy anytime:**
   ```bash
   gcloud builds submit --config=cloudbuild.yaml
   ```

4. **View in Cloud Console:**
   ```
   https://console.cloud.google.com/run?project=YOUR_PROJECT_ID
   ```

---

## 📞 Getting Help

1. Check `CLOUD_RUN_TROUBLESHOOTING.md` for detailed help
2. View build logs if build fails
3. View service logs if app crashes
4. Check the Dockerfile is in the repo
5. Ensure requirements.txt is correct

---

## 🎉 Success Looks Like:

```
========================================
✓ Deployment Complete!
========================================

Your app is live at:
https://mpga-webapp-xxx-ew.a.run.app

Test the health endpoint:
  curl https://mpga-webapp-xxx-ew.a.run.app/health
```

---

## 🚨 Key Differences from Your Failed Build

| Your Failed Build | Our Fixed Build |
|-------------------|-----------------|
| `europe-west1-docker.pkg.dev/...mpga-web-app-/adamwebapp` | `gcr.io/PROJECT_ID/mpga-webapp` |
| Double slashes `//` | No double slashes ✅ |
| Complex Artifact Registry path | Simple Container Registry path |
| Manual tag construction | Automated with cloudbuild.yaml |

---

## 🎯 Summary

**To deploy your MPGA web app:**

1. Open PowerShell in the project directory
2. Run: `.\deploy.ps1`
3. Follow the prompts
4. Get your live URL!

OR

1. Run: `gcloud builds submit --config=cloudbuild.yaml`
2. Wait 2-5 minutes
3. Check Cloud Console for URL

**That's it!** 🚀

---

**Questions? Check CLOUD_RUN_TROUBLESHOOTING.md for detailed help!**
