# Enhanced Demand Forecasting System

## Overview

The Smart Rental Tracker now features an advanced, ML-powered demand forecasting system that provides site-specific predictions based on actual usage patterns. This system replaces the static demand model with dynamic, data-driven predictions that are realistic for real-world construction and mining equipment rental scenarios.

## Key Features

### 🎯 **Site-Specific Predictions**
- **Individual Site Models**: Each site gets its own trained ML model for higher accuracy
- **Equipment-Site Combinations**: Predict demand for specific equipment types at specific sites
- **Historical Pattern Learning**: Models learn from actual usage data at each location

### 📊 **Enhanced Feature Engineering**
- **Seasonal Patterns**: Summer peak (June-August), Winter low (Dec-Feb), Spring/Fall moderate
- **Day-of-Week Patterns**: Weekend vs. weekday demand variations
- **Site Characteristics**: Equipment count, utilization rates, equipment popularity
- **Time Series Features**: 7-day and 30-day rolling averages
- **Realistic Constraints**: Maximum demand limits based on available equipment

### 🔮 **30-Day Forecasting**
- **Extended Horizon**: Predict demand for the next 30 days (instead of 7)
- **Trend Analysis**: Identify increasing, decreasing, or stable demand patterns
- **Confidence Scoring**: Dynamic confidence based on data availability and quality
- **Peak/Low Detection**: Identify highest and lowest demand days

### 🧠 **Advanced ML Models**
- **Gradient Boosting**: Primary model for better prediction accuracy
- **Site-Specific Models**: Individual models for sites with sufficient data
- **Feature Scaling**: Proper normalization for consistent predictions
- **Model Validation**: Cross-validation and performance metrics

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   ML System     │
│   (React)       │◄──►│   (FastAPI)      │◄──►│   (Python)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ DemandForecast  │    │ ML Integration   │    │ SmartMLSystem   │
│ Component       │    │ Router           │    │ Class           │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## API Endpoints

### Demand Forecasting
- `POST /ml/demand-forecast` - Generate site/equipment-specific forecasts
- `POST /ml/demand-forecast/bulk` - Generate forecasts for all equipment types
- `GET /ml/status` - Check ML system availability
- `POST /ml/models/retrain` - Retrain models with new data
- `POST /ml/models/save` - Save trained models to disk

### Parameters
- `equipment_type` (optional): Specific equipment type (Excavator, Bulldozer, etc.)
- `site_id` (optional): Specific site ID (S001, S002, etc.)
- `days_ahead` (default: 30): Number of days to forecast

## Usage Examples

### 1. Site-Specific Forecast
```bash
curl -X POST "http://localhost:8000/ml/demand-forecast" \
  -H "Content-Type: application/json" \
  -d '{"site_id": "S001", "days_ahead": 30}'
```

### 2. Equipment-Specific Forecast
```bash
curl -X POST "http://localhost:8000/ml/demand-forecast" \
  -H "Content-Type: application/json" \
  -d '{"equipment_type": "Excavator", "days_ahead": 30}'
```

### 3. Combined Forecast
```bash
curl -X POST "http://localhost:8000/ml/demand-forecast" \
  -H "Content-Type: application/json" \
  -d '{"equipment_type": "Bulldozer", "site_id": "S002", "days_ahead": 30}'
```

## Frontend Integration

### Component Features
- **Site Selection**: Choose specific sites for targeted forecasts
- **Equipment Filtering**: Filter by equipment type
- **30-Day View**: Comprehensive 30-day forecast display
- **Trend Visualization**: Charts showing demand patterns
- **Confidence Indicators**: Visual confidence scores for each prediction
- **Peak/Low Highlights**: Identify highest and lowest demand periods

### Real-time Updates
- **Auto-refresh**: 30-second automatic updates
- **Manual Refresh**: Button to manually update forecasts
- **Error Handling**: Graceful fallback to mock data if backend unavailable

## Training and Model Management

### Training Process
1. **Data Loading**: Load historical rental data from CSV
2. **Feature Engineering**: Create time-series and site-specific features
3. **Model Training**: Train global and site-specific models
4. **Validation**: Cross-validate model performance
5. **Model Saving**: Save trained models to disk

### Model Files
- `demand_forecaster.pkl` - Main demand forecasting model
- `scaler.pkl` - Feature scaling parameters
- `equipment_encoder.pkl` - Equipment type encoding
- `site_encoder.pkl` - Site ID encoding
- `site_model_{SITE_ID}.pkl` - Site-specific models

### Retraining
```bash
# Retrain models with new data
curl -X POST "http://localhost:8000/ml/models/retrain"

# Save models after training
curl -X POST "http://localhost:8000/ml/models/save"
```

## Data Requirements

### Minimum Data Quality
- **Records**: At least 50 historical records
- **Sites**: Multiple sites with at least 10 records each
- **Equipment Types**: Multiple equipment types represented
- **Time Range**: At least 3 months of historical data
- **Features**: Engine hours, idle hours, rental duration, site assignments

### Data Schema
```csv
Equipment ID,Type,User ID,Check-Out Date,Check-in Date,Engine Hours/Day,Idle Hours/Day,Operating Days,Last Operator ID
EQX1001,Excavator,S001,2025-01-01,2025-01-15,8.5,2.5,14,OP101
```

## Performance Metrics

### Model Evaluation
- **Mean Squared Error (MSE)**: Overall prediction accuracy
- **Mean Absolute Error (MAE)**: Average prediction error
- **R² Score**: Model fit quality (0-1, higher is better)
- **Cross-validation**: Robust performance assessment

### Confidence Scoring
- **Data Availability**: More data = higher confidence
- **Site Familiarity**: Known sites = higher confidence
- **Equipment History**: More equipment data = higher confidence
- **Time Distance**: Closer dates = higher confidence

## Real-World Scenarios

### Construction Projects
- **Seasonal Planning**: Prepare for summer peak demand
- **Equipment Allocation**: Distribute equipment based on site needs
- **Maintenance Scheduling**: Plan maintenance during low-demand periods
- **Inventory Management**: Stock appropriate equipment levels

### Mining Operations
- **Shift Planning**: Optimize equipment usage across shifts
- **Site Expansion**: Plan for new site equipment needs
- **Equipment Rotation**: Move equipment between sites based on demand
- **Cost Optimization**: Reduce idle equipment during low-demand periods

## Troubleshooting

### Common Issues
1. **Models Not Training**: Check data quality and quantity
2. **Low Confidence**: Ensure sufficient historical data
3. **Poor Predictions**: Verify data consistency and completeness
4. **Backend Errors**: Check ML system status endpoint

### Debug Commands
```bash
# Check ML system status
curl "http://localhost:8000/ml/status"

# Check ML system health
curl "http://localhost:8000/ml/health"

# Test demand forecasting
python ml/train_enhanced_models.py
```

## Future Enhancements

### Planned Features
- **Weather Integration**: Include weather data in predictions
- **Economic Indicators**: Factor in market conditions
- **Project Timelines**: Consider project completion dates
- **Equipment Age**: Factor in equipment reliability
- **Operator Preferences**: Include operator skill levels

### Advanced Analytics
- **Demand Clustering**: Group similar demand patterns
- **Anomaly Detection**: Identify unusual demand spikes
- **Predictive Maintenance**: Predict equipment failures
- **Cost Optimization**: Suggest optimal rental strategies

## Getting Started

### 1. Install Dependencies
```bash
cd ml
pip install -r requirements.txt
```

### 2. Train Models
```bash
python train_enhanced_models.py
```

### 3. Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Access Dashboard
Open `http://localhost:3000` in your browser and navigate to the "Demand Forecast" tab.

## Support

For technical support or questions about the enhanced demand forecasting system, please refer to the main project documentation or create an issue in the project repository.

---

**Note**: This enhanced system is designed for production use and provides realistic, data-driven demand predictions that can significantly improve equipment rental operations and resource planning.
