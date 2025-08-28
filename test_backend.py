#!/usr/bin/env python3
"""
Test script to check what the backend dashboard endpoint returns
"""

import requests
import json

try:
    print("🔍 Testing Backend Dashboard Endpoint...")
    print("=" * 50)
    
    # Test the dashboard endpoint
    response = requests.get('http://localhost:8000/dashboard')
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Backend Response:")
        print(json.dumps(data, indent=2))
        
        # Check if equipment_stats exists
        if 'equipment_stats' in data:
            print("\n✅ Equipment Stats Found!")
            equipment_stats = data['equipment_stats']
            
            if 'overview' in equipment_stats:
                overview = equipment_stats['overview']
                print(f"  • Total Equipment: {overview.get('total_equipment', 'MISSING')}")
                print(f"  • Total Rentals: {overview.get('total_rentals', 'MISSING')}")
                print(f"  • Average Utilization: {overview.get('average_utilization', 'MISSING')}")
                print(f"  • Total Engine Hours: {overview.get('total_engine_hours', 'MISSING')}")
            else:
                print("❌ Overview section missing from equipment_stats")
                
            if 'by_equipment_type' in equipment_stats:
                print(f"  • Equipment Types: {list(equipment_stats['by_equipment_type'].keys())}")
            else:
                print("❌ by_equipment_type section missing from equipment_stats")
        else:
            print("❌ equipment_stats section missing from response")
            
    else:
        print(f"❌ Backend Error: {response.status_code}")
        print(f"Response Text: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend at http://localhost:8000")
    print("Make sure your backend server is running!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
