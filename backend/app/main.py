from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
import crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Rental Tracking System",
    description="API for tracking construction and mining equipment rentals",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Smart Rental Tracking System API", "version": "1.0.0"}


# Equipment endpoints
@app.post("/equipment/", response_model=schemas.Equipment)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    db_equipment = crud.get_equipment_by_equipment_id(db, equipment_id=equipment.equipment_id)
    if db_equipment:
        raise HTTPException(status_code=400, detail="Equipment ID already registered")
    return crud.create_equipment(db=db, equipment=equipment)


@app.get("/equipment/", response_model=List[schemas.Equipment])
def read_equipment(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    equipment = crud.get_equipment_list(db, skip=skip, limit=limit)
    return equipment


@app.get("/equipment/{equipment_id}", response_model=schemas.Equipment)
def read_equipment_by_id(equipment_id: int, db: Session = Depends(get_db)):
    db_equipment = crud.get_equipment(db, equipment_id=equipment_id)
    if db_equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_equipment


@app.put("/equipment/{equipment_id}", response_model=schemas.Equipment)
def update_equipment(equipment_id: int, equipment_update: schemas.EquipmentUpdate, db: Session = Depends(get_db)):
    db_equipment = crud.update_equipment(db, equipment_id=equipment_id, equipment_update=equipment_update)
    if db_equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_equipment


@app.get("/equipment/status/detailed", response_model=List[schemas.EquipmentWithStatus])
def read_equipment_with_status(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_equipment_with_status(db, skip=skip, limit=limit)


# Site endpoints
@app.post("/sites/", response_model=schemas.Site)
def create_site(site: schemas.SiteCreate, db: Session = Depends(get_db)):
    db_site = crud.get_site_by_site_id(db, site_id=site.site_id)
    if db_site:
        raise HTTPException(status_code=400, detail="Site ID already registered")
    return crud.create_site(db=db, site=site)


@app.get("/sites/", response_model=List[schemas.Site])
def read_sites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sites = crud.get_sites(db, skip=skip, limit=limit)
    return sites


@app.get("/sites/{site_id}", response_model=schemas.Site)
def read_site(site_id: int, db: Session = Depends(get_db)):
    db_site = crud.get_site(db, site_id=site_id)
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    return db_site


# Operator endpoints
@app.post("/operators/", response_model=schemas.Operator)
def create_operator(operator: schemas.OperatorCreate, db: Session = Depends(get_db)):
    db_operator = crud.get_operator_by_operator_id(db, operator_id=operator.operator_id)
    if db_operator:
        raise HTTPException(status_code=400, detail="Operator ID already registered")
    return crud.create_operator(db=db, operator=operator)


@app.get("/operators/", response_model=List[schemas.Operator])
def read_operators(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    operators = crud.get_operators(db, skip=skip, limit=limit)
    return operators


@app.get("/operators/{operator_id}", response_model=schemas.Operator)
def read_operator(operator_id: int, db: Session = Depends(get_db)):
    db_operator = crud.get_operator(db, operator_id=operator_id)
    if db_operator is None:
        raise HTTPException(status_code=404, detail="Operator not found")
    return db_operator


# Rental endpoints
@app.post("/rentals/", response_model=schemas.Rental)
def create_rental(rental: schemas.RentalCreate, db: Session = Depends(get_db)):
    # Check if equipment exists and is available
    equipment = crud.get_equipment(db, rental.equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    if equipment.status != "available":
        raise HTTPException(status_code=400, detail="Equipment is not available for rental")
    
    return crud.create_rental(db=db, rental=rental)


@app.post("/rentals/manual", response_model=schemas.Rental)
def create_rental_manual(rental: schemas.RentalCreate, db: Session = Depends(get_db)):
    """Create rental without equipment availability check - for manual management"""
    # Only check if equipment exists
    equipment = crud.get_equipment(db, rental.equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    # Create rental without changing equipment status (assume you've already updated it manually)
    return crud.create_rental_manual(db=db, rental=rental)


@app.get("/rentals/", response_model=List[schemas.Rental])
def read_rentals(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    rentals = crud.get_rentals(db, skip=skip, limit=limit, status=status)
    return rentals


@app.get("/rentals/active", response_model=List[schemas.Rental])
def read_active_rentals(db: Session = Depends(get_db)):
    return crud.get_active_rentals(db)


@app.get("/rentals/overdue", response_model=List[schemas.Rental])
def read_overdue_rentals(db: Session = Depends(get_db)):
    return crud.get_overdue_rentals(db)


@app.get("/rentals/{rental_id}", response_model=schemas.Rental)
def read_rental(rental_id: int, db: Session = Depends(get_db)):
    db_rental = crud.get_rental(db, rental_id=rental_id)
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental


@app.put("/rentals/{rental_id}", response_model=schemas.Rental)
def update_rental(rental_id: int, rental_update: schemas.RentalUpdate, db: Session = Depends(get_db)):
    db_rental = crud.update_rental(db, rental_id=rental_id, rental_update=rental_update)
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental


@app.post("/rentals/{rental_id}/checkin", response_model=schemas.Rental)
def check_in_equipment(rental_id: int, db: Session = Depends(get_db)):
    db_rental = crud.check_in_equipment(db, rental_id=rental_id)
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental


# Usage Log endpoints
@app.post("/usage-logs/", response_model=schemas.UsageLog)
def create_usage_log(usage_log: schemas.UsageLogCreate, db: Session = Depends(get_db)):
    return crud.create_usage_log(db=db, usage_log=usage_log)


@app.get("/usage-logs/rental/{rental_id}", response_model=List[schemas.UsageLog])
def read_usage_logs_by_rental(rental_id: int, db: Session = Depends(get_db)):
    return crud.get_usage_logs_by_rental(db, rental_id=rental_id)


@app.get("/usage-logs/equipment/{equipment_id}", response_model=List[schemas.UsageLog])
def read_usage_logs_by_equipment(equipment_id: int, db: Session = Depends(get_db)):
    return crud.get_usage_logs_by_equipment(db, equipment_id=equipment_id)


# Alert endpoints
@app.post("/alerts/", response_model=schemas.Alert)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    return crud.create_alert(db=db, alert=alert)


@app.get("/alerts/", response_model=List[schemas.Alert])
def read_alerts(skip: int = 0, limit: int = 100, is_resolved: Optional[bool] = None, db: Session = Depends(get_db)):
    return crud.get_alerts(db, skip=skip, limit=limit, is_resolved=is_resolved)


@app.put("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: int, resolved_by: str, db: Session = Depends(get_db)):
    db_alert = crud.resolve_alert(db, alert_id=alert_id, resolved_by=resolved_by)
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert resolved successfully"}


# Dashboard and Analytics endpoints
@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    equipment_summary = crud.get_equipment_summary(db)
    rental_summary = crud.get_rental_summary(db)
    recent_alerts = crud.get_alerts(db, limit=5, is_resolved=False)
    
    return schemas.DashboardSummary(
        equipment_summary=equipment_summary,
        rental_summary=rental_summary,
        recent_alerts=recent_alerts
    )


@app.post("/analytics/detect-anomalies")
def detect_anomalies(db: Session = Depends(get_db)):
    """Run anomaly detection and create alerts"""
    idle_alerts = crud.detect_idle_equipment_anomalies(db)
    overdue_alerts = crud.detect_overdue_rentals(db)
    
    return {
        "message": "Anomaly detection completed",
        "idle_alerts_created": len(idle_alerts),
        "overdue_alerts_created": len(overdue_alerts)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
