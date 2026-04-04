from facilities import facilities
from utils import calculate_distance

METHANE_RELEVANCE = {
    "oil_gas": "HIGH",
    "landfill": "HIGH",
    "coal_mine": "HIGH",
    "agriculture": "MEDIUM",
    "food": "MEDIUM",
    "it": "LOW",
    "textile": "LOW"
}


# 🔍 Find nearest facility ALWAYS
def get_nearest_facility(alert):
    lat = alert["location"]["latitude"]
    lon = alert["location"]["longitude"]

    nearest = None
    min_dist = float("inf")

    for f in facilities:
        dist = calculate_distance(lat, lon, f["lat"], f["lon"])
        if dist < min_dist:
            min_dist = dist
            nearest = f

    return nearest, min_dist


def filter_false_positive(alert):
    flux = alert["methane_flux"]
    confidence = alert["confidence"]

    # ✅ ALWAYS get nearest facility
    facility_obj, distance = get_nearest_facility(alert)

    facility_name = facility_obj["name"]
    facility_type = facility_obj["type"]

    relevance = METHANE_RELEVANCE.get(facility_type, "LOW")

    # ❌ FAR + LOW FLUX
    if distance > 100 and flux < 100:
        return {
            **alert,
            "status": "FALSE_POSITIVE",
            "facility": facility_name,
            "facility_type": facility_type,
            "distance_km": round(distance, 2)
        }

    # ⚠️ LOW CONFIDENCE
    if confidence < 0.6:
        return {
            **alert,
            "status": "UNCERTAIN",
            "facility": facility_name,
            "facility_type": facility_type,
            "distance_km": round(distance, 2)
        }

    # ❌ LOW relevance industry
    if relevance == "LOW":
        return {
            **alert,
            "status": "FALSE_POSITIVE",
            "facility": facility_name,
            "facility_type": facility_type,
            "distance_km": round(distance, 2)
        }

    # ✅ REAL
    return {
        **alert,
        "status": "REAL",
        "facility": facility_name,
        "facility_type": facility_type,
        "distance_km": round(distance, 2)
    }