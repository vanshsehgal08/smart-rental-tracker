#!/usr/bin/env python3
"""
Simple script to train and save ML models
Run this from the backend directory
"""

import sys
import os

# Add the app directory to the path
sys.path.append('app')

# Add the ml directory to the path
ml_path = os.path.join(os.path.dirname(__file__), '..', 'ml')
sys.path.append(ml_path)

try:
    # Import and create the ML system directly
    from smart_ml_system import SmartMLSystem
    
    print("🚀 Creating ML system...")
    ml_system = SmartMLSystem()
    
    print("📊 Training anomaly detection model...")
    print("📈 Training demand forecasting model...")
    ml_system._train_models()
    
    if ml_system.models_trained:
        print("✅ Models trained successfully!")
        
        # Create models directory with absolute path
        models_dir = os.path.join(ml_path, 'models')
        print(f"📁 Creating models directory: {models_dir}")
        
        try:
            os.makedirs(models_dir, exist_ok=True)
            print(f"✅ Models directory created/verified: {models_dir}")
        except Exception as e:
            print(f"❌ Error creating models directory: {e}")
            # Try alternative path
            models_dir = os.path.join(os.getcwd(), '..', 'ml', 'models')
            os.makedirs(models_dir, exist_ok=True)
            print(f"✅ Using alternative path: {models_dir}")
        
        # Save the models
        print("💾 Saving models to disk...")
        try:
            ml_system.save_models(models_dir)
            print("🎉 All models saved successfully!")
            
            # Verify models were saved
            print(f"📁 Models saved to: {os.path.abspath(models_dir)}")
            print("\n📋 Saved models:")
            for model_file in os.listdir(models_dir):
                file_path = os.path.join(models_dir, model_file)
                file_size = os.path.getsize(file_path)
                print(f"   • {model_file} ({file_size} bytes)")
                
        except Exception as e:
            print(f"❌ Error saving models: {e}")
            import traceback
            traceback.print_exc()
            
    else:
        print("❌ Failed to train models!")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n🔧 Troubleshooting:")
    print("1. Make sure you're in the backend directory")
    print("2. Make sure the backend server is not running")
    print("3. Check that all dependencies are installed")
    import traceback
    traceback.print_exc()
