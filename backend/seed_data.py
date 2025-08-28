#!/usr/bin/env python3
"""
Data Seeding Script for Smart Rental Tracking System
Populates the database with sample equipment, sites, and operators
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models import Base, Equipment, Site, Operator, Rental, UsageLog

def create_sample_data():
    """Create sample data for the system"""
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Equipment).count() > 0:
            print("Database already contains data. Skipping seeding.")
            return
        
        print("🌱 Seeding database with sample data...")
        
        # Create sample sites
        sites = []
        site_data = [
            {"site_id": "S001", "name": "Downtown Construction", "location": "Downtown", "address": "123 Main St, Downtown"},
            {"site_id": "S002", "name": "Highway Project", "location": "Highway 101", "address": "456 Highway 101, Suburb"},
            {"site_id": "S003", "name": "Mining Site Alpha", "location": "Mining District", "address": "789 Mine Rd, Mining District"},
            {"site_id": "S004", "name": "Residential Complex", "location": "Residential Area", "address": "321 Home Ave, Residential Area"},
            {"site_id": "S005", "name": "Industrial Park", "location": "Industrial Zone", "address": "654 Industry Blvd, Industrial Zone"},
        ]
        
        for site_info in site_data:
            site = Site(**site_info)
            db.add(site)
            sites.append(site)
        
        db.commit()
        print(f"✅ Created {len(sites)} sites")
        
        # Create sample operators
        operators = []
        operator_data = [
            {"operator_id": "OP001", "name": "John Smith", "license_number": "L12345", "phone": "555-0101", "email": "john.smith@company.com", "certification_level": "Senior"},
            {"operator_id": "OP002", "name": "Sarah Johnson", "license_number": "L12346", "phone": "555-0102", "email": "sarah.johnson@company.com", "certification_level": "Intermediate"},
            {"operator_id": "OP003", "name": "Mike Davis", "license_number": "L12347", "phone": "555-0103", "email": "mike.davis@company.com", "certification_level": "Senior"},
            {"operator_id": "OP004", "name": "Lisa Wilson", "license_number": "L12348", "phone": "555-0104", "email": "lisa.wilson@company.com", "certification_level": "Junior"},
            {"operator_id": "OP005", "name": "Tom Brown", "license_number": "L12349", "phone": "555-0105", "email": "tom.brown@company.com", "certification_level": "Intermediate"},
        ]
        
        for operator_info in operator_data:
            operator = Operator(**operator_info)
            db.add(operator)
            operators.append(operator)
        
        db.commit()
        print(f"✅ Created {len(operators)} operators")
        
        # Create sample equipment
        equipment = []
        equipment_types = ["Excavator", "Bulldozer", "Crane", "Grader", "Loader"]
        manufacturers = ["Caterpillar", "Komatsu", "Hitachi", "Volvo", "Liebherr"]
        models = ["CAT320", "KOM200", "HIT150", "VOLG", "LIE100"]
        
        for i in range(20):
            equipment_info = {
                "equipment_id": f"EQX{1000 + i}",
                "type": random.choice(equipment_types),
                "model": random.choice(models),
                "manufacturer": random.choice(manufacturers),
                "year": random.randint(2018, 2024),
                "serial_number": f"SN{random.randint(100000, 999999)}",
                "status": random.choice(["available", "rented", "maintenance"]),
            }
            
            equipment_item = Equipment(**equipment_info)
            db.add(equipment_item)
            equipment.append(equipment_item)
        
        db.commit()
        print(f"✅ Created {len(equipment)} equipment items")
        
        # Create sample rentals
        rentals = []
        for i in range(15):
            # Random dates within the last 6 months
            start_date = datetime.now() - timedelta(days=random.randint(1, 180))
            duration = random.randint(1, 30)
            end_date = start_date + timedelta(days=duration)
            
            rental_info = {
                "equipment_id": random.choice(equipment).id,
                "site_id": random.choice(sites).id if random.random() > 0.2 else None,  # 20% unassigned
                "operator_id": random.choice(operators).id if random.random() > 0.3 else None,  # 30% unassigned
                "check_out_date": start_date,
                "check_in_date": end_date,
                "expected_return_date": end_date,
                "rental_rate_per_day": round(random.uniform(200, 800), 2),
                "total_cost": round(random.uniform(200, 800) * duration, 2),
                "status": "completed" if end_date < datetime.now() else "active",
                "notes": f"Sample rental {i+1}",
            }
            
            rental = Rental(**rental_info)
            db.add(rental)
            rentals.append(rental)
        
        db.commit()
        print(f"✅ Created {len(rentals)} rentals")
        
        # Create sample usage logs
        usage_logs = []
        for rental in rentals:
            # Create daily usage logs for the rental period
            current_date = rental.check_out_date
            while current_date <= rental.check_in_date:
                # Generate realistic usage data
                engine_hours = random.uniform(0, 12)  # 0-12 hours per day
                idle_hours = random.uniform(0, 8)    # 0-8 idle hours per day
                fuel_usage = round(engine_hours * random.uniform(2, 5), 2)  # 2-5 L per hour
                
                usage_log = UsageLog(
                    rental_id=rental.id,
                    equipment_id=rental.equipment_id,
                    operator_id=rental.operator_id,
                    date=current_date,
                    engine_hours=round(engine_hours, 1),
                    idle_hours=round(idle_hours, 1),
                    fuel_usage=fuel_usage,
                    location=f"Site {rental.site_id}" if rental.site_id else "Unassigned",
                    notes=f"Daily usage log for {current_date.strftime('%Y-%m-%d')}"
                )
                
                usage_logs.append(usage_log)
                current_date += timedelta(days=1)
        
        # Add usage logs in batches
        batch_size = 100
        for i in range(0, len(usage_logs), batch_size):
            batch = usage_logs[i:i + batch_size]
            db.add_all(batch)
            db.commit()
        
        print(f"✅ Created {len(usage_logs)} usage logs")
        
        print("\n🎉 Database seeding completed successfully!")
        print(f"   • Sites: {len(sites)}")
        print(f"   • Operators: {len(operators)}")
        print(f"   • Equipment: {len(equipment)}")
        print(f"   • Rentals: {len(rentals)}")
        print(f"   • Usage Logs: {len(usage_logs)}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
