#!/usr/bin/env python3
"""
Comprehensive testing script for your ML models.
Tests all functionality in detail.
"""

import sys
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

class MLModelTester:
    """Comprehensive tester for ML models."""
    
    def __init__(self):
        self.df = None
        self.ad = None
        self.test_results = {}
        
    def test_model_loading(self):
        """Test model loading functionality."""
        print("🔍 Testing Model Loading...")
        
        try:
            from demand_forecaster import DemandForecaster
            from anomaly_detector import AnomalyDetector
            
            # Test demand forecasting
            self.df = DemandForecaster()
            self.df.load_models('demand_forecasting_models.pkl')
            
            # Test anomaly detection
            self.ad = AnomalyDetector()
            self.ad.load_models('anomaly_detection_models.pkl')
            
            print(f"✅ Demand Forecasting: {len(self.df.models)} models loaded")
            print(f"✅ Anomaly Detection: {len(self.ad.models)} models loaded")
            self.test_results['model_loading'] = 'PASS'
            
        except Exception as e:
            print(f"❌ Model loading failed: {e}")
            self.test_results['model_loading'] = 'FAIL'
            return False
        
        return True
    
    def test_demand_forecasting(self):
        """Test demand forecasting functionality."""
        print("\n🔍 Testing Demand Forecasting...")
        
        if not self.df:
            print("❌ Demand forecaster not loaded")
            self.test_results['demand_forecasting'] = 'FAIL'
            return False
        
        try:
            # Test basic predictions
            test_sites = ['SITE011', 'SITE006', 'SITE016']
            test_types = ['Excavator', 'Bulldozer', 'Crane']
            
            predictions_working = 0
            total_tests = 0
            
            for site in test_sites:
                for eq_type in test_types:
                    try:
                        predictions = self.df.predict_demand(site, eq_type, days_ahead=3)
                        if len(predictions) == 3 and all(isinstance(p, (int, np.integer)) for p in predictions):
                            predictions_working += 1
                        total_tests += 1
                    except:
                        total_tests += 1
            
            success_rate = predictions_working / total_tests if total_tests > 0 else 0
            print(f"✅ Predictions working: {predictions_working}/{total_tests} ({success_rate:.1%})")
            
            # Test specific predictions
            print("\nSample predictions:")
            for site in test_sites[:2]:
                for eq_type in test_types[:2]:
                    try:
                        preds = self.df.predict_demand(site, eq_type, days_ahead=5)
                        print(f"  {eq_type} at {site}: {preds}")
                    except Exception as e:
                        print(f"  ❌ {eq_type} at {site}: {e}")
            
            self.test_results['demand_forecasting'] = 'PASS' if success_rate > 0.8 else 'PARTIAL'
            return success_rate > 0.8
            
        except Exception as e:
            print(f"❌ Demand forecasting test failed: {e}")
            self.test_results['demand_forecasting'] = 'FAIL'
            return False
    
    def test_anomaly_detection(self):
        """Test anomaly detection functionality."""
        print("\n🔍 Testing Anomaly Detection...")
        
        if not self.ad:
            print("❌ Anomaly detector not loaded")
            self.test_results['anomaly_detection'] = 'FAIL'
            return False
        
        try:
            # Check model structure
            if hasattr(self.ad, 'models') and len(self.ad.models) > 0:
                print(f"✅ Models loaded: {len(self.ad.models)}")
                print(f"Model types: {list(self.ad.models.keys())}")
                
                # Check if models have required components
                for model_name, model_info in self.ad.models.items():
                    if 'model' in model_info and 'scaler' in model_info:
                        print(f"  ✅ {model_name}: Complete")
                    else:
                        print(f"  ⚠️  {model_name}: Missing components")
                
                self.test_results['anomaly_detection'] = 'PASS'
                return True
            else:
                print("❌ No anomaly detection models found")
                self.test_results['anomaly_detection'] = 'FAIL'
                return False
                
        except Exception as e:
            print(f"❌ Anomaly detection test failed: {e}")
            self.test_results['anomaly_detection'] = 'FAIL'
            return False
    
    def test_data_quality(self):
        """Test data quality and validation."""
        print("\n🔍 Testing Data Quality...")
        
        try:
            # Load data
            data_path = '../database/data.csv'
            if not os.path.exists(data_path):
                print(f"❌ Data file not found: {data_path}")
                self.test_results['data_quality'] = 'FAIL'
                return False
            
            df = pd.read_csv(data_path)
            print(f"✅ Data loaded: {df.shape}")
            
            # Check for missing values
            missing_counts = df.isnull().sum()
            missing_issues = missing_counts[missing_counts > 0]
            
            if len(missing_issues) == 0:
                print("✅ No missing values found")
            else:
                print("⚠️  Missing values found:")
                for col, count in missing_issues.items():
                    print(f"  {col}: {count} missing")
            
            # Check data ranges
            print("\nData ranges:")
            print(f"  Engine Hours/Day: {df['Engine Hours/Day'].min():.1f} to {df['Engine Hours/Day'].max():.1f}")
            print(f"  Idle Hours/Day: {df['Idle Hours/Day'].min():.1f} to {df['Idle Hours/Day'].max():.1f}")
            print(f"  Operating Days: {df['Operating Days'].min():.1f} to {df['Operating Days'].max():.1f}")
            
            # Check for impossible values
            impossible_engine = (df['Engine Hours/Day'] > 24).sum()
            impossible_idle = (df['Idle Hours/Day'] > 24).sum()
            impossible_total = ((df['Engine Hours/Day'] + df['Idle Hours/Day']) > 24).sum()
            
            if impossible_engine == 0 and impossible_idle == 0 and impossible_total == 0:
                print("✅ No impossible values found")
                self.test_results['data_quality'] = 'PASS'
            else:
                print("⚠️  Impossible values found:")
                print(f"  Engine hours > 24: {impossible_engine}")
                print(f"  Idle hours > 24: {impossible_idle}")
                print(f"  Total hours > 24: {impossible_total}")
                self.test_results['data_quality'] = 'PARTIAL'
            
            return True
            
        except Exception as e:
            print(f"❌ Data quality test failed: {e}")
            self.test_results['data_quality'] = 'FAIL'
            return False
    
    def test_model_performance(self):
        """Test and analyze model performance."""
        print("\n🔍 Testing Model Performance...")
        
        if not self.df:
            print("❌ Cannot test performance - models not loaded")
            self.test_results['model_performance'] = 'FAIL'
            return False
        
        try:
            # Analyze performance distribution
            r2_scores = []
            mae_scores = []
            
            for model_key, model_info in self.df.models.items():
                metrics = model_info['metrics']
                r2_scores.append(metrics['R2'])
                mae_scores.append(metrics['MAE'])
            
            r2_scores = np.array(r2_scores)
            mae_scores = np.array(mae_scores)
            
            print("Performance Statistics:")
            print(f"  R² Scores:")
            print(f"    Mean: {r2_scores.mean():.3f}")
            print(f"    Median: {np.median(r2_scores):.3f}")
            print(f"    Min: {r2_scores.min():.3f}")
            print(f"    Max: {r2_scores.max():.3f}")
            print(f"    Std: {r2_scores.std():.3f}")
            
            print(f"  MAE Scores:")
            print(f"    Mean: {mae_scores.mean():.3f}")
            print(f"    Median: {np.median(mae_scores):.3f}")
            print(f"    Min: {mae_scores.min():.3f}")
            print(f"    Max: {mae_scores.max():.3f}")
            
            # Performance categories
            excellent = (r2_scores > 0.9).sum()
            good = ((r2_scores > 0.7) & (r2_scores <= 0.9)).sum()
            moderate = ((r2_scores > 0.5) & (r2_scores <= 0.7)).sum()
            poor = ((r2_scores > 0) & (r2_scores <= 0.5)).sum()
            very_poor = (r2_scores <= 0).sum()
            
            print(f"\nPerformance Distribution:")
            print(f"  Excellent (R² > 0.9): {excellent} models")
            print(f"  Good (0.7 < R² ≤ 0.9): {good} models")
            print(f"  Moderate (0.5 < R² ≤ 0.7): {moderate} models")
            print(f"  Poor (0 < R² ≤ 0.5): {poor} models")
            print(f"  Very Poor (R² ≤ 0): {very_poor} models")
            
            # Overall assessment
            if excellent + good > len(r2_scores) * 0.7:
                performance_rating = 'EXCELLENT'
            elif excellent + good > len(r2_scores) * 0.5:
                performance_rating = 'GOOD'
            elif excellent + good > len(r2_scores) * 0.3:
                performance_rating = 'MODERATE'
            else:
                performance_rating = 'POOR'
            
            print(f"\nOverall Performance Rating: {performance_rating}")
            
            self.test_results['model_performance'] = 'PASS'
            return True
            
        except Exception as e:
            print(f"❌ Performance test failed: {e}")
            self.test_results['model_performance'] = 'FAIL'
            return False
    
    def run_all_tests(self):
        """Run all tests and generate report."""
        print("🚀 Starting Comprehensive ML Model Testing\n")
        print("=" * 60)
        
        # Run all tests
        tests = [
            ("Model Loading", self.test_model_loading),
            ("Data Quality", self.test_data_quality),
            ("Demand Forecasting", self.test_demand_forecasting),
            ("Anomaly Detection", self.test_anomaly_detection),
            ("Model Performance", self.test_model_performance)
        ]
        
        for test_name, test_func in tests:
            try:
                test_func()
            except Exception as e:
                print(f"❌ {test_name} test crashed: {e}")
                self.test_results[test_name.lower().replace(' ', '_')] = 'CRASH'
        
        # Generate summary report
        self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report."""
        print("\n" + "=" * 60)
        print("📊 COMPREHENSIVE TEST REPORT")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result == 'PASS')
        partial_tests = sum(1 for result in self.test_results.values() if result == 'PARTIAL')
        failed_tests = sum(1 for result in self.test_results.values() if result in ['FAIL', 'CRASH'])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"⚠️  Partial: {partial_tests}")
        print(f"❌ Failed: {failed_tests}")
        
        print(f"\nSuccess Rate: {(passed_tests + partial_tests) / total_tests:.1%}")
        
        print(f"\nDetailed Results:")
        for test_name, result in self.test_results.items():
            status_icon = "✅" if result == "PASS" else "⚠️" if result == "PARTIAL" else "❌"
            print(f"  {status_icon} {test_name.replace('_', ' ').title()}: {result}")
        
        # Recommendations
        print(f"\n🎯 Recommendations:")
        if failed_tests == 0:
            print("  🎉 All tests passed! Your ML system is ready for production.")
        elif passed_tests > failed_tests:
            print("  🎯 Most tests passed. Review failed tests and address issues.")
        else:
            print("  ⚠️  Multiple tests failed. Review system setup and dependencies.")
        
        if 'model_performance' in self.test_results and self.test_results['model_performance'] == 'PASS':
            print("  📈 Model performance looks good. Consider fine-tuning for better results.")
        
        print("\n" + "=" * 60)

def main():
    """Main function to run comprehensive testing."""
    tester = MLModelTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
