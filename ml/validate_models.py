#!/usr/bin/env python3
"""
Simple validation script to check if your trained ML models are working.
Quick and easy validation without detailed analysis.
"""

import os
import sys
from pathlib import Path

def check_model_files():
    """Check if model files exist and have reasonable sizes."""
    print("🔍 Checking Model Files...")
    
    model_files = [
        'demand_forecasting_models.pkl',
        'anomaly_detection_models.pkl'
    ]
    
    all_exist = True
    for model_file in model_files:
        if os.path.exists(model_file):
            size_mb = os.path.getsize(model_file) / (1024 * 1024)
            print(f"✅ {model_file}: {size_mb:.1f} MB")
            
            # Check if file is too small (might be corrupted)
            if size_mb < 0.1:  # Less than 100 KB
                print(f"⚠️  Warning: {model_file} seems very small")
                all_exist = False
        else:
            print(f"❌ {model_file}: Not found")
            all_exist = False
    
    return all_exist

def check_imports():
    """Check if required modules can be imported."""
    print("\n🔍 Checking Module Imports...")
    
    try:
        import pandas as pd
        print("✅ pandas imported successfully")
    except ImportError as e:
        print(f"❌ pandas import failed: {e}")
        return False
    
    try:
        import numpy as np
        print("✅ numpy imported successfully")
    except ImportError as e:
        print(f"❌ numpy import failed: {e}")
        return False
    
    try:
        import sklearn
        print("✅ scikit-learn imported successfully")
    except ImportError as e:
        print(f"❌ scikit-learn import failed: {e}")
        return False
    
    try:
        import joblib
        print("✅ joblib imported successfully")
    except ImportError as e:
        print(f"❌ joblib import failed: {e}")
        return False
    
    return True

def check_ml_modules():
    """Check if ML modules can be imported."""
    print("\n🔍 Checking ML Module Imports...")
    
    try:
        from demand_forecaster import DemandForecaster
        print("✅ DemandForecaster imported successfully")
    except ImportError as e:
        print(f"❌ DemandForecaster import failed: {e}")
        return False
    
    try:
        from anomaly_detector import AnomalyDetector
        print("✅ AnomalyDetector imported successfully")
    except ImportError as e:
        print(f"❌ AnomalyDetector import failed: {e}")
        return False
    
    return True

def quick_model_test():
    """Quick test of model loading."""
    print("\n🔍 Quick Model Loading Test...")
    
    try:
        from demand_forecaster import DemandForecaster
        from anomaly_detector import AnomalyDetector
        
        # Test demand forecasting
        df = DemandForecaster()
        df.load_models('demand_forecasting_models.pkl')
        print(f"✅ Demand Forecasting: {len(df.models)} models loaded")
        
        # Test anomaly detection
        ad = AnomalyDetector()
        ad.load_models('anomaly_detection_models.pkl')
        print(f"✅ Anomaly Detection: {len(ad.models)} models loaded")
        
        return True
        
    except Exception as e:
        print(f"❌ Model loading test failed: {e}")
        return False

def main():
    """Run all validation checks."""
    print("🧪 Smart Rental Tracker - Model Validation\n")
    print("=" * 50)
    
    # Run all checks
    checks = [
        ("Model Files", check_model_files),
        ("Module Imports", check_imports),
        ("ML Modules", check_ml_modules),
        ("Model Loading", quick_model_test)
    ]
    
    passed = 0
    total = len(checks)
    
    for check_name, check_func in checks:
        print(f"\n--- {check_name} ---")
        if check_func():
            passed += 1
            print(f"✅ {check_name} check passed")
        else:
            print(f"❌ {check_name} check failed")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 VALIDATION SUMMARY")
    print("=" * 50)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All validation checks passed!")
        print("Your ML models are ready to use.")
        print("\nNext steps:")
        print("1. Run: python test_models.py (for basic testing)")
        print("2. Run: python comprehensive_test.py (for detailed testing)")
        print("3. Run: python interactive_test.py (for interactive testing)")
    elif passed >= total * 0.75:
        print("⚠️  Most validation checks passed.")
        print("Review failed checks before proceeding.")
    else:
        print("❌ Multiple validation checks failed.")
        print("Please fix the issues before proceeding.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
