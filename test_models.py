#!/usr/bin/env python3
"""
Test script to verify ML models are loading correctly
Run this from the project root directory
"""

import sys
import os

# Add the ml directory to the path
ml_path = os.path.join(os.path.dirname(__file__), 'ml')
sys.path.append(ml_path)

try:
    from smart_ml_system import SmartMLSystem
    
    print("🚀 Testing ML System with Saved Models...")
    print("=" * 50)
    
    # Create ML system (should load saved models)
    ml_system = SmartMLSystem()
    
    # Check model status
    status = ml_system.get_model_status()
    print("\n📊 Model Status:")
    print(f"   • Models Trained: {status['models_trained']}")
    print(f"   • Data Loaded: {status['data_loaded']}")
    print(f"   • Data Records: {status['data_records']}")
    print(f"   • Saved Models Exist: {status['saved_models_exist']}")
    print(f"   • Total Saved Models: {status.get('total_saved_models', 0)}")
    print(f"   • Models Directory: {status['models_directory']}")
    
    if status.get('saved_model_files'):
        print(f"   • Saved Model Files: {', '.join(status['saved_model_files'])}")
    
    if ml_system.models_trained:
        print("\n✅ Models are ready!")
        
        # Test anomaly detection
        print("\n🔍 Testing Anomaly Detection...")
        anomalies = ml_system.detect_anomalies()
        if 'error' not in anomalies:
            print(f"   • Found {anomalies['summary']['total_anomalies']} anomalies")
            print(f"   • Total records analyzed: {anomalies['summary']['total_records']}")
        else:
            print(f"   • Error: {anomalies['error']}")
        
        # Test demand forecasting
        print("\n📈 Testing Demand Forecasting...")
        forecast = ml_system.forecast_demand(equipment_type="Excavator", days_ahead=7)
        if 'error' not in forecast:
            print(f"   • Forecast for Excavator: {forecast['total_predicted_demand']} units over 7 days")
            print(f"   • Trend: {forecast['trend']}")
        else:
            print(f"   • Error: {forecast['error']}")
        
        # Test equipment stats
        print("\n⚙️ Testing Equipment Statistics...")
        stats = ml_system.get_equipment_stats()
        if 'error' not in stats:
            print(f"   • Total Equipment: {stats['overall']['total_equipment']}")
            print(f"   • Average Utilization: {stats['overall']['average_utilization']}%")
        else:
            print(f"   • Error: {stats['error']}")
            
    else:
        print("\n❌ Models are not ready!")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
