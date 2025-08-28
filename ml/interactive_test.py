#!/usr/bin/env python3
"""
Interactive testing script for your ML models.
Run this to test models step by step.
"""

import sys
import os
from pathlib import Path

def interactive_test():
    """Interactive testing session."""
    print("🎯 Interactive ML Model Testing")
    print("=" * 40)
    
    # Test 1: Load models
    print("\n1️⃣ Testing Model Loading...")
    try:
        from demand_forecaster import DemandForecaster
        from anomaly_detector import AnomalyDetector
        
        df = DemandForecaster()
        df.load_models('demand_forecasting_models.pkl')
        print(f"✅ Demand Forecasting: {len(df.models)} models loaded")
        
        ad = AnomalyDetector()
        ad.load_models('anomaly_detection_models.pkl')
        print(f"✅ Anomaly Detection: {len(ad.models)} models loaded")
        
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        return
    
    # Test 2: Demand predictions
    print("\n2️⃣ Testing Demand Predictions...")
    while True:
        site = input("Enter Site ID (or 'skip' to skip): ").strip()
        if site.lower() == 'skip':
            break
        
        eq_type = input("Enter Equipment Type (or 'skip' to skip): ").strip()
        if eq_type.lower() == 'skip':
            break
        
        try:
            predictions = df.predict_demand(site, eq_type, days_ahead=7)
            print(f"\n📊 Predictions for {eq_type} at {site}:")
            for i, pred in enumerate(predictions, 1):
                print(f"  Day {i}: {pred} units")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        continue_test = input("\nTest another prediction? (y/n): ").strip().lower()
        if continue_test != 'y':
            break
    
    # Test 3: Model performance
    print("\n3️⃣ Testing Model Performance...")
    try:
        # Show some performance metrics
        print("Top 5 performing models:")
        performance_data = []
        for model_key, model_info in df.models.items():
            metrics = model_info['metrics']
            performance_data.append((model_key, metrics['R2'], metrics['MAE']))
        
        # Sort by R² score
        performance_data.sort(key=lambda x: x[1], reverse=True)
        
        for i, (model, r2, mae) in enumerate(performance_data[:5], 1):
            print(f"  {i}. {model}: R² = {r2:.3f}, MAE = {mae:.2f}")
            
    except Exception as e:
        print(f"❌ Error showing performance: {e}")
    
    # Test 4: Anomaly detection info
    print("\n4️⃣ Anomaly Detection Info...")
    try:
        print(f"Anomaly detection models loaded: {len(ad.models)}")
        print("Available models:", list(ad.models.keys()))
        
        # Show sample data info
        import pandas as pd
        sample_data = pd.read_csv('../database/data.csv', nrows=5)
        print(f"\nSample data shape: {sample_data.shape}")
        print("Columns:", list(sample_data.columns))
        
    except Exception as e:
        print(f"❌ Error showing anomaly detection info: {e}")
    
    print("\n🎉 Interactive testing complete!")

if __name__ == "__main__":
    interactive_test()
