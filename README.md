# MPGA Web App 🚀

**Make Pluto Great Again** - AI-powered Exoplanet Detection

A Flask-based web application for detecting exoplanets from light curve data using AI models trained on Kepler, K2, and TESS mission data.

![MPGA Banner](https://img.shields.io/badge/MPGA-Make%20Pluto%20Great%20Again-b83c2c?style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)

## 🌟 Features

- ✨ **CSV Upload Interface** - Easy drag-and-drop file upload
- 🤖 **AI Predictions** - Real-time exoplanet detection with probability scores
- 🛰️ **Multi-Mission Support** - Compatible with Kepler, K2, and TESS data
- 📊 **Visual Results** - Beautiful results display with confidence metrics
- 📚 **Educational Content** - Detailed pages about each space mission
- 🎨 **Space Theme** - Stunning animated starfield background
- 📱 **Responsive Design** - Works on all devices
- 🐳 **Docker Ready** - Easy deployment to Google Cloud Run

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mpga-web-app-
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Using the Startup Script (Windows)

```powershell
.\start.ps1
```

## 📊 How to Use

1. **Select a Dataset Type**
   - Choose between Kepler, K2, or TESS missions

2. **Upload CSV File**
   - Drag and drop or click to browse
   - File should contain light curve flux data

3. **Analyze**
   - Click "Analyser avec l'IA" to get predictions
   - View results with confidence scores

4. **Review Results**
   - See predictions: CONFIRMED, CANDIDATE, or FALSE POSITIVE
   - Check probability percentages
   - Download or start a new analysis

## 🐳 Docker Deployment

### Build and Run Locally

```bash
# Build
docker build -t mpga-webapp .

# Run
docker run -p 8080:8080 mpga-webapp
```

### Deploy to Google Cloud Run

```bash
# Set variables
export PROJECT_ID="your-gcp-project-id"
export REGION="europe-west1"

# Build and deploy
gcloud builds submit --tag gcr.io/$PROJECT_ID/mpga-webapp
gcloud run deploy mpga-webapp \
  --image gcr.io/$PROJECT_ID/mpga-webapp \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --timeout 300
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
mpga-web-app/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── templates/            # HTML templates
│   ├── index.html       # Main page
│   ├── kepler.html      # Kepler info
│   ├── k2.html          # K2 info
│   └── tess.html        # TESS info
├── static/              # Static assets
│   ├── css/
│   │   └── styles.css   # Vanilla CSS
│   ├── js/
│   │   └── main.js      # Vanilla JavaScript
│   └── images/
└── sample_data.csv      # Example CSV file
```

## 🎨 Technology Stack

### Backend
- **Flask 3.0** - Lightweight web framework
- **Pandas 2.1** - Data processing
- **Requests 2.31** - API communication
- **Gunicorn 21.2** - Production server

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Custom styling with animations
- **HTML5** - Semantic markup

### Infrastructure
- **Docker** - Containerization
- **Google Cloud Run** - Serverless deployment

## 🔌 API Integration

The app integrates with an external prediction API:

```
POST https://flask-models-planet-detector-841768974079.europe-west1.run.app/predict
```

**Request Format:**
```json
{
  "dataset_type": "kepler",
  "data": {
    "FLUX_1": [0.9998, 0.9995, ...],
    "FLUX_2": [1.0001, 1.0002, ...],
    ...
  }
}
```

**Response Format:**
```json
{
  "dataset_type": "kepler",
  "num_samples": 3,
  "predictions": ["CONFIRMED", "CONFIRMED", "CANDIDATE"],
  "probabilities": [0.9976, 0.9977, 0.9805]
}
```

## 📊 CSV Data Format

Your CSV should contain flux measurements:

```csv
FLUX_1,FLUX_2,FLUX_3,...,FLUX_N
0.9998,1.0001,0.9997,...,1.0003
0.9995,1.0002,0.9999,...,1.0001
```

- Each row = one observation
- Columns = flux measurements over time
- NaN/Inf values are automatically cleaned
- Recommended: 200+ data points

## 🎯 Features Overview

### Main Page
- Hero section with mission statistics
- About section explaining the project
- CSV upload with dataset selection
- Real-time prediction results

### Dataset Pages
- **Kepler**: Historic mission (2009-2018)
- **K2**: Extended mission (2014-2018)
- **TESS**: Current mission (2018-present)

Each page includes:
- Mission overview
- Model architecture details
- Data format requirements
- Notable discoveries

## 🎨 Design System

### Color Palette
- Background: `#252627`
- Primary Text: `#fcecce`
- Secondary Text: `#a7754e`
- Accent Red: `#b83c2c`
- Accent Gold: `#c99665`
- Accent Brown: `#80563e`

### Features
- Animated starfield background
- Smooth transitions
- Gradient text effects
- Responsive grid layouts
- Hover effects and animations

## 🧪 Testing

Use the included `sample_data.csv` file for testing:

```bash
# The sample file contains 3 rows of synthetic light curve data
# Perfect for testing the prediction pipeline
```

## 📝 Environment Variables

- `PORT`: Server port (default: 8080)
- `PYTHONUNBUFFERED`: Enable logging (set to 1)

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional dataset support
- Enhanced visualizations
- Batch processing
- Export functionality
- User authentication
- Model comparison features

## 📄 License

Open source project for educational and research purposes.

## 🔗 Links

- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [NASA Exoplanet Archive](https://exoplanetarchive.ipasa.nasa.gov/)
- [Kepler Mission](https://www.nasa.gov/mission_pages/kepler/)
- [K2 Mission](https://www.nasa.gov/mission_pages/kepler/k2)
- [TESS Mission](https://tess.mit.edu/)

## 🙏 Acknowledgments

This project uses data from:
- NASA's Kepler Space Telescope
- NASA's K2 Mission
- NASA's TESS Mission

## 📧 Contact

For questions, issues, or contributions, please open an issue on GitHub.

---

**Made with ❤️ for the scientific community**

🚀 Make Pluto Great Again 🚀
