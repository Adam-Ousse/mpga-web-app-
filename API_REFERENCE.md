# API Quick Reference Guide

## Base URL
```
Local: http://localhost:8080
Production: https://your-cloud-run-url.run.app
```

## Endpoints

### 1. Main Page
```
GET /
```
Returns the main HTML page with CSV upload interface.

---

### 2. Kepler Mission Page
```
GET /kepler
```
Returns information page about Kepler mission and model.

---

### 3. K2 Mission Page
```
GET /k2
```
Returns information page about K2 mission and model.

---

### 4. TESS Mission Page
```
GET /tess
```
Returns information page about TESS mission and model.

---

### 5. Predict (CSV Upload)
```
POST /predict
```

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (required): CSV file containing flux data
- `dataset_type` (required): One of `kepler`, `k2`, or `tess`

**Example Request (curl):**
```bash
curl -X POST http://localhost:8080/predict \
  -F "file=@sample_data.csv" \
  -F "dataset_type=kepler"
```

**Example Request (Python):**
```python
import requests

with open('sample_data.csv', 'rb') as f:
    response = requests.post(
        'http://localhost:8080/predict',
        files={'file': f},
        data={'dataset_type': 'kepler'}
    )
    print(response.json())
```

**Example Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('dataset_type', 'kepler');

fetch('/predict', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

**Success Response (200):**
```json
{
  "dataset_type": "kepler",
  "num_samples": 3,
  "predictions": [
    "CONFIRMED",
    "CONFIRMED", 
    "CANDIDATE"
  ],
  "probabilities": [
    0.9976222060240763,
    0.9976980892568947,
    0.9805308386846641
  ]
}
```

**Error Response (400 - Bad Request):**
```json
{
  "error": "No file uploaded"
}
```

**Error Response (400 - Invalid Dataset):**
```json
{
  "error": "Invalid dataset type. Must be kepler, k2, or tess"
}
```

**Error Response (400 - Invalid CSV):**
```json
{
  "error": "Invalid CSV format"
}
```

**Error Response (500 - API Error):**
```json
{
  "error": "Prediction API returned error: 500",
  "details": "..."
}
```

---

### 6. Health Check
```
GET /health
```

**Response (200):**
```json
{
  "status": "healthy"
}
```

---

## CSV File Format

Your CSV file must contain flux measurements as columns:

```csv
FLUX_1,FLUX_2,FLUX_3,FLUX_4,...,FLUX_N
0.999821,1.000143,0.999687,1.000234,...,1.000276
0.999945,1.000067,0.999823,1.000189,...,1.000089
1.000056,0.999876,1.000234,0.999745,...,0.999745
```

**Requirements:**
- Each row represents one light curve observation
- Column headers should be named (e.g., FLUX_1, FLUX_2, etc.)
- Values should be normalized flux measurements
- NaN and Inf values are automatically cleaned
- Minimum 200 data points recommended for best results

---

## Prediction Classes

The model returns one of three prediction classes:

### CONFIRMED
- High confidence detection
- Strong exoplanet signal
- Probability typically > 95%

### CANDIDATE
- Moderate confidence detection
- Potential exoplanet signal
- Probability typically 70-95%
- Requires further validation

### FALSE POSITIVE
- Low confidence detection
- Likely instrumental artifact or stellar variability
- Probability typically < 70%

---

## Dataset Types

### kepler
- Kepler Space Telescope (2009-2018)
- Fixed field of view
- 150,000+ stars monitored
- 2,600+ confirmed exoplanets

### k2
- Extended Kepler Mission (2014-2018)
- Multiple campaign fields
- 500+ exoplanets discovered
- Different instrumental characteristics

### tess
- Transiting Exoplanet Survey Satellite (2018-present)
- All-sky survey
- 5,000+ candidates identified
- Brighter, nearby stars

---

## External Prediction API

The Flask app communicates with this external API:

**Base URL:**
```
https://flask-models-planet-detector-841768974079.europe-west1.run.app/
```

**Endpoint:**
```
POST /predict
```

**Request Format:**
```json
{
  "dataset_type": "kepler",
  "data": {
    "FLUX_1": [0.999821, 0.999945, 1.000056],
    "FLUX_2": [1.000143, 1.000067, 0.999876],
    "FLUX_3": [0.999687, 0.999823, 1.000234],
    ...
  }
}
```

**Note:** The Flask app automatically:
1. Reads CSV file
2. Converts to dictionary format
3. Cleans NaN/Inf values
4. Sends to external API
5. Returns formatted results

---

## Error Handling

The API includes comprehensive error handling:

1. **File Validation**
   - Checks if file is uploaded
   - Validates CSV format
   - Verifies file is not empty

2. **Dataset Validation**
   - Ensures dataset_type is provided
   - Validates it's one of: kepler, k2, tess

3. **Data Processing**
   - Handles CSV parsing errors
   - Cleans NaN and Inf values
   - Validates data structure

4. **API Communication**
   - Timeout handling (30 seconds)
   - Connection error handling
   - HTTP status code validation

---

## Rate Limiting

Currently, there are no rate limits on the local Flask app. However:

- The external prediction API may have its own limits
- For production, consider implementing rate limiting
- Use appropriate timeout values for large files

---

## Best Practices

1. **File Size**
   - Keep CSV files under 10MB for best performance
   - Larger files may timeout

2. **Data Quality**
   - Ensure flux values are normalized
   - Remove obvious outliers before upload
   - Use consistent column naming

3. **Error Handling**
   - Always check response status codes
   - Handle timeouts gracefully
   - Log errors for debugging

4. **Performance**
   - Cache results when possible
   - Batch similar requests
   - Use appropriate timeout values

---

## Testing

**Test with sample data:**
```bash
# Using the included sample file
curl -X POST http://localhost:8080/predict \
  -F "file=@sample_data.csv" \
  -F "dataset_type=kepler"
```

**Expected response:**
```json
{
  "dataset_type": "kepler",
  "num_samples": 3,
  "predictions": ["CONFIRMED", "CONFIRMED", "CONFIRMED"],
  "probabilities": [0.997..., 0.997..., 0.980...]
}
```

---

## Support

For issues or questions:
1. Check the error message in the response
2. Verify CSV format matches requirements
3. Ensure dataset_type is correct
4. Check network connectivity
5. Review server logs for detailed errors

---

**Last Updated:** October 2024
**API Version:** 1.0
