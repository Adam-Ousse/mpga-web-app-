# MPGA Web App - Google Cloud Run Deployment Script (PowerShell)
# This script deploys the Flask app to Google Cloud Run

# Colors
$Blue = "Cyan"
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "========================================" -ForegroundColor $Blue
Write-Host "  MPGA Web App - Cloud Run Deployment" -ForegroundColor $Blue
Write-Host "========================================" -ForegroundColor $Blue
Write-Host ""

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud --version 2>&1 | Select-Object -First 1
    Write-Host "✓ gcloud CLI found: $gcloudVersion" -ForegroundColor $Green
} catch {
    Write-Host "❌ Error: gcloud CLI is not installed" -ForegroundColor $Red
    Write-Host "   Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor $Yellow
    exit 1
}

# Get project ID
$PROJECT_ID = gcloud config get-value project 2>$null

if ([string]::IsNullOrWhiteSpace($PROJECT_ID)) {
    Write-Host "⚠ No default project set" -ForegroundColor $Yellow
    $PROJECT_ID = Read-Host "Enter your GCP Project ID"
    gcloud config set project $PROJECT_ID
}

Write-Host "✓ Using project: $PROJECT_ID" -ForegroundColor $Green

# Set variables
$REGION = "europe-west1"
$SERVICE_NAME = "mpga-webapp"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host ""
Write-Host "Configuration:" -ForegroundColor $Yellow
Write-Host "  Project ID:   $PROJECT_ID"
Write-Host "  Region:       $REGION"
Write-Host "  Service:      $SERVICE_NAME"
Write-Host "  Image:        $IMAGE_NAME"
Write-Host ""

# Ask for confirmation
$confirmation = Read-Host "Continue with deployment? (y/n)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "Deployment cancelled" -ForegroundColor $Yellow
    exit 0
}

# Enable required APIs
Write-Host ""
Write-Host "Enabling required APIs..." -ForegroundColor $Yellow
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com --project=$PROJECT_ID 2>$null
Write-Host "✓ APIs enabled" -ForegroundColor $Green

# Build and submit with Cloud Build
Write-Host ""
Write-Host "Building container image with Cloud Build..." -ForegroundColor $Yellow

if (Test-Path "cloudbuild.yaml") {
    # Use cloudbuild.yaml if it exists
    Write-Host "Using cloudbuild.yaml configuration" -ForegroundColor $Blue
    gcloud builds submit --config=cloudbuild.yaml --project=$PROJECT_ID
} else {
    # Direct docker build and push
    Write-Host "Using direct docker build" -ForegroundColor $Blue
    gcloud builds submit --tag=$IMAGE_NAME --project=$PROJECT_ID
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Image built successfully" -ForegroundColor $Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor $Red
    exit 1
}

# Deploy to Cloud Run (if not using cloudbuild.yaml deployment)
if (!(Test-Path "cloudbuild.yaml")) {
    Write-Host ""
    Write-Host "Deploying to Cloud Run..." -ForegroundColor $Yellow
    
    gcloud run deploy $SERVICE_NAME `
        --image=$IMAGE_NAME `
        --platform=managed `
        --region=$REGION `
        --allow-unauthenticated `
        --memory=1Gi `
        --cpu=1 `
        --timeout=300 `
        --port=8080 `
        --max-instances=10 `
        --project=$PROJECT_ID
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Deployment successful" -ForegroundColor $Green
    } else {
        Write-Host "❌ Deployment failed" -ForegroundColor $Red
        exit 1
    }
}

# Get the service URL
Write-Host ""
Write-Host "Getting service URL..." -ForegroundColor $Yellow
$SERVICE_URL = gcloud run services describe $SERVICE_NAME `
    --region=$REGION `
    --project=$PROJECT_ID `
    --format='value(status.url)' 2>$null

Write-Host ""
Write-Host "========================================" -ForegroundColor $Blue
Write-Host "✓ Deployment Complete!" -ForegroundColor $Green
Write-Host "========================================" -ForegroundColor $Blue
Write-Host ""
Write-Host "Your app is live at:" -ForegroundColor $Green
Write-Host "$SERVICE_URL" -ForegroundColor $Blue
Write-Host ""
Write-Host "Test the health endpoint:" -ForegroundColor $Yellow
Write-Host "  curl $SERVICE_URL/health"
Write-Host ""
Write-Host "Upload a CSV for prediction:" -ForegroundColor $Yellow
Write-Host "  curl -X POST $SERVICE_URL/predict \"
Write-Host "    -F `"file=@sample_data.csv`" \"
Write-Host "    -F `"dataset_type=kepler`""
Write-Host ""
