from facilities import facilities
from utils import calculate_distance

METHANE_RELEVANCE = {
    "oil_gas": "HIGH",
    "landfill": "HIGH",
    "coal_mine": "HIGH",
    "agriculture": "MEDIUM",
    "food": "MEDIUM",
    "it": "LOW",
    "textile": "LOW",
    "unknown": "LOW"
}
# 🚀 Agent 2: Regulatory Intervention Brief Generator

# -------------------------------
# 🔥 1. Danger Score Calculation
# -------------------------------

def calculate_danger_score(alert):
    flux = alert.get("methane_flux", 0)
    confidence = alert.get("confidence", 0)

    facility_type = alert.get("facility_type", "unknown")

    # 🎯 Facility-based weighting
    if facility_type == "oil_gas":
        weight = 1.0
    elif facility_type == "coal_mine":
        weight = 0.95
    elif facility_type == "landfill":
        weight = 0.9
    elif facility_type in ["agriculture", "food"]:
        weight = 0.6
    else:
        weight = 0.3  # low relevance

    # 🧠 Final Score
    score = flux * confidence * weight
    return round(score, 2)


# -------------------------------
# 🏆 2. Get Top Dangerous Alerts
# -------------------------------

def get_top_dangerous(alerts, top_n=5):
    sorted_alerts = sorted(
        alerts,
        key=lambda x: calculate_danger_score(x),
        reverse=True
    )
    return sorted_alerts[:top_n]


# -------------------------------
# 🚨 3. Action Suggestion Engine
# -------------------------------

def suggest_action(alert):
    flux = alert.get("methane_flux", 0)
    status = alert.get("status", "UNKNOWN")

    if status == "FALSE_POSITIVE":
        return "No action required"

    if flux > 350:
        return "🚨 Immediate shutdown and emergency response required"

    if flux > 200:
        return "⚠️ Urgent inspection and leak containment required"

    if flux > 100:
        return "🛠 Schedule maintenance and monitor closely"

    return "👁 Continue monitoring"


# -------------------------------
# 📝 4. Report Generator
# -------------------------------

def generate_report(alerts):
    report = []

    # Top 5 select karo
    top_alerts = get_top_dangerous(alerts)

    for i, alert in enumerate(top_alerts, start=1):
        entry = {
            "rank": i,
            "facility": alert.get("facility", "Unknown"),
            "facility_type": alert.get("facility_type", "unknown"),
            "location": alert.get("location"),
            "methane_flux": alert.get("methane_flux"),
            "confidence": alert.get("confidence"),
            "status": alert.get("status"),
            "danger_score": calculate_danger_score(alert),
            "recommended_action": suggest_action(alert)
        }

        report.append(entry)

    return report


# -------------------------------
# 📄 5. (Optional) Text Report
# -------------------------------

def generate_text_report(alerts):
    report_data = generate_report(alerts)

    text = "\n🚨 Regulatory Intervention Brief\n"
    text += "=" * 45 + "\n\n"

    for r in report_data:
        text += f"Rank #{r['rank']}\n"
        text += f"Location: {r['location']}\n"
        text += f"Facility: {r['facility']} ({r['facility_type']})\n"
        text += f"Flux: {r['methane_flux']} kg/hr\n"
        text += f"Confidence: {r['confidence']}\n"
        text += f"Danger Score: {r['danger_score']}\n"
        text += f"Status: {r['status']}\n"
        text += f"Action: {r['recommended_action']}\n"
        text += "-" * 40 + "\n"

    return text


def is_near_facility(alert, threshold_km=50):
    lat = alert["location"]["latitude"]
    lon = alert["location"]["longitude"]

    for f in facilities:
        dist = calculate_distance(lat, lon, f["lat"], f["lon"])
        if dist < threshold_km:
            return True, f

    return False, None


def filter_false_positive(alert):
    near, facility_obj = is_near_facility(alert)

    flux = alert["methane_flux"]
    confidence = alert["confidence"]

    # DEFAULT values
    facility_name = "Unknown"
    facility_type = "unknown"

    if facility_obj:
        facility_name = facility_obj["name"]
        facility_type = facility_obj["type"]

    relevance = METHANE_RELEVANCE.get(facility_type, "LOW")

    # ❌ FALSE
    if not near and flux < 100:
        return {
            **alert,
            "status": "FALSE_POSITIVE",
            "facility": facility_name,
            "facility_type": facility_type
        }

    # ⚠️ UNCERTAIN
    if confidence < 0.6:
        return {
            **alert,
            "status": "UNCERTAIN",
            "facility": facility_name,
            "facility_type": facility_type
        }

    # ❌ LOW relevance (IT, textile)
    if relevance == "LOW":
        return {
            **alert,
            "status": "FALSE_POSITIVE",
            "facility": facility_name,
            "facility_type": facility_type
        }

    # ✅ REAL
    return {
        **alert,
        "status": "REAL",
        "facility": facility_name,
        "facility_type": facility_type
    }