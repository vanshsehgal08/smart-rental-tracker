# Smart Rental Tracker - Machine Learning System

This directory contains the machine learning components for the Smart Rental Tracker system, implementing both **demand forecasting** and **anomaly detection** capabilities.

## 🎯 Overview

The ML system provides two main functionalities:

1. **Demand Forecasting** - Predicts equipment rental demand by site and equipment type
2. **Anomaly Detection** - Identifies unusual equipment usage patterns and potential misuse

## 📁 File Structure

```
ml/
├── demand_forecaster.py      # Demand forecasting system
├── anomaly_detector.py       # Anomaly detection system
├── train_models.py          # Complete training orchestration
├── requirements.txt          # Python dependencies
├── README.md                # This file
└── sample_data.csv          # Sample training data
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### 2. Run Complete Training

```bash
python train_models.py
```

This will train both demand forecasting and anomaly detection models using your rental data.

### 3. Individual Training

```bash
# Train only demand forecasting
python demand_forecaster.py

# Train only anomaly detection
python anomaly_detector.py
```

## 🔮 Demand Forecasting System

### What It Does
- Transforms rental logs into daily time series data
- Engineers features including time-based patterns, lag features, and rolling statistics
- Trains separate models for each site-equipment combination
- Predicts future demand up to 7+ days ahead

### Key Features
- **Time Series Transformation**: Converts individual rental events to daily counts
- **Feature Engineering**: 
  - Day of week, month, quarter, year
  - Time index (T = 1, 2, 3, ...)
  - Lag features (1, 7, 30 days)
  - Rolling averages and standard deviations
- **Model Training**: Random Forest and Gradient Boosting models
- **Performance Metrics**: MAE, RMSE, R², MAPE

### Usage Example

```python
from demand_forecaster import DemandForecaster

# Initialize
forecaster = DemandForecaster('../database/data.csv')

# Load and transform data
ts_data = forecaster.load_and_transform_data()
ts_features = forecaster.engineer_features(ts_data)

# Train models
forecaster.train_all_models(ts_features)

# Make predictions
predictions = forecaster.predict_demand('SITE011', 'Excavator', days_ahead=7)
print(f"Next 7 days demand: {predictions}")
```

## 🚨 Anomaly Detection System

### What It Does
- Identifies unusual equipment usage patterns
- Detects potential misuse, inefficiency, or equipment issues
- Uses multiple detection methods for robust results

### Key Features
- **Statistical Detection**: Z-score based thresholds (2σ and 3σ)
- **ML-Based Detection**: 
  - Isolation Forest
  - Local Outlier Factor
  - DBSCAN clustering
- **Feature Engineering**:
  - Idle ratio and utilization efficiency
  - Operating patterns and duration analysis
  - Binary flags for unusual patterns
- **Consensus Detection**: Combines multiple methods for reliability

### Usage Example

```python
from anomaly_detector import AnomalyDetector

# Initialize
detector = AnomalyDetector('../database/data.csv')

# Load and analyze data
df = detector.load_data()
df_features = detector.engineer_features(df)

# Train models and run analysis
detector.calculate_statistical_thresholds(df_features)
detector.train_all_models(df_features)
df_analysis = detector.run_complete_analysis(df_features)

# View anomalies
anomalies = df_analysis[df_analysis['is_consensus_anomaly']]
print(f"Found {len(anomalies)} anomalies")
```

## 📊 Training Process

### Data Flow
1. **Raw Data** → Rental logs from database
2. **Feature Engineering** → Create ML-ready features
3. **Model Training** → Train multiple algorithms
4. **Evaluation** → Assess performance metrics
5. **Persistence** → Save trained models to disk

### Training Outputs
- **Demand Forecasting**: `demand_forecasting_models.pkl`
- **Anomaly Detection**: `anomaly_detection_models.pkl`
- **Training Report**: `training_report.txt`
- **Logs**: `ml_training.log`

## 🎛️ Configuration

### Model Parameters

#### Demand Forecasting
- **Random Forest**: 100 estimators, max depth 10
- **Gradient Boosting**: 100 estimators, max depth 6, learning rate 0.1
- **Train/Test Split**: 80/20 chronological split

#### Anomaly Detection
- **Isolation Forest**: contamination=0.1, 100 estimators
- **Local Outlier Factor**: contamination=0.1, 20 neighbors
- **DBSCAN**: eps=0.5, min_samples=5
- **Statistical Thresholds**: 2σ and 3σ deviations

### Data Requirements
- **Minimum Records**: 50+ per site-equipment combination
- **Date Range**: At least 6 months of historical data
- **Required Columns**: Equipment ID, Type, Site ID, Check-out/Check-in dates, Engine/Idle hours

## 📈 Performance Metrics

### Demand Forecasting
- **R² Score**: How well the model explains variance (0-1, higher is better)
- **MAE**: Mean Absolute Error in rental units
- **RMSE**: Root Mean Square Error
- **MAPE**: Mean Absolute Percentage Error

### Anomaly Detection
- **Detection Rate**: Percentage of anomalies correctly identified
- **False Positive Rate**: Normal cases flagged as anomalies
- **Consensus Score**: How many methods agree on an anomaly (0-3)

## 🔧 Customization

### Adding New Features
1. Modify the `engineer_features()` method in respective classes
2. Update the `feature_columns` list
3. Retrain models

### Changing Algorithms
1. Import new algorithms from scikit-learn
2. Modify the `train_model()` method
3. Update hyperparameters as needed

### Adjusting Thresholds
- **Statistical**: Modify standard deviation multipliers in `calculate_statistical_thresholds()`
- **ML**: Adjust contamination, eps, or other algorithm-specific parameters

## 🚨 Troubleshooting

### Common Issues

#### Insufficient Data
```
Error: Insufficient data for Excavator at SITE001
```
**Solution**: Ensure you have at least 50 records per site-equipment combination.

#### Import Errors
```
ModuleNotFoundError: No module named 'sklearn'
```
**Solution**: Install requirements: `pip install -r requirements.txt`

#### Path Issues
```
FileNotFoundError: Data file not found
```
**Solution**: Verify the data path in the constructor or run from the correct directory.

### Performance Tips
- **Large Datasets**: Use `n_jobs=-1` for parallel processing
- **Memory Issues**: Process data in chunks for very large datasets
- **Training Time**: Start with smaller datasets for testing

## 📚 Advanced Usage

### Real-time Predictions
```python
# Load pre-trained models
forecaster.load_models('demand_forecasting_models.pkl')

# Make predictions on new data
new_features = create_features_for_date('2025-01-15')
prediction = forecaster.predict_single(new_features)
```

### Batch Anomaly Detection
```python
# Process new rental records
new_records = load_new_rentals()
anomalies = detector.detect_anomalies_batch(new_records)
```

### Model Retraining
```python
# Retrain with new data
forecaster.retrain_models(new_data)
forecaster.save_models('updated_models.pkl')
```

## 🤝 Contributing

To extend the ML system:

1. **Add New Algorithms**: Implement new ML methods in separate classes
2. **Feature Engineering**: Extend feature creation in existing methods
3. **Evaluation Metrics**: Add new performance measures
4. **Data Sources**: Support additional data formats

## 📄 License

This ML system is part of the Smart Rental Tracker project.

## 🆘 Support

For issues or questions:
1. Check the training logs (`ml_training.log`)
2. Review the training report (`training_report.txt`)
3. Verify data format and requirements
4. Check Python dependencies and versions
