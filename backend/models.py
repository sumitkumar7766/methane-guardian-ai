from pydantic import BaseModel

class Location(BaseModel):
    latitude: float
    longitude: float

class Wind(BaseModel):
    speed: float
    direction: int

class Alert(BaseModel):
    timestamp: str
    location: Location
    methane_flux: float
    wind: Wind
    confidence: float
    risk: str