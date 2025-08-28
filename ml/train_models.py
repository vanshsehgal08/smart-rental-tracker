#!/usr/bin/env python3
"""
Comprehensive training script for Smart Rental Tracker ML models.

This script trains both:
1. Demand Forecasting models
2. Anomaly Detection models

Usage:
    python train_models.py
"""

import os
import sys
import time
import logging
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

# Import our ML modules
from ml.demand_forecaster import DemandForecaster
from ml.anomaly_detector import AnomalyDetector

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ml_training.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class MLModelTrainer:
    """
    Orchestrates the training of all ML models for the Smart Rental Tracker.
    """
    
    def __init__(self, data_path='../database/data.csv'):
        """
        Initialize the ML model trainer.
        
        Args:
            data_path (str): Path to the rental data CSV file
        """
        self.data_path = data_path
        self.training_results = {}
        self.start_time = None
        
        # Verify data file exists
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Data file not found: {data_path}")
        
        logger.info(f"Initialized ML Model Trainer with data path: {data_path}")
    
    def train_demand_forecasting(self):
        """
        Train demand forecasting models.
        
        Returns:
            dict: Training results and metrics
        """
        logger.info("Starting Demand Forecasting training...")
        
        try:
            # Initialize forecaster
            forecaster = DemandForecaster(self.data_path)
            
            # Load and transform data
            logger.info("Loading and transforming rental data...")
            ts_data = forecaster.load_and_transform_data()
            
            # Engineer features
            logger.info("Engineering features for time series forecasting...")
            ts_data_features = forecaster.engineer_features(ts_data)
            
            # Train models
            logger.info("Training demand forecasting models...")
            forecaster.train_all_models(ts_data_features)
            
            # Save models
            model_file = 'demand_forecasting_models.pkl'
            forecaster.save_models(model_file)
            
            # Collect results
            results = {
                'status': 'success',
                'models_trained': len(forecaster.models),
                'model_file': model_file,
                'feature_columns': forecaster.feature_columns.copy(),
                'model_metrics': {}
            }
            
            # Collect individual model metrics
            for model_key, model_info in forecaster.models.items():
                results['model_metrics'][model_key] = model_info['metrics']
            
            logger.info(f"Demand forecasting training completed successfully. {len(forecaster.models)} models trained.")
            return results
            
        except Exception as e:
            logger.error(f"Error in demand forecasting training: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'models_trained': 0
            }
    
    def train_anomaly_detection(self):
        """
        Train anomaly detection models.
        
        Returns:
            dict: Training results and metrics
        """
        logger.info("Starting Anomaly Detection training...")
        
        try:
            # Initialize detector
            detector = AnomalyDetector(self.data_path)
            
            # Load data
            logger.info("Loading rental data for anomaly detection...")
            df = detector.load_data()
            
            # Engineer features
            logger.info("Engineering features for anomaly detection...")
            df_features = detector.engineer_features(df)
            
            # Calculate statistical thresholds
            logger.info("Calculating statistical thresholds...")
            detector.calculate_statistical_thresholds(df_features)
            
            # Train ML models
            logger.info("Training anomaly detection models...")
            detector.train_all_models(df_features)
            
            # Run complete analysis
            logger.info("Running complete anomaly analysis...")
            df_analysis = detector.run_complete_analysis(df_features)
            
            # Save models
            model_file = 'anomaly_detection_models.pkl'
            detector.save_models(model_file)
            
            # Collect results
            results = {
                'status': 'success',
                'models_trained': len(detector.models),
                'model_file': model_file,
                'feature_columns': detector.feature_columns.copy(),
                'statistical_anomalies': df_analysis['is_anomaly'].sum(),
                'ml_consensus_anomalies': df_analysis['is_consensus_anomaly'].sum(),
                'total_records': len(df_analysis),
                'anomaly_rate': (df_analysis['is_consensus_anomaly'].sum() / len(df_analysis)) * 100
            }
            
            logger.info(f"Anomaly detection training completed successfully. {len(detector.models)} models trained.")
            return results
            
        except Exception as e:
            logger.error(f"Error in anomaly detection training: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'models_trained': 0
            }
    
    def run_complete_training(self):
        """
        Run complete training pipeline for all ML models.
        
        Returns:
            dict: Complete training results
        """
        logger.info("=== Starting Complete ML Model Training ===")
        self.start_time = time.time()
        
        # Train demand forecasting
        logger.info("Phase 1: Training Demand Forecasting Models")
        demand_results = self.train_demand_forecasting()
        self.training_results['demand_forecasting'] = demand_results
        
        # Train anomaly detection
        logger.info("Phase 2: Training Anomaly Detection Models")
        anomaly_results = self.train_anomaly_detection()
        self.training_results['anomaly_detection'] = anomaly_results
        
        # Calculate overall results
        total_time = time.time() - self.start_time
        total_models = (
            demand_results.get('models_trained', 0) + 
            anomaly_results.get('models_trained', 0)
        )
        
        overall_results = {
            'total_training_time': total_time,
            'total_models_trained': total_models,
            'demand_forecasting': demand_results,
            'anomaly_detection': anomaly_results,
            'overall_status': 'success' if all(
                r.get('status') == 'success' for r in [demand_results, anomaly_results]
            ) else 'partial_success'
        }
        
        self.training_results['overall'] = overall_results
        
        # Log summary
        logger.info("=== Training Summary ===")
        logger.info(f"Total training time: {total_time:.2f} seconds")
        logger.info(f"Total models trained: {total_models}")
        logger.info(f"Overall status: {overall_results['overall_status']}")
        
        return overall_results
    
    def save_training_report(self, filename='training_report.txt'):
        """
        Save a detailed training report to file.
        
        Args:
            filename (str): Name of the report file
        """
        logger.info(f"Saving training report to {filename}...")
        
        with open(filename, 'w') as f:
            f.write("=== Smart Rental Tracker - ML Training Report ===\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Data source: {self.data_path}\n\n")
            
            # Overall results
            if 'overall' in self.training_results:
                overall = self.training_results['overall']
                f.write(f"Overall Status: {overall['overall_status']}\n")
                f.write(f"Total Training Time: {overall['total_training_time']:.2f} seconds\n")
                f.write(f"Total Models Trained: {overall['total_models_trained']}\n\n")
            
            # Demand forecasting results
            if 'demand_forecasting' in self.training_results:
                demand = self.training_results['demand_forecasting']
                f.write("=== Demand Forecasting Results ===\n")
                f.write(f"Status: {demand['status']}\n")
                f.write(f"Models Trained: {demand['models_trained']}\n")
                f.write(f"Model File: {demand.get('model_file', 'N/A')}\n")
                
                if demand['status'] == 'success' and 'model_metrics' in demand:
                    f.write("\nModel Performance:\n")
                    for model_key, metrics in demand['model_metrics'].items():
                        f.write(f"  {model_key}:\n")
                        f.write(f"    R² Score: {metrics.get('R2', 'N/A'):.3f}\n")
                        f.write(f"    MAE: {metrics.get('MAE', 'N/A'):.2f}\n")
                        f.write(f"    RMSE: {metrics.get('RMSE', 'N/A'):.2f}\n")
                
                f.write("\n")
            
            # Anomaly detection results
            if 'anomaly_detection' in self.training_results:
                anomaly = self.training_results['anomaly_detection']
                f.write("=== Anomaly Detection Results ===\n")
                f.write(f"Status: {anomaly['status']}\n")
                f.write(f"Models Trained: {anomaly['models_trained']}\n")
                f.write(f"Model File: {anomaly.get('model_file', 'N/A')}\n")
                
                if anomaly['status'] == 'success':
                    f.write(f"Total Records Analyzed: {anomaly.get('total_records', 'N/A')}\n")
                    f.write(f"Statistical Anomalies: {anomaly.get('statistical_anomalies', 'N/A')}\n")
                    f.write(f"ML Consensus Anomalies: {anomaly.get('ml_consensus_anomalies', 'N/A')}\n")
                    f.write(f"Anomaly Rate: {anomaly.get('anomaly_rate', 'N/A'):.2f}%\n")
                
                f.write("\n")
            
            # Error details if any
            if any(r.get('status') == 'error' for r in self.training_results.values()):
                f.write("=== Errors ===\n")
                for system, results in self.training_results.items():
                    if results.get('status') == 'error':
                        f.write(f"{system.title()}: {results.get('error', 'Unknown error')}\n")
        
        logger.info(f"Training report saved to {filename}")

def main():
    """
    Main function to run the complete ML training pipeline.
    """
    try:
        # Initialize trainer
        trainer = MLModelTrainer()
        
        # Run complete training
        results = trainer.run_complete_training()
        
        # Save training report
        trainer.save_training_report()
        
        # Print summary
        print("\n" + "="*60)
        print("ML MODEL TRAINING COMPLETED")
        print("="*60)
        print(f"Status: {results['overall_status']}")
        print(f"Total Models Trained: {results['total_models_trained']}")
        print(f"Training Time: {results['total_training_time']:.2f} seconds")
        print(f"Demand Forecasting: {results['demand_forecasting']['status']}")
        print(f"Anomaly Detection: {results['anomaly_detection']['status']}")
        print("="*60)
        
        if results['overall_status'] == 'success':
            print("✅ All models trained successfully!")
        else:
            print("⚠️  Some models failed to train. Check the logs for details.")
        
        return 0
        
    except Exception as e:
        logger.error(f"Critical error in training pipeline: {e}")
        print(f"❌ Training failed: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
