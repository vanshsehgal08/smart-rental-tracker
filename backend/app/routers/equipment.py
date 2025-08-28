from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas
import crud
from database import get_db

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.post("/", response_model=schemas.Equipment)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    db_equipment = crud.get_equipment_by_equipment_id(db, equipment_id=equipment.equipment_id)
    if db_equipment:
        raise HTTPException(status_code=400, detail="Equipment ID already registered")
    return crud.create_equipment(db=db, equipment=equipment)


@router.get("/", response_model=List[schemas.Equipment])
def read_equipment(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    equipment = crud.get_equipment_list(db, skip=skip, limit=limit)
    return equipment


@router.get("/status/detailed", response_model=List[schemas.EquipmentWithStatus])
def read_equipment_with_status(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_equipment_with_status(db, skip=skip, limit=limit)


@router.get("/{equipment_id}", response_model=schemas.Equipment)
def read_equipment_by_id(equipment_id: int, db: Session = Depends(get_db)):
    db_equipment = crud.get_equipment(db, equipment_id=equipment_id)
    if db_equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_equipment


@router.put("/{equipment_id}", response_model=schemas.Equipment)
def update_equipment(equipment_id: int, equipment_update: schemas.EquipmentUpdate, db: Session = Depends(get_db)):
    db_equipment = crud.update_equipment(db, equipment_id=equipment_id, equipment_update=equipment_update)
    if db_equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_equipment
