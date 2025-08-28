import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import warnings
warnings.filterwarnings('ignore')

class DemandForecaster:
    """
    Demand forecasting system for rental equipment.
    
    This class handles:
    1. Data transformation from rental logs to time series
    2. Feature engineering for time series forecasting
    3. Model training and prediction
    4. Model persistence and loading
    """
    
    def __init__(self, data_path='../database/data.csv'):
        """
        Initialize the demand forecaster.
        
        Args:
            data_path (str): Path to the rental data CSV file
        """
        self.data_path = data_path
        self.models = {}
        self.feature_columns = []
        self.scaler = None
        
    def load_and_transform_data(self):
        """
        Load rental data and transform it into daily time series format.
        
        Returns:
            pd.DataFrame: Transformed time series data
        """
        print("Loading and transforming rental data...")
        
        # Load the rental data
        df = pd.read_csv(self.data_path)
        
        # Convert date columns to datetime
        df['Expected Check-Out Date'] = pd.to_datetime(df['Expected Check-Out Date'])
        df['Check-In Date'] = pd.to_datetime(df['Check-In Date'])
        
        # Create a date range for the entire period
        start_date = df['Expected Check-Out Date'].min()
        end_date = df['Check-In Date'].max()
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')
        
        # Initialize results list
        time_series_data = []
        
        # For each date, calculate active rentals by site and equipment type
        for date in date_range:
            for site_id in df['Site ID'].unique():
                for equipment_type in df['Type'].unique():
                    # Count active rentals for this date, site, and equipment type
                    active_rentals = len(df[
                        (df['Expected Check-Out Date'] <= date) & 
                        (df['Check-In Date'] >= date) &
                        (df['Site ID'] == site_id) &
                        (df['Type'] == equipment_type)
                    ])
                    
                    time_series_data.append({
                        'Date': date,
                        'Site_ID': site_id,
                        'Type': equipment_type,
                        'Active_Rentals': active_rentals
                    })
        
        # Convert to DataFrame
        ts_df = pd.DataFrame(time_series_data)
        
        # Sort by date
        ts_df = ts_df.sort_values('Date').reset_index(drop=True)
        
        print(f"Transformed data shape: {ts_df.shape}")
        print(f"Date range: {ts_df['Date'].min()} to {ts_df['Date'].max()}")
        print(f"Unique sites: {ts_df['Site_ID'].nunique()}")
        print(f"Unique equipment types: {ts_df['Type'].nunique()}")
        
        return ts_df
    
    def engineer_features(self, df):
        """
        Engineer features for time series forecasting.
        
        Args:
            df (pd.DataFrame): Time series data with Date, Site_ID, Type, Active_Rentals
            
        Returns:
            pd.DataFrame: Data with engineered features
        """
        print("Engineering features...")
        
        # Create a copy to avoid modifying original
        df_features = df.copy()
        
        # Time-based features
        df_features['DayOfWeek'] = df_features['Date'].dt.dayofweek + 1  # 1=Monday, 7=Sunday
        df_features['Month'] = df_features['Date'].dt.month
        df_features['WeekOfYear'] = df_features['Date'].dt.isocalendar().week
        df_features['Quarter'] = df_features['Date'].dt.quarter
        df_features['Year'] = df_features['Date'].dt.year
        
        # Create time index T (1, 2, 3, ...)
        df_features['T'] = range(1, len(df_features) + 1)
        
        # Initialize lag and rolling features
        df_features['Lag_1'] = 0
        df_features['Lag_7'] = 0
        df_features['Lag_30'] = 0
        df_features['MovingAvg_7'] = 0
        df_features['MovingStd_7'] = 0
        
        # Process each site-equipment combination separately to avoid index issues
        for site_id in df_features['Site_ID'].unique():
            for eq_type in df_features['Type'].unique():
                mask = (df_features['Site_ID'] == site_id) & (df_features['Type'] == eq_type)
                subset = df_features[mask].copy()
                
                if len(subset) > 0:
                    # Sort by date to ensure proper lag calculation
                    subset = subset.sort_values('Date').reset_index(drop=True)
                    
                    # Calculate lag features
                    subset['Lag_1'] = subset['Active_Rentals'].shift(1)
                    subset['Lag_7'] = subset['Active_Rentals'].shift(7)
                    subset['Lag_30'] = subset['Active_Rentals'].shift(30)
                    
                    # Calculate rolling features
                    subset['MovingAvg_7'] = subset['Active_Rentals'].rolling(7, min_periods=1).mean()
                    subset['MovingStd_7'] = subset['Active_Rentals'].rolling(7, min_periods=1).std()
                    
                    # Fill NaN values
                    subset['Lag_1'] = subset['Lag_1'].fillna(0)
                    subset['Lag_7'] = subset['Lag_7'].fillna(0)
                    subset['Lag_30'] = subset['Lag_30'].fillna(0)
                    subset['MovingAvg_7'] = subset['MovingAvg_7'].fillna(subset['Active_Rentals'])
                    subset['MovingStd_7'] = subset['MovingStd_7'].fillna(0)
                    
                    # Update the main dataframe
                    df_features.loc[mask, 'Lag_1'] = subset['Lag_1'].values
                    df_features.loc[mask, 'Lag_7'] = subset['Lag_7'].values
                    df_features.loc[mask, 'Lag_30'] = subset['Lag_30'].values
                    df_features.loc[mask, 'MovingAvg_7'] = subset['MovingAvg_7'].values
                    df_features.loc[mask, 'MovingStd_7'] = subset['MovingStd_7'].values
        
        # Define feature columns for training
        self.feature_columns = [
            'DayOfWeek', 'Month', 'WeekOfYear', 'Quarter', 'Year', 'T',
            'Lag_1', 'Lag_7', 'Lag_30', 'MovingAvg_7', 'MovingStd_7'
        ]
        
        print(f"Engineered {len(self.feature_columns)} features")
        return df_features
    
    def prepare_training_data(self, df_features, site_id, equipment_type):
        """
        Prepare training data for a specific site and equipment type.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
            site_id (str): Site ID to train for
            equipment_type (str): Equipment type to train for
            
        Returns:
            tuple: (X_train, y_train, X_test, y_test)
        """
        # Filter data for specific site and equipment type
        site_data = df_features[
            (df_features['Site_ID'] == site_id) & 
            (df_features['Type'] == equipment_type)
        ].copy()
        
        if len(site_data) < 50:  # Need sufficient data
            return None, None, None, None
        
        # Remove rows with NaN values
        site_data = site_data.dropna()
        
        if len(site_data) < 30:  # Still need sufficient data after cleaning
            return None, None, None, None
        
        # Prepare features and target
        X = site_data[self.feature_columns]
        y = site_data['Active_Rentals']
        
        # Split data chronologically (80% train, 20% test)
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        return X_train, y_train, X_test, y_test
    
    def train_model(self, X_train, y_train, model_type='random_forest'):
        """
        Train a forecasting model.
        
        Args:
            X_train (pd.DataFrame): Training features
            y_train (pd.Series): Training target
            model_type (str): Type of model to train
            
        Returns:
            Trained model
        """
        if model_type == 'random_forest':
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
        elif model_type == 'gradient_boosting':
            model = GradientBoostingRegressor(
                n_estimators=100,
                max_depth=6,
                random_state=42,
                learning_rate=0.1
            )
        else:
            raise ValueError(f"Unknown model type: {model_type}")
        
        # Train the model
        model.fit(X_train, y_train)
        return model
    
    def evaluate_model(self, model, X_test, y_test):
        """
        Evaluate model performance.
        
        Args:
            model: Trained model
            X_test (pd.DataFrame): Test features
            y_test (pd.Series): Test target
            
        Returns:
            dict: Performance metrics
        """
        y_pred = model.predict(X_test)
        
        metrics = {
            'MAE': mean_absolute_error(y_test, y_pred),
            'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
            'R2': r2_score(y_test, y_pred),
            'MAPE': np.mean(np.abs((y_test - y_pred) / (y_test + 1e-8))) * 100
        }
        
        return metrics
    
    def train_all_models(self, df_features):
        """
        Train models for all site-equipment combinations.
        
        Args:
            df_features (pd.DataFrame): Data with engineered features
        """
        print("Training models for all site-equipment combinations...")
        
        # Get unique combinations
        combinations = df_features[['Site_ID', 'Type']].drop_duplicates()
        
        trained_count = 0
        total_combinations = len(combinations)
        
        for idx, (_, row) in enumerate(combinations.iterrows()):
            site_id = row['Site_ID']
            equipment_type = row['Type']
            
            print(f"Training {equipment_type} at {site_id} ({idx+1}/{total_combinations})")
            
            # Prepare training data
            X_train, y_train, X_test, y_test = self.prepare_training_data(
                df_features, site_id, equipment_type
            )
            
            if X_train is None:
                print(f"  Insufficient data for {equipment_type} at {site_id}")
                continue
            
            # Train model
            model = self.train_model(X_train, y_train, 'random_forest')
            
            # Evaluate model
            metrics = self.evaluate_model(model, X_test, y_test)
            
            # Store model and metrics
            model_key = f"{site_id}_{equipment_type}"
            
            # Get the last data point for this site-equipment combination
            site_data_for_last = df_features[
                (df_features['Site_ID'] == site_id) & 
                (df_features['Type'] == equipment_type)
            ].copy()
            
            last_data_dict = {}
            if len(site_data_for_last) > 0:
                last_data = site_data_for_last.iloc[-1]
                last_data_dict = {
                    'Lag_1': last_data.get('Lag_1', 1),
                    'Lag_7': last_data.get('Lag_7', 1),
                    'Lag_30': last_data.get('Lag_30', 1),
                    'MovingAvg_7': last_data.get('MovingAvg_7', 1),
                    'MovingStd_7': last_data.get('MovingStd_7', 0.5)
                }
            
            self.models[model_key] = {
                'model': model,
                'metrics': metrics,
                'feature_columns': self.feature_columns.copy(),
                'last_data': last_data_dict
            }
            
            print(f"  Model trained successfully. R²: {metrics['R2']:.3f}, MAE: {metrics['MAE']:.2f}")
            trained_count += 1
        
        print(f"\nTraining completed! {trained_count}/{total_combinations} models trained successfully.")
    
    def predict_demand(self, site_id, equipment_type, days_ahead=7):
        """
        Predict demand for a specific site and equipment type.
        
        Args:
            site_id (str): Site ID
            equipment_type (str): Equipment type
            days_ahead (int): Number of days to predict ahead
            
        Returns:
            list: Predicted demand values
        """
        model_key = f"{site_id}_{equipment_type}"
        
        if model_key not in self.models:
            raise ValueError(f"No trained model found for {equipment_type} at {site_id}")
        
        model_info = self.models[model_key]
        model = model_info['model']
        feature_columns = model_info['feature_columns']
        
        # Get the last known data point from our training data
        # Find the most recent data for this site-equipment combination
        last_data = None
        for key, info in self.models.items():
            if key == model_key and 'last_data' in info:
                last_data = info['last_data']
                break
        
        # If no last data, use reasonable defaults
        if last_data is None:
            last_data = {
                'Lag_1': 1,  # Assume 1 unit was active yesterday
                'Lag_7': 1,  # Assume 1 unit was active a week ago
                'Lag_30': 1, # Assume 1 unit was active a month ago
                'MovingAvg_7': 1,  # Assume average of 1 unit
                'MovingStd_7': 0.5  # Assume some variation
            }
        
        # Create future dates
        last_date = datetime.now()
        future_dates = [last_date + timedelta(days=i) for i in range(1, days_ahead + 1)]
        
        predictions = []
        
        for i, future_date in enumerate(future_dates):
            # Create features for this future date
            features = {
                'DayOfWeek': future_date.weekday() + 1,
                'Month': future_date.month,
                'WeekOfYear': future_date.isocalendar()[1],
                'Quarter': (future_date.month - 1) // 3 + 1,
                'Year': future_date.year,
                'T': 1000 + i,  # Placeholder time index
                'Lag_1': last_data['Lag_1'],
                'Lag_7': last_data['Lag_7'],
                'Lag_30': last_data['Lag_30'],
                'MovingAvg_7': last_data['MovingAvg_7'],
                'MovingStd_7': last_data['MovingStd_7']
            }
            
            # Convert to DataFrame and select features
            feature_df = pd.DataFrame([features])[feature_columns]
            
            # Make prediction
            prediction = model.predict(feature_df)[0]
            predictions.append(max(0, round(prediction)))  # Ensure non-negative
        
        return predictions
    
    def save_models(self, filepath='demand_forecasting_models.pkl'):
        """
        Save trained models to disk.
        
        Args:
            filepath (str): Path to save models
        """
        print(f"Saving models to {filepath}...")
        joblib.dump(self.models, filepath)
        print("Models saved successfully!")
    
    def load_models(self, filepath='demand_forecasting_models.pkl'):
        """
        Load trained models from disk.
        
        Args:
            filepath (str): Path to load models from
        """
        print(f"Loading models from {filepath}...")
        self.models = joblib.load(filepath)
        print("Models loaded successfully!")

def main():
    """
    Main function to demonstrate the demand forecasting system.
    """
    print("=== Smart Rental Tracker - Demand Forecasting System ===\n")
    
    # Initialize forecaster
    forecaster = DemandForecaster()
    
    try:
        # Load and transform data
        ts_data = forecaster.load_and_transform_data()
        
        # Engineer features
        ts_data_features = forecaster.engineer_features(ts_data)
        
        # Train models
        forecaster.train_all_models(ts_data_features)
        
        # Save models
        forecaster.save_models()
        
        # Demonstrate prediction
        print("\n=== Sample Predictions ===")
        sample_sites = ['SITE011', 'SITE003', 'SITE008']
        sample_types = ['Excavator', 'Bulldozer', 'Crane']
        
        for site in sample_sites[:2]:  # Limit to avoid too many predictions
            for eq_type in sample_types[:2]:
                try:
                    predictions = forecaster.predict_demand(site, eq_type, days_ahead=7)
                    print(f"\n{eq_type} at {site} - Next 7 days:")
                    for i, pred in enumerate(predictions, 1):
                        print(f"  Day {i}: {pred} units")
                except ValueError as e:
                    print(f"  {eq_type} at {site}: {e}")
        
        print("\n=== Training Summary ===")
        print(f"Total models trained: {len(forecaster.models)}")
        
        # Show some performance metrics
        if forecaster.models:
            print("\nSample model performance:")
            for model_key, model_info in list(forecaster.models.items())[:3]:
                metrics = model_info['metrics']
                print(f"{model_key}:")
                print(f"  R² Score: {metrics['R2']:.3f}")
                print(f"  MAE: {metrics['MAE']:.2f}")
                print(f"  RMSE: {metrics['RMSE']:.2f}")
        
    except Exception as e:
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
