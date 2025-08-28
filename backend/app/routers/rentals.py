from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas
import crud
from database import get_db

router = APIRouter(prefix="/rentals", tags=["rentals"])


@router.post("/", response_model=schemas.Rental)
def create_rental(rental: schemas.RentalCreate, db: Session = Depends(get_db)):
    # Check if equipment exists and is available
    equipment = crud.get_equipment(db, rental.equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    if equipment.status != "available":
        raise HTTPException(status_code=400, detail="Equipment is not available for rental")
    
    return crud.create_rental(db=db, rental=rental)


@router.get("/", response_model=List[schemas.Rental])
def read_rentals(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    rentals = crud.get_rentals(db, skip=skip, limit=limit, status=status)
    return rentals


@router.get("/active", response_model=List[schemas.Rental])
def read_active_rentals(db: Session = Depends(get_db)):
    return crud.get_active_rentals(db)


@router.get("/overdue", response_model=List[schemas.Rental])
def read_overdue_rentals(db: Session = Depends(get_db)):
    return crud.get_overdue_rentals(db)


@router.get("/{rental_id}", response_model=schemas.Rental)
def read_rental(rental_id: int, db: Session = Depends(get_db)):
    db_rental = crud.get_rental(db, rental_id=rental_id)
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental


@router.put("/{rental_id}", response_model=schemas.Rental)
def update_rental(rental_id: int, rental_update: schemas.RentalUpdate, db: Session = Depends(get_db)):
    db_rental = crud.update_rental(db, rental_id=rental_id, rental_update=rental_update)
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental


@router.post("/{rental_id}/checkin", response_model=schemas.Rental)
def check_in_equipment(rental_id: int, db: Session = Depends(get_db)):
    db_rental = crud.check_in_equipment(db, rental_id=rental_id)
    if db_rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return db_rental
