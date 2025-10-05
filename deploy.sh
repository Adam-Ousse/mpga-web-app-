#!/bin/bash

# MPGA Web App - Google Cloud Run Deployment Script
# This script deploys the Flask app to Google Cloud Run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  MPGA Web App - Cloud Run Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    echo "   Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI found${NC}"

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠ No default project set${NC}"
    read -p "Enter your GCP Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo -e "${GREEN}✓ Using project: ${BLUE}$PROJECT_ID${NC}"

# Set variables
REGION="europe-west1"
SERVICE_NAME="mpga-webapp"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  Project ID:   $PROJECT_ID"
echo "  Region:       $REGION"
echo "  Service:      $SERVICE_NAME"
echo "  Image:        $IMAGE_NAME"
echo ""

# Ask for confirmation
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

# Enable required APIs
echo ""
echo -e "${YELLOW}Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    --project="$PROJECT_ID" 2>/dev/null || true

echo -e "${GREEN}✓ APIs enabled${NC}"

# Build and submit with Cloud Build
echo ""
echo -e "${YELLOW}Building container image with Cloud Build...${NC}"

if [ -f "cloudbuild.yaml" ]; then
    # Use cloudbuild.yaml if it exists
    gcloud builds submit \
        --config=cloudbuild.yaml \
        --project="$PROJECT_ID" \
        --region="$REGION"
else
    # Direct docker build and push
    gcloud builds submit \
        --tag="$IMAGE_NAME" \
        --project="$PROJECT_ID" \
        --region="$REGION"
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image built successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Deploy to Cloud Run (if not using cloudbuild.yaml deployment)
if [ ! -f "cloudbuild.yaml" ]; then
    echo ""
    echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
    
    gcloud run deploy "$SERVICE_NAME" \
        --image="$IMAGE_NAME" \
        --platform=managed \
        --region="$REGION" \
        --allow-unauthenticated \
        --memory=1Gi \
        --cpu=1 \
        --timeout=300 \
        --port=8080 \
        --max-instances=10 \
        --project="$PROJECT_ID"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Deployment successful${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
fi

# Get the service URL
echo ""
echo -e "${YELLOW}Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --format='value(status.url)' 2>/dev/null)

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Your app is live at:${NC}"
echo -e "${BLUE}$SERVICE_URL${NC}"
echo ""
echo -e "${YELLOW}Test the health endpoint:${NC}"
echo "  curl $SERVICE_URL/health"
echo ""
echo -e "${YELLOW}Upload a CSV for prediction:${NC}"
echo "  curl -X POST $SERVICE_URL/predict \\"
echo "    -F \"file=@sample_data.csv\" \\"
echo "    -F \"dataset_type=kepler\""
echo ""
