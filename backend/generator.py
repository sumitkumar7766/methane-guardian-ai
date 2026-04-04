import random
from datetime import datetime
from config import *

def generate_alert():
    latitude = random.uniform(LAT_MIN, LAT_MAX)
    longitude = random.uniform(LON_MIN, LON_MAX)

    flux = round(random.uniform(FLUX_MIN, FLUX_MAX), 2)

    wind = {
        "speed": round(random.uniform(WIND_MIN, WIND_MAX), 2),
        "direction": random.randint(0, 360)
    }

    confidence = round(random.uniform(CONF_MIN, CONF_MAX), 2)

    # Risk classification
    if flux > 300:
        risk = "HIGH"
    elif flux > 150:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "methane_flux": flux,
        "wind": wind,
        "confidence": confidence,
        "risk": risk
    }


def generate_stream(n=5):
    return [generate_alert() for _ in range(n)]