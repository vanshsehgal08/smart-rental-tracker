import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
import joblib
import warnings
warnings.filterwarnings('ignore')

class AnomalyDetector:
    """
    Anomaly detection system for rental equipment usage.
    
    This class handles:
    1. Data preprocessing and feature engineering
    2. Multiple anomaly detection algorithms
    3. Threshold-based detection
    4. Model training and prediction
    5. Model persistence and loading
    """
    
    def __init__(self, data_path='../database/data.csv'):
        """
        Initialize the anomaly detector.
        
        Args:
            data_path (str): Path to the rental data CSV file
        """
        self.data_path = data_path
        self.models = {}
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.thresholds = {}
        
    def load_data(self):
        """
        Load rental data from CSV.
        
        Returns:
            pd.DataFrame: Loaded rental data
        """
        print("Loading rental data...")
        df = pd.read_csv(self.data_path)
        
        # Convert date columns to datetime
        df['Expected Check-Out Date'] = pd.to_datetime(df['Expected Check-Out Date'])
        df['Check-In Date'] = pd.to_datetime(df['Check-In Date'])
        
        print(f"Loaded {len(df)} rental records")
        print(f"Date range: {df['Expected Check-Out Date'].min()} to {df['Check-In Date'].max()}")
        print(f"Unique equipment: {df['Equipment ID'].nunique()}")
        print(f"Unique sites: {df['Site ID'].nunique()}")
        
        return df
    
    def engineer_features(self, df):
        """
        Engineer features for anomaly detection.
        
        Args:
            df (pd.DataFrame): Raw rental data
            
        Returns:
            pd.DataFrame: Data with engineered features
        """
        print("Engineering features for anomaly detection...")
        
        # Create a copy to avoid modifying original
        df_features = df.copy()
        
        # Calculate total hours per day
        df_features['Total_Hours'] = df_features['Engine Hours/Day'] + df_features['Idle Hours/Day']
        
        # Calculate idle ratio (percentage of time equipment is idle)
        df_features['Idle_Ratio'] = df_features['Idle Hours/Day'] / (df_features['Total_Hours'] + 1e-8)
        
        # Calculate utilization efficiency (engine hours vs total hours)
        df_features['Utilization_Efficiency'] = df_features['Engine Hours/Day'] / (df_features['Total_Hours'] + 1e-8)
        
        # Calculate operating days ratio (how many days equipment was actually used)
        df_features['Operating_Days_Ratio'] = df_features['Operating Days'] / 365  # Assuming 1 year period
        
        # Create binary features for unusual patterns
        df_features['Zero_Engine_Hours'] = (df_features['Engine Hours/Day'] == 0).astype(int)
        df_features['High_Idle_Ratio'] = (df_features['Idle_Ratio'] > 0.8).astype(int)
        df_features['Very_Low_Utilization'] = (df_features['Utilization_Efficiency'] < 0.2).astype(int)
        
        # Calculate rental duration
        df_features['Rental_Duration'] = (df_features['Check-In Date'] - df_features['Expected Check-Out Date']).dt.days
        
        # Normalize rental duration (0-1 scale)
        max_duration = df_features['Rental_Duration'].max()
        df_features['Normalized_Duration'] = df_features['Rental_Duration'] / max_duration if max_duration > 0 else 0
        
        # Define feature columns for anomaly detection
        self.feature_columns = [
            'Engine Hours/Day', 'Idle Hours/Day', 'Total_Hours',
            'Idle_Ratio', 'Utilization_Efficiency', 'Operating_Days_Ratio',
            'Zero_Engine_Hours', 'High_Idle_Ratio', 'Very_Low_Utilization',
            'Normalized_Duration'
        ]
        
        print(f"Engineered {len(self.feature_columns)} features")
        return df_features
    
    def calculate_statistical_thresholds(self, df_features):
        """
        Calculate statistical thresholds for anomaly detection.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
        """
        print("Calculating statistical thresholds...")
        
        for feature in self.feature_columns:
            if feature in df_features.columns:
                values = df_features[feature].dropna()
                if len(values) > 0:
                    mean_val = values.mean()
                    std_val = values.std()
                    
                    # Store thresholds for 2 and 3 standard deviations
                    self.thresholds[feature] = {
                        'mean': mean_val,
                        'std': std_val,
                        'threshold_2std': mean_val + 2 * std_val,
                        'threshold_minus_2std': mean_val - 2 * std_val,
                        'threshold_3std': mean_val + 3 * std_val,
                        'threshold_minus_3std': mean_val - 3 * std_val
                    }
        
        print(f"Calculated thresholds for {len(self.thresholds)} features")
    
    def detect_statistical_anomalies(self, df_features, threshold_std=2):
        """
        Detect anomalies using statistical thresholds.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            threshold_std (int): Number of standard deviations for threshold (2 or 3)
            
        Returns:
            pd.DataFrame: Data with anomaly flags
        """
        print(f"Detecting statistical anomalies (threshold: {threshold_std} std)...")
        
        df_anomalies = df_features.copy()
        anomaly_flags = []
        
        for idx, row in df_anomalies.iterrows():
            anomaly_score = 0
            anomaly_reasons = []
            
            for feature in self.feature_columns:
                if feature in self.thresholds and feature in row:
                    value = row[feature]
                    if pd.notna(value):
                        thresholds = self.thresholds[feature]
                        
                        if threshold_std == 2:
                            upper_thresh = thresholds['threshold_2std']
                            lower_thresh = thresholds['threshold_minus_2std']
                        else:
                            upper_thresh = thresholds['threshold_3std']
                            lower_thresh = thresholds['threshold_minus_3std']
                        
                        if value > upper_thresh or value < lower_thresh:
                            anomaly_score += 1
                            anomaly_reasons.append(f"{feature}: {value:.2f} (normal: {thresholds['mean']:.2f}±{thresholds['std']:.2f})")
            
            anomaly_flags.append({
                'anomaly_score': anomaly_score,
                'is_anomaly': anomaly_score > 0,
                'anomaly_reasons': '; '.join(anomaly_reasons) if anomaly_reasons else 'None'
            })
        
        # Add anomaly information to DataFrame
        anomaly_df = pd.DataFrame(anomaly_flags)
        df_anomalies = pd.concat([df_anomalies, anomaly_df], axis=1)
        
        anomaly_count = df_anomalies['is_anomaly'].sum()
        print(f"Detected {anomaly_count} statistical anomalies out of {len(df_anomalies)} records")
        
        return df_anomalies
    
    def train_isolation_forest(self, df_features, contamination=0.1):
        """
        Train Isolation Forest model for anomaly detection.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            contamination (float): Expected proportion of anomalies
            
        Returns:
            IsolationForest: Trained model
        """
        print(f"Training Isolation Forest (contamination: {contamination})...")
        
        # Prepare features
        X = df_features[self.feature_columns].fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )
        model.fit(X_scaled)
        
        return model, X_scaled
    
    def train_local_outlier_factor(self, df_features, contamination=0.1):
        """
        Train Local Outlier Factor model for anomaly detection.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            contamination (float): Expected proportion of anomalies
            
        Returns:
            LocalOutlierFactor: Trained model
        """
        print(f"Training Local Outlier Factor (contamination: {contamination})...")
        
        # Prepare features
        X = df_features[self.feature_columns].fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        model = LocalOutlierFactor(
            contamination=contamination,
            n_neighbors=20,
            novelty=False
        )
        model.fit(X_scaled)
        
        return model, X_scaled
    
    def train_dbscan(self, df_features, eps=0.5, min_samples=5):
        """
        Train DBSCAN clustering model for anomaly detection.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            eps (float): Maximum distance between points to be considered neighbors
            min_samples (int): Minimum number of points to form a cluster
            
        Returns:
            DBSCAN: Trained model
        """
        print(f"Training DBSCAN (eps: {eps}, min_samples: {min_samples})...")
        
        # Prepare features
        X = df_features[self.feature_columns].fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        model = DBSCAN(eps=eps, min_samples=min_samples)
        model.fit(X_scaled)
        
        return model, X_scaled
    
    def detect_ml_anomalies(self, df_features, model, X_scaled, model_name):
        """
        Detect anomalies using trained ML model.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            model: Trained ML model
            X_scaled (np.array): Scaled features
            model_name (str): Name of the model
            
        Returns:
            pd.DataFrame: Data with ML anomaly detection results
        """
        print(f"Detecting anomalies using {model_name}...")
        
        df_ml_anomalies = df_features.copy()
        
        if model_name == 'isolation_forest':
            # Isolation Forest: -1 for anomalies, 1 for normal points
            predictions = model.predict(X_scaled)
            anomaly_scores = model.score_samples(X_scaled)
            
            df_ml_anomalies[f'{model_name}_prediction'] = predictions
            df_ml_anomalies[f'{model_name}_score'] = anomaly_scores
            df_ml_anomalies[f'{model_name}_is_anomaly'] = (predictions == -1)
            
        elif model_name == 'local_outlier_factor':
            # Local Outlier Factor: -1 for anomalies, 1 for normal points
            predictions = model.fit_predict(X_scaled)
            anomaly_scores = model.negative_outlier_factor_
            
            df_ml_anomalies[f'{model_name}_prediction'] = predictions
            df_ml_anomalies[f'{model_name}_score'] = anomaly_scores
            df_ml_anomalies[f'{model_name}_is_anomaly'] = (predictions == -1)
            
        elif model_name == 'dbscan':
            # DBSCAN: -1 for noise points (anomalies), cluster labels for normal points
            predictions = model.labels_
            
            df_ml_anomalies[f'{model_name}_prediction'] = predictions
            df_ml_anomalies[f'{model_name}_is_anomaly'] = (predictions == -1)
        
        anomaly_count = df_ml_anomalies[f'{model_name}_is_anomaly'].sum()
        print(f"{model_name}: Detected {anomaly_count} anomalies out of {len(df_ml_anomalies)} records")
        
        return df_ml_anomalies
    
    def train_all_models(self, df_features):
        """
        Train all anomaly detection models.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
        """
        print("Training all anomaly detection models...")
        
        # Train Isolation Forest
        if_model, X_scaled_if = self.train_isolation_forest(df_features, contamination=0.1)
        self.models['isolation_forest'] = {
            'model': if_model,
            'scaler': self.scaler,
            'X_scaled': X_scaled_if
        }
        
        # Train Local Outlier Factor
        lof_model, X_scaled_lof = self.train_local_outlier_factor(df_features, contamination=0.1)
        self.models['local_outlier_factor'] = {
            'model': lof_model,
            'scaler': self.scaler,
            'X_scaled': X_scaled_lof
        }
        
        # Train DBSCAN
        dbscan_model, X_scaled_dbscan = self.train_dbscan(df_features, eps=0.5, min_samples=5)
        self.models['dbscan'] = {
            'model': dbscan_model,
            'scaler': self.scaler,
            'X_scaled': X_scaled_dbscan
        }
        
        print("All models trained successfully!")
    
    def run_complete_analysis(self, df_features):
        """
        Run complete anomaly analysis using all methods.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            
        Returns:
            pd.DataFrame: Complete analysis results
        """
        print("Running complete anomaly analysis...")
        
        # Statistical anomaly detection
        df_statistical = self.detect_statistical_anomalies(df_features, threshold_std=2)
        
        # ML-based anomaly detection
        df_final = df_statistical.copy()
        
        for model_name, model_info in self.models.items():
            df_final = self.detect_ml_anomalies(
                df_final, 
                model_info['model'], 
                model_info['X_scaled'], 
                model_name
            )
        
        # Create consensus anomaly detection
        anomaly_columns = [col for col in df_final.columns if col.endswith('_is_anomaly')]
        df_final['consensus_anomaly'] = df_final[anomaly_columns].sum(axis=1)
        df_final['is_consensus_anomaly'] = df_final['consensus_anomaly'] >= 2  # At least 2 methods agree
        
        consensus_count = df_final['is_consensus_anomaly'].sum()
        print(f"Consensus detection: {consensus_count} anomalies out of {len(df_final)} records")
        
        return df_final
    
    def analyze_equipment_anomalies(self, df_analysis):
        """
        Analyze anomalies by equipment type and site.
        
        Args:
            df_analysis (pd.DataFrame): Complete analysis results
        """
        print("\n=== Equipment Anomaly Analysis ===")
        
        # Anomalies by equipment type
        print("\nAnomalies by Equipment Type:")
        type_anomalies = df_analysis.groupby('Type')['is_consensus_anomaly'].agg(['sum', 'count', 'mean'])
        type_anomalies['anomaly_rate'] = type_anomalies['mean'] * 100
        print(type_anomalies.sort_values('anomaly_rate', ascending=False))
        
        # Anomalies by site
        print("\nAnomalies by Site:")
        site_anomalies = df_analysis.groupby('Site ID')['is_consensus_anomaly'].agg(['sum', 'count', 'mean'])
        site_anomalies['anomaly_rate'] = site_anomalies['mean'] * 100
        print(site_anomalies.sort_values('anomaly_rate', ascending=False))
        
        # Top anomalous records
        print("\nTop 10 Most Anomalous Records:")
        top_anomalies = df_analysis[df_analysis['is_consensus_anomaly']].sort_values('consensus_anomaly', ascending=False)
        if len(top_anomalies) > 0:
            for idx, row in top_anomalies.head(10).iterrows():
                print(f"  {row['Equipment ID']} ({row['Type']}) at {row['Site ID']}: {row['consensus_anomaly']} methods flagged")
                if 'anomaly_reasons' in row and pd.notna(row['anomaly_reasons']):
                    print(f"    Reasons: {row['anomaly_reasons']}")
    
    def save_models(self, filepath='anomaly_detection_models.pkl'):
        """
        Save trained models to disk.
        
        Args:
            filepath (str): Path to save models
        """
        print(f"Saving models to {filepath}...")
        
        # Prepare models for saving (remove X_scaled as it's not needed for inference)
        models_to_save = {}
        for name, info in self.models.items():
            models_to_save[name] = {
                'model': info['model'],
                'scaler': info['scaler']
            }
        
        save_data = {
            'models': models_to_save,
            'thresholds': self.thresholds,
            'feature_columns': self.feature_columns
        }
        
        joblib.dump(save_data, filepath)
        print("Models saved successfully!")
    
    def load_models(self, filepath='anomaly_detection_models.pkl'):
        """
        Load trained models from disk.
        
        Args:
            filepath (str): Path to load models from
        """
        print(f"Loading models from {filepath}...")
        save_data = joblib.load(filepath)
        
        self.models = save_data['models']
        self.thresholds = save_data['thresholds']
        self.feature_columns = save_data['feature_columns']
        
        print("Models loaded successfully!")

def main():
    """
    Main function to demonstrate the anomaly detection system.
    """
    print("=== Smart Rental Tracker - Anomaly Detection System ===\n")
    
    # Initialize detector
    detector = AnomalyDetector()
    
    try:
        # Load data
        df = detector.load_data()
        
        # Engineer features
        df_features = detector.engineer_features(df)
        
        # Calculate statistical thresholds
        detector.calculate_statistical_thresholds(df_features)
        
        # Train ML models
        detector.train_all_models(df_features)
        
        # Run complete analysis
        df_analysis = detector.run_complete_analysis(df_features)
        
        # Analyze results
        detector.analyze_equipment_anomalies(df_analysis)
        
        # Save models
        detector.save_models()
        
        print("\n=== Analysis Summary ===")
        print(f"Total records analyzed: {len(df_analysis)}")
        print(f"Statistical anomalies: {df_analysis['is_anomaly'].sum()}")
        print(f"ML consensus anomalies: {df_analysis['is_consensus_anomaly'].sum()}")
        
        # Show sample anomalies
        print("\n=== Sample Anomalies ===")
        sample_anomalies = df_analysis[df_analysis['is_consensus_anomaly']].head(5)
        for idx, row in sample_anomalies.iterrows():
            print(f"\nEquipment: {row['Equipment ID']} ({row['Type']})")
            print(f"Site: {row['Site ID']}")
            print(f"Engine Hours: {row['Engine Hours/Day']:.2f}")
            print(f"Idle Hours: {row['Idle Hours/Day']:.2f}")
            print(f"Idle Ratio: {row['Idle_Ratio']:.2%}")
            print(f"Anomaly Score: {row['consensus_anomaly']}/3 methods")
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
