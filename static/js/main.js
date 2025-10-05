// Global state
let selectedDataset = null;
let uploadedFile = null;

// Smooth scroll function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Dataset selection
function selectDataset(dataset) {
    selectedDataset = dataset;
    
    // Update UI - remove selected class from all cards
    const cards = document.querySelectorAll('.dataset-card');
    cards.forEach(card => card.classList.remove('selected'));
    
    // Add selected class to clicked card
    const selectedCard = document.querySelector(`[data-dataset="${dataset}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Show upload section
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        uploadSection.style.display = 'block';
        
        // Scroll to upload section
        setTimeout(() => {
            uploadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', function(e) {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('drag-active');
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('drag-active');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('drag-active');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('drag-active');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
    }
});

// Handle file selection
function handleFile(file) {
    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
        showAlert('Veuillez sélectionner un fichier CSV', 'error');
        return;
    }
    
    uploadedFile = file;
    
    // Display file in list
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = `
        <div class="file-item">
            <span class="file-name">📄 ${file.name} (${formatFileSize(file.size)})</span>
            <button class="file-remove" onclick="removeFile()">Supprimer</button>
        </div>
    `;
    
    // Show process button
    const processButton = document.getElementById('processButton');
    if (processButton) {
        processButton.style.display = 'block';
    }
}

// Remove file
function removeFile() {
    uploadedFile = null;
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    const processButton = document.getElementById('processButton');
    if (processButton) {
        processButton.style.display = 'none';
    }
    
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.value = '';
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Process file and get predictions
async function processFile() {
    if (!uploadedFile) {
        showAlert('Veuillez sélectionner un fichier', 'error');
        return;
    }
    
    if (!selectedDataset) {
        showAlert('Veuillez sélectionner un dataset', 'error');
        return;
    }
    
    // Hide process button
    const processButton = document.getElementById('processButton');
    if (processButton) {
        processButton.style.display = 'none';
    }
    
    // Show progress
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressSection) {
        progressSection.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = 'Préparation de l\'analyse...';
    }
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (progress <= 90) {
            progressFill.style.width = progress + '%';
        }
    }, 200);
    
    try {
        // Create form data
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('dataset_type', selectedDataset);
        
        progressText.textContent = 'Envoi des données à l\'IA...';
        
        // Send request to Flask backend
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        progressText.textContent = 'Analyse terminée !';
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la prédiction');
        }
        
        const result = await response.json();
        
        // Hide progress
        setTimeout(() => {
            if (progressSection) {
                progressSection.style.display = 'none';
            }
            
            // Display results
            displayResults(result);
        }, 1000);
        
    } catch (error) {
        clearInterval(progressInterval);
        
        if (progressSection) {
            progressSection.style.display = 'none';
        }
        
        if (processButton) {
            processButton.style.display = 'block';
        }
        
        showAlert('Erreur: ' + error.message, 'error');
        console.error('Error:', error);
    }
}

// Display prediction results
function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    
    if (!resultsSection) return;
    
    // Count predictions
    const predictions = data.predictions || [];
    const probabilities = data.probabilities || [];
    
    const confirmedCount = predictions.filter(p => p === 'CONFIRMED').length;
    const candidateCount = predictions.filter(p => p === 'CANDIDATE').length;
    const falsePositiveCount = predictions.filter(p => p === 'FALSE POSITIVE').length;
    
    // Calculate average probability
    const avgProbability = probabilities.length > 0 
        ? (probabilities.reduce((a, b) => a + b, 0) / probabilities.length * 100).toFixed(1)
        : 0;
    
    // Build results HTML
    let resultsHTML = `
        <div class="results-header">
            <h3 class="results-title">🎯 Résultats de l'analyse</h3>
            <span class="dataset-badge ${selectedDataset}">${selectedDataset.toUpperCase()}</span>
        </div>
        
        <div class="results-summary">
            <div class="summary-item">
                <span class="summary-label">Échantillons analysés</span>
                <span class="summary-value">${data.num_samples || predictions.length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Planètes confirmées</span>
                <span class="summary-value">${confirmedCount}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Candidats</span>
                <span class="summary-value">${candidateCount}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Probabilité moyenne</span>
                <span class="summary-value">${avgProbability}%</span>
            </div>
        </div>
        
        <div class="results-table">
            <table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Prédiction</th>
                        <th>Probabilité</th>
                        <th>Confiance</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add rows for each prediction
    predictions.forEach((prediction, index) => {
        const probability = probabilities[index] || 0;
        const probabilityPercent = (probability * 100).toFixed(2);
        
        let predictionClass = 'prediction-candidate';
        if (prediction === 'CONFIRMED') {
            predictionClass = 'prediction-confirmed';
        } else if (prediction === 'FALSE POSITIVE') {
            predictionClass = 'prediction-false-positive';
        }
        
        resultsHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <span class="prediction-badge ${predictionClass}">
                        ${prediction}
                    </span>
                </td>
                <td>${probabilityPercent}%</td>
                <td>
                    <div class="probability-bar">
                        <div class="probability-fill" style="width: ${probabilityPercent}%"></div>
                    </div>
                </td>
            </tr>
        `;
    });
    
    resultsHTML += `
                </tbody>
            </table>
        </div>
        
        <div class="cta-section" style="margin-top: 2rem;">
            <button class="btn btn-outline" onclick="resetAnalysis()">
                🔄 Nouvelle analyse
            </button>
        </div>
    `;
    
    resultsSection.innerHTML = resultsHTML;
    resultsSection.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Reset analysis
function resetAnalysis() {
    // Clear file
    removeFile();
    
    // Hide results
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'none';
        resultsSection.innerHTML = '';
    }
    
    // Scroll to dataset selector
    const datasetSelector = document.querySelector('.dataset-selector');
    if (datasetSelector) {
        datasetSelector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Show alert
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    alert.innerHTML = `
        <span style="font-size: 1.5rem;">${icon}</span>
        <span>${message}</span>
    `;
    
    // Insert alert at the top of upload section
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        uploadSection.insertBefore(alert, uploadSection.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Initialize tooltips and other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('MPGA Web App initialized');
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
