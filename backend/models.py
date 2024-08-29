# models.py
from pydantic import BaseModel, Field
from typing import List

class Outfit(BaseModel):
    outfit: List[str] = Field(..., description="List of clothes that can be worn together.")