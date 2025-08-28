"""
Data seeding script to populate the database with sample data
"""
from datetime import datetime, timedelta
import sys
import os

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Change to app directory so database is created in the right place
os.chdir(os.path.join(os.path.dirname(__file__), 'app'))

from database import SessionLocal, engine
import models
import schemas
import crud

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    try:
        # Create Sites
        sites_data = [
            {"site_id": "S001", "name": "Downtown Construction Site", "location": "Downtown", "contact_person": "John Manager"},
            {"site_id": "S002", "name": "Highway Bridge Project", "location": "Highway 95", "contact_person": "Sarah Engineer"},
            {"site_id": "S003", "name": "Mining Site Alpha", "location": "North Ridge", "contact_person": "Mike Supervisor"},
            {"site_id": "S004", "name": "Residential Complex", "location": "Suburbia", "contact_person": "Lisa Coordinator"},
            {"site_id": "S006", "name": "Industrial Park", "location": "East Zone", "contact_person": "Tom Director"},
        ]
        
        for site_data in sites_data:
            existing_site = crud.get_site_by_site_id(db, site_data["site_id"])
            if not existing_site:
                site = schemas.SiteCreate(**site_data)
                crud.create_site(db, site)
                print(f"Created site: {site_data['site_id']}")
        
        # Create Operators
        operators_data = [
            {"operator_id": "OP101", "name": "Alex Thompson", "license_number": "LIC001", "certification_level": "Senior"},
            {"operator_id": "OP103", "name": "Maria Rodriguez", "license_number": "LIC003", "certification_level": "Expert"},
            {"operator_id": "OP106", "name": "David Chen", "license_number": "LIC006", "certification_level": "Intermediate"},
            {"operator_id": "OP114", "name": "Emma Wilson", "license_number": "LIC014", "certification_level": "Senior"},
        ]
        
        for operator_data in operators_data:
            existing_operator = crud.get_operator_by_operator_id(db, operator_data["operator_id"])
            if not existing_operator:
                operator = schemas.OperatorCreate(**operator_data)
                crud.create_operator(db, operator)
                print(f"Created operator: {operator_data['operator_id']}")
        
        # Create Equipment
        equipment_data = [
            {"equipment_id": "EQX1001", "type": "Excavator", "model": "CAT 320", "manufacturer": "Caterpillar", "status": "available"},
            {"equipment_id": "EQX1002", "type": "Crane", "model": "Liebherr LTM", "manufacturer": "Liebherr", "status": "available"},
            {"equipment_id": "EQX1003", "type": "Bulldozer", "model": "CAT D6", "manufacturer": "Caterpillar", "status": "available"},
            {"equipment_id": "EQX1004", "type": "Excavator", "model": "Komatsu PC200", "manufacturer": "Komatsu", "status": "available"},
            {"equipment_id": "EQX1005", "type": "Bulldozer", "model": "CAT D8", "manufacturer": "Caterpillar", "status": "available"},
            {"equipment_id": "EQX1006", "type": "Grader", "model": "CAT 140M", "manufacturer": "Caterpillar", "status": "available"},
            {"equipment_id": "EQX1007", "type": "Excavator", "model": "Volvo EC220", "manufacturer": "Volvo", "status": "available"},
        ]
        
        for equip_data in equipment_data:
            existing_equipment = crud.get_equipment_by_equipment_id(db, equip_data["equipment_id"])
            if not existing_equipment:
                equipment = schemas.EquipmentCreate(**equip_data)
                crud.create_equipment(db, equipment)
                print(f"Created equipment: {equip_data['equipment_id']}")
        
        # Create historical rentals based on the sample data
        rental_data = [
            {
                "equipment_id": "EQX1001",
                "site_id": "S003",
                "operator_id": "OP101",
                "check_out_date": datetime(2025, 4, 1),
                "check_in_date": datetime(2025, 4, 16),
                "rental_rate_per_day": 450.0,
                "status": "completed"
            },
            {
                "equipment_id": "EQX1002",
                "site_id": None,
                "operator_id": None,
                "check_out_date": datetime(2025, 2, 10),
                "check_in_date": datetime(2025, 3, 12),
                "rental_rate_per_day": 650.0,
                "status": "completed"
            },
            {
                "equipment_id": "EQX1003",
                "site_id": "S002",
                "operator_id": "OP103",
                "check_out_date": datetime(2025, 2, 15),
                "check_in_date": datetime(2025, 3, 11),
                "rental_rate_per_day": 520.0,
                "status": "completed"
            },
            {
                "equipment_id": "EQX1004",
                "site_id": "S004",
                "operator_id": "OP106",
                "check_out_date": datetime(2025, 5, 5),
                "check_in_date": datetime(2025, 5, 15),
                "rental_rate_per_day": 430.0,
                "status": "completed"
            },
            {
                "equipment_id": "EQX1005",
                "site_id": "S006",
                "operator_id": "OP101",
                "check_out_date": datetime(2025, 1, 1),
                "check_in_date": datetime(2025, 1, 31),
                "rental_rate_per_day": 580.0,
                "status": "completed"
            },
            {
                "equipment_id": "EQX1006",
                "site_id": "S001",
                "operator_id": "OP114",
                "check_out_date": datetime(2025, 4, 5),
                "check_in_date": datetime(2025, 4, 23),
                "rental_rate_per_day": 380.0,
                "status": "completed"
            },
            {
                "equipment_id": "EQX1007",
                "site_id": None,
                "operator_id": None,
                "check_out_date": datetime(2025, 3, 20),
                "check_in_date": datetime(2025, 4, 1),
                "rental_rate_per_day": 440.0,
                "status": "completed"
            }
        ]
        
        for rental_info in rental_data:
            # Get equipment and site IDs
            equipment = crud.get_equipment_by_equipment_id(db, rental_info["equipment_id"])
            site = None
            operator = None
            
            if rental_info["site_id"]:
                site = crud.get_site_by_site_id(db, rental_info["site_id"])
            if rental_info["operator_id"]:
                operator = crud.get_operator_by_operator_id(db, rental_info["operator_id"])
            
            if equipment:
                rental_create = schemas.RentalCreate(
                    equipment_id=equipment.id,
                    site_id=site.id if site else None,
                    operator_id=operator.id if operator else None,
                    check_out_date=rental_info["check_out_date"],
                    expected_return_date=rental_info["check_in_date"],
                    rental_rate_per_day=rental_info["rental_rate_per_day"]
                )
                
                # Create rental
                rental = crud.create_rental(db, rental_create)
                
                # Update rental with check-in date and status if completed
                if rental_info["status"] == "completed":
                    rental_update = schemas.RentalUpdate(
                        check_in_date=rental_info["check_in_date"],
                        status="completed",
                        total_cost=rental_info["rental_rate_per_day"] * 
                                  ((rental_info["check_in_date"] - rental_info["check_out_date"]).days + 1)
                    )
                    crud.update_rental(db, rental.id, rental_update)
                    
                    # Set equipment back to available
                    equipment_update = schemas.EquipmentUpdate(status="available")
                    crud.update_equipment(db, equipment.id, equipment_update)
                
                print(f"Created rental for equipment: {rental_info['equipment_id']}")
        
        # Create some sample usage logs
        usage_data = [
            {"equipment_id": "EQX1001", "engine_hours": 1.5, "idle_hours": 10, "operating_days": 15},
            {"equipment_id": "EQX1002", "engine_hours": 5.0, "idle_hours": 11, "operating_days": 20},
            {"equipment_id": "EQX1003", "engine_hours": 7.5, "idle_hours": 8.5, "operating_days": 25},
            {"equipment_id": "EQX1004", "engine_hours": 2.0, "idle_hours": 9, "operating_days": 10},
            {"equipment_id": "EQX1005", "engine_hours": 8.0, "idle_hours": 0, "operating_days": 30},
            {"equipment_id": "EQX1006", "engine_hours": 3.0, "idle_hours": 6, "operating_days": 18},
            {"equipment_id": "EQX1007", "engine_hours": 0.0, "idle_hours": 12, "operating_days": 12},
        ]
        
        # Get all completed rentals for usage logs
        completed_rentals = crud.get_rentals(db, status="completed", limit=100)
        
        for i, usage_info in enumerate(usage_data):
            if i < len(completed_rentals):
                rental = completed_rentals[i]
                equipment = crud.get_equipment_by_equipment_id(db, usage_info["equipment_id"])
                
                if equipment and rental:
                    # Create daily usage logs for the rental period
                    days = (rental.check_in_date - rental.check_out_date).days + 1
                    daily_engine_hours = usage_info["engine_hours"]
                    daily_idle_hours = usage_info["idle_hours"]
                    
                    for day in range(min(days, 5)):  # Limit to 5 days for demo
                        log_date = rental.check_out_date + timedelta(days=day)
                        usage_log = schemas.UsageLogCreate(
                            rental_id=rental.id,
                            equipment_id=equipment.id,
                            operator_id=rental.operator_id,
                            date=log_date,
                            engine_hours=daily_engine_hours,
                            idle_hours=daily_idle_hours,
                            fuel_usage=daily_engine_hours * 2.5,  # Approximate fuel usage
                            condition_rating=8,
                            maintenance_required=False
                        )
                        crud.create_usage_log(db, usage_log)
                    
                    print(f"Created usage logs for equipment: {usage_info['equipment_id']}")
        
        # Create some active rentals for demonstration
        active_rentals = [
            {
                "equipment_id": "EQX1001",
                "site_id": "S001",
                "operator_id": "OP101",
                "check_out_date": datetime.now() - timedelta(days=5),
                "expected_return_date": datetime.now() + timedelta(days=10),
                "rental_rate_per_day": 450.0
            },
            {
                "equipment_id": "EQX1003",
                "site_id": "S002",
                "operator_id": "OP103",
                "check_out_date": datetime.now() - timedelta(days=15),
                "expected_return_date": datetime.now() - timedelta(days=2),  # Overdue
                "rental_rate_per_day": 520.0
            }
        ]
        
        for rental_info in active_rentals:
            equipment = crud.get_equipment_by_equipment_id(db, rental_info["equipment_id"])
            site = crud.get_site_by_site_id(db, rental_info["site_id"])
            operator = crud.get_operator_by_operator_id(db, rental_info["operator_id"])
            
            if equipment and equipment.status == "available":
                rental_create = schemas.RentalCreate(
                    equipment_id=equipment.id,
                    site_id=site.id,
                    operator_id=operator.id,
                    check_out_date=rental_info["check_out_date"],
                    expected_return_date=rental_info["expected_return_date"],
                    rental_rate_per_day=rental_info["rental_rate_per_day"]
                )
                
                rental = crud.create_rental(db, rental_create)
                print(f"Created active rental for equipment: {rental_info['equipment_id']}")
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
