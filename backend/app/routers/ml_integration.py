from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import sys
import os
import pandas as pd
import numpy as np

# Add the ML directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml'))

from database import get_db
import crud
import schemas

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

# Import ML models (these will be loaded when the router is created)
try:
    from demand_forecaster import DemandForecaster
    from anomaly_detector import AnomalyDetector
    
    # Initialize ML models
    demand_forecaster = DemandForecaster()
    anomaly_detector = AnomalyDetector()
    
    # Load pre-trained models
    demand_forecaster.load_models()
    anomaly_detector.load_models()
    
    ML_MODELS_LOADED = True
except Exception as e:
    print(f"Warning: ML models could not be loaded: {e}")
    ML_MODELS_LOADED = False

@router.get("/status")
def get_ml_status():
    """Get the status of ML models"""
    return {
        "models_loaded": ML_MODELS_LOADED,
        "demand_forecasting": "available" if ML_MODELS_LOADED else "unavailable",
        "anomaly_detection": "available" if ML_MODELS_LOADED else "unavailable"
    }

@router.post("/demand-forecast")
def generate_demand_forecast(
    site_id: str,
    equipment_type: str,
    days_ahead: int = 7,
    db: Session = Depends(get_db)
):
    """Generate demand forecast for a specific site and equipment type"""
    if not ML_MODELS_LOADED:
        raise HTTPException(
            status_code=503, 
            detail="ML models are not available. Please ensure models are trained and loaded."
        )
    
    try:
        # Generate forecast using the trained model
        forecast = demand_forecaster.predict_demand(
            site_id=site_id,
            equipment_type=equipment_type,
            days_ahead=days_ahead
        )
        
        # Store forecast in database for tracking
        forecast_data = {
            "site_id": site_id,
            "equipment_type": equipment_type,
            "forecast_date": datetime.now(),
            "predicted_demand": int(forecast),
            "confidence_score": 0.85  # This could be enhanced with actual confidence scores
        }
        
        # Create forecast record
        crud.create_demand_forecast(db, forecast_data)
        
        return {
            "site_id": site_id,
            "equipment_type": equipment_type,
            "forecast_days": days_ahead,
            "predicted_demand": int(forecast),
            "confidence_score": 0.85,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating demand forecast: {str(e)}"
        )

@router.post("/demand-forecast/bulk")
def generate_bulk_demand_forecast(
    days_ahead: int = 7,
    db: Session = Depends(get_db)
):
    """Generate demand forecasts for all site-equipment combinations"""
    if not ML_MODELS_LOADED:
        raise HTTPException(
            status_code=503, 
            detail="ML models are not available. Please ensure models are trained and loaded."
        )
    
    try:
        # Get all unique site-equipment combinations from the database
        equipment_list = crud.get_equipment_list(db, skip=0, limit=1000)
        sites = crud.get_sites(db, skip=0, limit=1000)
        
        forecasts = []
        
        for equipment in equipment_list:
            for site in sites:
                try:
                    forecast = demand_forecaster.predict_demand(
                        site_id=site.site_id,
                        equipment_type=equipment.type,
                        days_ahead=days_ahead
                    )
                    
                    forecast_data = {
                        "site_id": site.site_id,
                        "equipment_type": equipment.type,
                        "forecast_date": datetime.now(),
                        "predicted_demand": int(forecast),
                        "confidence_score": 0.85
                    }
                    
                    # Store in database
                    crud.create_demand_forecast(db, forecast_data)
                    
                    forecasts.append(forecast_data)
                    
                except Exception as e:
                    # Log error but continue with other combinations
                    print(f"Error forecasting {equipment.type} at {site.site_id}: {e}")
                    continue
        
        return {
            "message": f"Generated {len(forecasts)} demand forecasts",
            "forecasts_count": len(forecasts),
            "days_ahead": days_ahead,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating bulk demand forecasts: {str(e)}"
        )

@router.post("/anomaly-detection")
def detect_anomalies(db: Session = Depends(get_db)):
    """Run anomaly detection on current rental data"""
    if not ML_MODELS_LOADED:
        raise HTTPException(
            status_code=503, 
            detail="ML models are not available. Please ensure models are trained and loaded."
        )
    
    try:
        # Get current rental data
        rentals = crud.get_rentals(db, skip=0, limit=1000)
        
        if not rentals:
            return {"message": "No rental data available for anomaly detection"}
        
        # Convert rentals to format expected by anomaly detector
        rental_data = []
        for rental in rentals:
            # Get usage logs for this rental
            usage_logs = crud.get_usage_logs_by_rental(db, rental.id)
            
            if usage_logs:
                # Calculate average daily metrics
                total_engine_hours = sum(log.engine_hours for log in usage_logs)
                total_idle_hours = sum(log.idle_hours for log in usage_logs)
                total_days = len(usage_logs)
                
                rental_data.append({
                    'Equipment ID': rental.equipment.equipment_id,
                    'Type': rental.equipment.type,
                    'Site ID': rental.site.site_id if rental.site else None,
                    'Expected Check-Out Date': rental.check_out_date,
                    'Check-In Date': rental.check_in_date or datetime.now(),
                    'Engine Hours/Day': total_engine_hours / total_days if total_days > 0 else 0,
                    'Idle Hours/Day': total_idle_hours / total_days if total_days > 0 else 0,
                    'Operating Days': total_days,
                    'Last Operator ID': rental.operator.operator_id if rental.operator else None
                })
        
        if not rental_data:
            return {"message": "No usage data available for anomaly detection"}
        
        # Convert to DataFrame
        df = pd.DataFrame(rental_data)
        
        # Run anomaly detection
        anomalies = anomaly_detector.detect_anomalies(df)
        
        # Create alerts for detected anomalies
        alerts_created = 0
        for idx, is_anomaly in enumerate(anomalies):
            if is_anomaly:
                rental = rental_data[idx]
                
                # Create alert
                alert_data = {
                    "equipment_id": rental['Equipment ID'],
                    "alert_type": "anomaly",
                    "severity": "medium",
                    "title": f"Anomaly detected in {rental['Type']} usage",
                    "description": f"Unusual usage pattern detected for {rental['Equipment ID']} at {rental['Site ID']}. Engine hours: {rental['Engine Hours/Day']:.2f}, Idle hours: {rental['Idle Hours/Day']:.2f}"
                }
                
                crud.create_alert(db, alert_data)
                alerts_created += 1
        
        return {
            "message": "Anomaly detection completed",
            "records_analyzed": len(rental_data),
            "anomalies_detected": sum(anomalies),
            "alerts_created": alerts_created,
            "completed_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error running anomaly detection: {str(e)}"
        )

@router.get("/anomaly-detection/status")
def get_anomaly_detection_status(db: Session = Depends(get_db)):
    """Get current anomaly detection status and recent anomalies"""
    try:
        # Get recent anomaly alerts
        recent_anomalies = crud.get_alerts(
            db, 
            skip=0, 
            limit=10, 
            is_resolved=False
        )
        
        # Filter for anomaly alerts
        anomaly_alerts = [alert for alert in recent_anomalies if alert.alert_type == "anomaly"]
        
        return {
            "total_anomalies": len(anomaly_alerts),
            "recent_anomalies": [
                {
                    "id": alert.id,
                    "equipment_id": alert.equipment_id,
                    "title": alert.title,
                    "severity": alert.severity,
                    "created_at": alert.created_at.isoformat()
                }
                for alert in anomaly_alerts
            ],
            "last_check": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting anomaly detection status: {str(e)}"
        )

@router.get("/demand-forecast/history")
def get_forecast_history(
    site_id: Optional[str] = None,
    equipment_type: Optional[str] = None,
    days_back: int = 30,
    db: Session = Depends(get_db)
):
    """Get historical demand forecasts"""
    try:
        # Get forecasts from database
        forecasts = crud.get_demand_forecasts(
            db, 
            site_id=site_id, 
            equipment_type=equipment_type,
            days_back=days_back
        )
        
        return {
            "forecasts": [
                {
                    "id": forecast.id,
                    "site_id": forecast.site_id,
                    "equipment_type": forecast.equipment_type,
                    "forecast_date": forecast.forecast_date.isoformat(),
                    "predicted_demand": forecast.predicted_demand,
                    "confidence_score": forecast.confidence_score,
                    "actual_demand": forecast.actual_demand,
                    "created_at": forecast.created_at.isoformat()
                }
                for forecast in forecasts
            ],
            "total_forecasts": len(forecasts)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting forecast history: {str(e)}"
        )

@router.post("/ml/retrain")
def retrain_ml_models():
    """Retrain ML models with latest data"""
    if not ML_MODELS_LOADED:
        raise HTTPException(
            status_code=503, 
            detail="ML models are not available. Please ensure models are trained and loaded."
        )
    
    try:
        # This would trigger retraining of models
        # For now, we'll just reload the existing models
        demand_forecaster.load_models()
        anomaly_detector.load_models()
        
        return {
            "message": "ML models reloaded successfully",
            "demand_forecasting": "reloaded",
            "anomaly_detection": "reloaded",
            "reloaded_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retraining ML models: {str(e)}"
        )
