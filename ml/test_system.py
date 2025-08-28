#!/usr/bin/env python3
"""
Test script for the Smart Rental Tracker ML system.

This script verifies that all components can be imported and basic functionality works.
"""

import sys
import os
from pathlib import Path

def test_imports():
    """Test that all required modules can be imported."""
    print("Testing imports...")
    
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

def test_ml_modules():
    """Test that our ML modules can be imported."""
    print("\nTesting ML module imports...")
    
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

def test_data_access():
    """Test that we can access the data file."""
    print("\nTesting data access...")
    
    data_path = '../database/data.csv'
    if os.path.exists(data_path):
        print(f"✅ Data file found: {data_path}")
        
        # Try to read a small sample
        try:
            import pandas as pd
            df = pd.read_csv(data_path, nrows=5)
            print(f"✅ Data file readable, sample shape: {df.shape}")
            print(f"✅ Sample columns: {list(df.columns)}")
            return True
        except Exception as e:
            print(f"❌ Data file read failed: {e}")
            return False
    else:
        print(f"❌ Data file not found: {data_path}")
        return False

def test_basic_functionality():
    """Test basic functionality of the ML classes."""
    print("\nTesting basic functionality...")
    
    try:
        from demand_forecaster import DemandForecaster
        from anomaly_detector import AnomalyDetector
        
        # Test DemandForecaster initialization
        forecaster = DemandForecaster('../database/data.csv')
        print("✅ DemandForecaster initialized successfully")
        
        # Test AnomalyDetector initialization
        detector = AnomalyDetector('../database/data.csv')
        print("✅ AnomalyDetector initialized successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic functionality test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("=== Smart Rental Tracker ML System Test ===\n")
    
    tests = [
        ("Import Dependencies", test_imports),
        ("Import ML Modules", test_ml_modules),
        ("Data Access", test_data_access),
        ("Basic Functionality", test_basic_functionality)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"Running: {test_name}")
        if test_func():
            passed += 1
        print()
    
    print("=== Test Results ===")
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! The ML system is ready to use.")
        print("\nNext steps:")
        print("1. Run: python train_models.py")
        print("2. Or run individual components:")
        print("   - python demand_forecaster.py")
        print("   - python anomaly_detector.py")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
