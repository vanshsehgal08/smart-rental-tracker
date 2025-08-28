#!/usr/bin/env python3
"""
Test summary script for Smart Rental Tracker ML models.
Provides a quick overview of model status and test results.
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

def get_model_info():
    """Get information about trained models."""
    print("📊 Model Information")
    print("=" * 40)
    
    model_files = {
        'Demand Forecasting': 'demand_forecasting_models.pkl',
        'Anomaly Detection': 'anomaly_detection_models.pkl'
    }
    
    model_info = {}
    
    for model_type, filename in model_files.items():
        if os.path.exists(filename):
            size_mb = os.path.getsize(filename) / (1024 * 1024)
            mod_time = datetime.fromtimestamp(os.path.getmtime(filename))
            
            print(f"✅ {model_type}:")
            print(f"   File: {filename}")
            print(f"   Size: {size_mb:.1f} MB")
            print(f"   Last Modified: {mod_time.strftime('%Y-%m-%d %H:%M:%S')}")
            
            model_info[model_type] = {
                'exists': True,
                'size_mb': size_mb,
                'last_modified': mod_time
            }
        else:
            print(f"❌ {model_type}: File not found")
            model_info[model_type] = {'exists': False}
    
    return model_info

def get_data_info():
    """Get information about training data."""
    print("\n📁 Data Information")
    print("=" * 40)
    
    data_path = '../database/data.csv'
    
    if os.path.exists(data_path):
        size_mb = os.path.getsize(data_path) / (1024 * 1024)
        mod_time = datetime.fromtimestamp(os.path.getmtime(data_path))
        
        print(f"✅ Training Data:")
        print(f"   File: {data_path}")
        print(f"   Size: {size_mb:.1f} MB")
        print(f"   Last Modified: {mod_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Try to get row count
        try:
            import pandas as pd
            df = pd.read_csv(data_path)
            print(f"   Records: {len(df):,}")
            print(f"   Columns: {len(df.columns)}")
        except Exception as e:
            print(f"   Records: Unable to read ({e})")
        
        return True
    else:
        print(f"❌ Training Data: File not found at {data_path}")
        return False

def get_environment_info():
    """Get information about the Python environment."""
    print("\n🐍 Environment Information")
    print("=" * 40)
    
    try:
        import pandas as pd
        print(f"✅ pandas: {pd.__version__}")
    except ImportError:
        print("❌ pandas: Not installed")
    
    try:
        import numpy as np
        print(f"✅ numpy: {np.__version__}")
    except ImportError:
        print("❌ numpy: Not installed")
    
    try:
        import sklearn
        print(f"✅ scikit-learn: {sklearn.__version__}")
    except ImportError:
        print("❌ scikit-learn: Not installed")
    
    try:
        import joblib
        print(f"✅ joblib: {joblib.__version__}")
    except ImportError:
        print("❌ joblib: Not installed")
    
    print(f"✅ Python: {sys.version.split()[0]}")
    print(f"✅ Working Directory: {os.getcwd()}")

def get_test_files_info():
    """Get information about available test files."""
    print("\n🧪 Test Files Information")
    print("=" * 40)
    
    test_files = [
        'validate_models.py',
        'test_models.py',
        'comprehensive_test.py',
        'interactive_test.py',
        'run_tests.py',
        'test_summary.py'
    ]
    
    available_tests = []
    for test_file in test_files:
        if os.path.exists(test_file):
            print(f"✅ {test_file}")
            available_tests.append(test_file)
        else:
            print(f"❌ {test_file}")
    
    return available_tests

def generate_summary():
    """Generate overall summary."""
    print("\n" + "=" * 60)
    print("📋 OVERALL SUMMARY")
    print("=" * 60)
    
    # Collect information
    model_info = get_model_info()
    data_exists = get_data_info()
    get_environment_info()
    available_tests = get_test_files_info()
    
    # Summary statistics
    models_exist = sum(1 for info in model_info.values() if info.get('exists', False))
    total_models = len(model_info)
    
    print(f"\n📈 Summary Statistics:")
    print(f"   Models Available: {models_exist}/{total_models}")
    print(f"   Training Data: {'✅ Available' if data_exists else '❌ Missing'}")
    print(f"   Test Files: {len(available_tests)} available")
    
    # Recommendations
    print(f"\n🎯 Recommendations:")
    
    if models_exist == total_models and data_exists:
        print("  🎉 All models are available and ready for testing!")
        print("  🚀 Next step: Run 'python run_tests.py validation'")
    elif models_exist > 0:
        print("  ⚠️  Some models are available. Check missing models.")
        print("  🔍 Run 'python run_tests.py validation' to diagnose issues.")
    else:
        print("  ❌ No models found. You need to train models first.")
        print("  🚀 Run 'python train_models.py' to train models.")
    
    if len(available_tests) == 6:
        print("  ✅ All test files are available.")
    else:
        print("  ⚠️  Some test files are missing.")
    
    # Quick commands
    print(f"\n⚡ Quick Commands:")
    print(f"  python run_tests.py --info          # Show all test options")
    print(f"  python run_tests.py validation      # Basic validation")
    print(f"  python run_tests.py basic           # Basic testing")
    print(f"  python run_tests.py comprehensive   # Detailed testing")
    print(f"  python run_tests.py all             # Run all tests")

def main():
    """Main function."""
    print("🧪 Smart Rental Tracker - Test Summary")
    print("=" * 60)
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    generate_summary()
    
    print(f"\n{'='*60}")
    print("📋 Summary Complete!")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
