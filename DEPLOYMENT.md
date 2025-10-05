# MPGA Web App - Make Pluto Great Again

A Flask-based web application for predicting exoplanet classifications using AI models trained on Kepler, K2, and TESS mission data.

## 🚀 Features

- **CSV Upload & Prediction**: Upload CSV files containing light curve data and get AI predictions
- **Multi-Mission Support**: Works with data from Kepler, K2, and TESS missions
- **Real-time Results**: Instant predictions with probability scores
- **Educational Pages**: Detailed information about each space mission and the AI models
- **Responsive Design**: Works on desktop and mobile devices
- **Space Theme**: Beautiful animated starfield background

## 📋 Prerequisites

- Python 3.11+
- Docker (for containerized deployment)
- Google Cloud CLI (for Cloud Run deployment)

## 🛠️ Local Development

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

The application will be available at `http://localhost:8080`

### 3. Test the Application

1. Navigate to `http://localhost:8080`
2. Select a dataset type (Kepler, K2, or TESS)
3. Upload a CSV file with light curve data
4. Click "Analyser avec l'IA" to get predictions

## 📊 CSV Format

Your CSV file should contain flux values as columns:

```csv
FLUX_1,FLUX_2,FLUX_3,...,FLUX_N
0.9998,1.0001,0.9997,...,1.0003
0.9995,1.0002,0.9999,...,1.0001
```

- Each row represents one light curve observation
- Column names should represent flux measurements
- NaN and Inf values are automatically cleaned
- Minimum 200 data points recommended

## 🐳 Docker Deployment

### Build the Docker Image

```bash
docker build -t mpga-webapp .
```

### Run the Container Locally

```bash
docker run -p 8080:8080 mpga-webapp
```

## ☁️ Google Cloud Run Deployment

### 1. Build and Push to Google Container Registry

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"
export REGION="europe-west1"

# Build and push
gcloud builds submit --tag gcr.io/$PROJECT_ID/mpga-webapp

# Or use Artifact Registry
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/mpga/mpga-webapp
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy mpga-webapp \
  --image gcr.io/$PROJECT_ID/mpga-webapp \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --port 8080
```

Or with Artifact Registry:

```bash
gcloud run deploy mpga-webapp \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/mpga/mpga-webapp \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --port 8080
```

### 3. Get the Deployment URL

```bash
gcloud run services describe mpga-webapp --region $REGION --format 'value(status.url)'
```

## 🏗️ Project Structure

```
mpga-web-app/
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker configuration
├── .dockerignore          # Docker ignore file
├── templates/             # HTML templates
│   ├── index.html        # Main page
│   ├── kepler.html       # Kepler mission info
│   ├── k2.html           # K2 mission info
│   └── tess.html         # TESS mission info
└── static/               # Static assets
    ├── css/
    │   └── styles.css    # Main stylesheet
    ├── js/
    │   └── main.js       # JavaScript functionality
    └── images/           # Image assets
        └── space.png     # Hero image
```

## 🎯 API Endpoints

### Main Routes

- `GET /` - Main application page
- `GET /kepler` - Kepler mission information
- `GET /k2` - K2 mission information
- `GET /tess` - TESS mission information

### API Routes

- `POST /predict` - Upload CSV and get predictions
  - Form data: `file` (CSV file), `dataset_type` (kepler/k2/tess)
  - Returns: JSON with predictions and probabilities

- `GET /health` - Health check endpoint
  - Returns: `{"status": "healthy"}`

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 8080)
- `PYTHONUNBUFFERED`: Enable Python logging (set to 1)

### Prediction API

The application uses the following external prediction API:

```
https://flask-models-planet-detector-841768974079.europe-west1.run.app/predict
```

## 📚 Technology Stack

### Backend
- **Flask 3.0**: Web framework
- **Pandas 2.1**: Data processing
- **Requests 2.31**: HTTP client
- **Gunicorn 21.2**: Production WSGI server

### Frontend
- **Vanilla JavaScript**: No frameworks
- **CSS3**: Custom styling with animations
- **HTML5**: Semantic markup

## 🎨 Theme & Design

The application maintains the original MPGA theme:

- **Colors**:
  - Primary Background: `#252627`
  - Text Primary: `#fcecce`
  - Text Secondary: `#a7754e`
  - Accent Primary (Red): `#b83c2c`
  - Accent Secondary (Gold): `#c99665`
  - Accent Tertiary (Brown): `#80563e`

- **Features**:
  - Animated starfield background
  - Smooth transitions and hover effects
  - Responsive grid layouts
  - Gradient text effects

## 🧪 Testing

### Test the Prediction Endpoint

```python
import requests
import pandas as pd

# Create sample data
df = pd.DataFrame({
    'FLUX_1': [0.9998, 0.9995],
    'FLUX_2': [1.0001, 1.0002],
    'FLUX_3': [0.9997, 0.9999]
})

# Save to CSV
df.to_csv('test_data.csv', index=False)

# Test the endpoint
with open('test_data.csv', 'rb') as f:
    response = requests.post(
        'http://localhost:8080/predict',
        files={'file': f},
        data={'dataset_type': 'kepler'}
    )
    print(response.json())
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Use a different port
   export PORT=8081
   python app.py
   ```

2. **CSV upload fails**
   - Ensure file is valid CSV format
   - Check that dataset_type is one of: kepler, k2, tess
   - Verify file size is reasonable (< 10MB recommended)

3. **Prediction API timeout**
   - The external API may be slow or unavailable
   - Check network connectivity
   - Verify API endpoint is accessible

## 📄 License

This project is open source and available for educational and research purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Contact

For questions or support, please contact the MPGA team.

---

**Make Pluto Great Again** 🚀 ❤️
