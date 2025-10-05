from flask import Flask, render_template, request, jsonify
import pandas as pd
import requests
import math
import io
import json

app = Flask(__name__)

# Base URL for the prediction API (no trailing slash!)
BASE_URL = "https://flask-models-planet-detector-841768974079.europe-west1.run.app"

def clean_nans(obj):
    """Clean NaN and Inf values for JSON serialization"""
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, list):
        return [clean_nans(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    else:
        return obj

def create_request(df, dataset_type):
    """Create a request payload for the prediction API"""
    data_dict = df.to_dict(orient='list')
    payload = {
        'dataset_type': dataset_type,
        'data': data_dict
    }
    return payload

@app.route('/')
def index():
    """Main page with CSV upload and prediction interface"""
    return render_template('index.html')

@app.route('/kepler')
def kepler():
    """Information page about Kepler dataset and model"""
    return render_template('kepler.html')

@app.route('/k2')
def k2():
    """Information page about K2 dataset and model"""
    return render_template('k2.html')

@app.route('/tess')
def tess():
    """Information page about TESS dataset and model"""
    return render_template('tess.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle CSV upload and prediction request"""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400
        
        # Get dataset type from form data
        dataset_type = request.form.get('dataset_type', '').lower()
        
        if dataset_type not in ['kepler', 'k2', 'tess']:
            return jsonify({'error': 'Invalid dataset type. Must be kepler, k2, or tess'}), 400
        
        # Read CSV file
        df = pd.read_csv(io.StringIO(file.stream.read().decode("UTF-8")))
        
        # Create request payload
        req = create_request(df, dataset_type)
        
        # Clean NaNs for JSON serialization
        cleaned_req = clean_nans(req)
        
        # Make prediction request to external API
        response = requests.post(
            f"{BASE_URL}/predict",
            json=cleaned_req,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        # Check if request was successful
        if response.status_code != 200:
            return jsonify({
                'error': f'Prediction API returned error: {response.status_code}',
                'details': response.text
            }), 500
        
        # Return prediction results
        result = response.json()
        return jsonify(result), 200
        
    except pd.errors.EmptyDataError:
        return jsonify({'error': 'CSV file is empty'}), 400
    except pd.errors.ParserError:
        return jsonify({'error': 'Invalid CSV format'}), 400
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Prediction API request timed out'}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Error communicating with prediction API: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@app.route('/health')
def health():
    """Health check endpoint for Cloud Run"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    # For local development
    app.run(host='0.0.0.0', port=8080, debug=True)
