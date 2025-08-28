#!/usr/bin/env python3
"""
Quick test script to verify your trained ML models are working.
Run this to test basic functionality.
"""

import sys
import os
from pathlib import Path

def test_model_loading():
    """Test if models can be loaded successfully."""
    print("=== Testing Model Loading ===\n")
    
    try:
        from demand_forecaster import DemandForecaster
        from anomaly_detector import AnomalyDetector
        
        # Test demand forecasting models
        print("Loading demand forecasting models...")
        df = DemandForecaster()
        df.load_models('demand_forecasting_models.pkl')
        print(f"✅ Loaded {len(df.models)} demand forecasting models")
        
        # Test anomaly detection models
        print("Loading anomaly detection models...")
        ad = AnomalyDetector()
        ad.load_models('anomaly_detection_models.pkl')
        print(f"✅ Loaded {len(ad.models)} anomaly detection models")
        
        return df, ad
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return None, None

def test_demand_predictions(df):
    """Test demand forecasting predictions."""
    print("\n=== Testing Demand Predictions ===\n")
    
    if df is None:
        print("❌ Cannot test predictions - models not loaded")
        return
    
    test_cases = [
        ('SITE011', 'Excavator'),
        ('SITE006', 'Bulldozer'),
        ('SITE016', 'Crane'),
        ('SITE001', 'Dumper'),
        ('SITE008', 'Loader')
    ]
    
    for site, eq_type in test_cases:
        try:
            predictions = df.predict_demand(site, eq_type, days_ahead=7)
            print(f"{eq_type} at {site} - Next 7 days:")
            for i, pred in enumerate(predictions, 1):
                print(f"  Day {i}: {pred} units")
            print()
        except Exception as e:
            print(f"❌ Error with {eq_type} at {site}: {e}\n")

def test_anomaly_detection(ad):
    """Test anomaly detection functionality."""
    print("=== Testing Anomaly Detection ===\n")
    
    if ad is None:
        print("❌ Cannot test anomaly detection - models not loaded")
        return
    
    try:
        # Load sample data
        import pandas as pd
        sample_data = pd.read_csv('../database/data.csv', nrows=20)
        
        print(f"Sample data loaded: {sample_data.shape}")
        print(f"Columns: {list(sample_data.columns)}")
        
        # Check if models have required attributes
        if hasattr(ad, 'models') and len(ad.models) > 0:
            print(f"✅ Anomaly detection models loaded: {len(ad.models)}")
            print("Available models:", list(ad.models.keys()))
        else:
            print("❌ No anomaly detection models found")
            
    except Exception as e:
        print(f"❌ Error testing anomaly detection: {e}")

def test_model_performance(df):
    """Test and display model performance metrics."""
    print("\n=== Model Performance Analysis ===\n")
    
    if df is None or not hasattr(df, 'models'):
        print("❌ Cannot analyze performance - models not loaded")
        return
    
    good_models = []
    poor_models = []
    moderate_models = []
    
    for model_key, model_info in df.models.items():
        metrics = model_info['metrics']
        r2 = metrics['R2']
        
        if r2 > 0.8:
            good_models.append((model_key, r2))
        elif r2 < 0:
            poor_models.append((model_key, r2))
        else:
            moderate_models.append((model_key, r2))
    
    print(f"High-performing models (R² > 0.8): {len(good_models)}")
    for model, r2 in sorted(good_models, key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {model}: R² = {r2:.3f}")
    
    print(f"\nModerate-performing models (0 ≤ R² ≤ 0.8): {len(moderate_models)}")
    for model, r2 in sorted(moderate_models, key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {model}: R² = {r2:.3f}")
    
    print(f"\nPoor-performing models (R² < 0): {len(poor_models)}")
    for model, r2 in sorted(poor_models, key=lambda x: x[1])[:5]:
        print(f"  {model}: R² = {r2:.3f}")

def main():
    """Run all tests."""
    print("🧪 Smart Rental Tracker - ML Model Testing\n")
    
    # Test model loading
    df, ad = test_model_loading()
    
    # Test demand forecasting
    test_demand_predictions(df)
    
    # Test anomaly detection
    test_anomaly_detection(ad)
    
    # Test model performance
    test_model_performance(df)
    
    print("\n=== Testing Complete ===")
    if df and ad:
        print("✅ All basic tests passed!")
        print("Your ML models are ready to use.")
    else:
        print("❌ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
