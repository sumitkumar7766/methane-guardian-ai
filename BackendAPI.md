# 🚀 Methane AI Pipeline – API Documentation

## 🌐 Base URL

```
http://127.0.0.1:8000
```

---

# 📌 Overview

This API powers a **multi-agent methane detection system** that includes:

* 🌍 Synthetic Alert Generator
* 🤖 Agent 1: False Positive Filter
* 🧠 Agent 2: Regulatory Report Generator
* 🛰️ Satellite-based Methane Detection (ML Pipeline)
* 📍 Location-based Prediction Engine

---

# 🏠 1. Health Check

### `GET /`

#### Description:

Check if API is running.

#### Response:

```json
{
  "message": "Methane AI API Running!"
}
```

---

# 🏭 2. Infrastructure Data

### `GET /api/infrastructure`

#### Description:

Returns global industrial infrastructure data.

#### Response:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Permian Basin Facility A",
      "lat": 31.9686,
      "lng": -99.9018,
      "status": "Critical",
      "type": "Oil Well",
      "ppm": 8.4
    }
  ]
}
```

---

# 🛰️ 3. Satellite File Prediction

### `POST /predict`

#### Description:

Upload `.nc` satellite file to detect methane leaks using full AI pipeline.

#### Request:

* `file` (UploadFile)

#### Response:

```json
{
  "status": "success",
  "pipeline_results": {
    "max_methane_concentration_ppm": 3.42,
    "stage2_physics": {
      "estimated_emission_rate_kg_hr": 125.4,
      "max_methane_ppm": 3.42
    },
    "detected_source": {
      "node_id": "REF-NODE-3",
      "location_x": 12,
      "location_y": 45,
      "local_concentration": 1.23
    },
    "confidence_score_percent": 87.2,
    "alert_level": "CRITICAL"
  }
}
```

---

# 📍 4. Location-Based Prediction

### `POST /predict-location`

#### Description:

Detect methane leak using latitude & longitude input.

#### Request Body:

```json
{
  "lat": 23.25,
  "lng": 77.41
}
```

#### Response:

```json
{
  "status": "success",
  "pipeline_results": {
    "stage1_vision": {
      "plume_detected": true,
      "plume_area_sq_km": 1.5
    },
    "stage2_physics": {
      "max_methane_ppm": 5.2,
      "estimated_emission_rate_kg_hr": 210.3
    },
    "stage3_graph": {
      "primary_source": {
        "node_id": "INFRA-3",
        "lat": 23.256,
        "lng": 77.418,
        "confidence_score_percent": 82.5
      }
    },
    "final_assessment": {
      "alert_level": "CRITICAL",
      "action_required": "Dispatch drone to coordinates immediately."
    }
  }
}
```

---

# ⚡ 5. Synthetic Alerts

### `GET /alerts`

#### Description:

Returns multiple synthetic methane alerts processed by Agent 1.

#### Query Params:

* `count` (optional, default = 5)

#### Response:

```json
[
  {
    "id": 12345,
    "location": {
      "latitude": 22.3,
      "longitude": 70.8
    },
    "methane_flux": 320,
    "confidence": 0.92,
    "status": "REAL",
    "facility": "Jamnagar Refinery",
    "facility_type": "oil_gas"
  }
]
```

---

# 🔔 6. Single Alert

### `GET /alert`

#### Description:

Returns one synthetic alert.

#### Response:

```json
{
  "id": 56789,
  "methane_flux": 150,
  "status": "UNCERTAIN"
}
```

---

# 📝 7. Regulatory Report (Agent 2)

### `GET /report`

#### Description:

Generates top dangerous methane leaks report.

#### Query Params:

* `count` (optional, default = 10)

#### Response:

```json
[
  {
    "rank": 1,
    "facility": "Mumbai Refinery",
    "facility_type": "oil_gas",
    "methane_flux": 420,
    "confidence": 0.91,
    "danger_score": 382.2,
    "recommended_action": "Immediate shutdown required"
  }
]
```

---

# 🧠 AI Pipeline Architecture

```
Input (.nc / location)
        ↓
Vision Model (Plume Detection)
        ↓
Physics Model (Emission Estimation)
        ↓
Graph Model (Source Attribution)
        ↓
Agent 1 (Validation)
        ↓
Agent 2 (Report Generation)
```

---

# ⚠️ Notes

* Ensure `.nc` file contains `methane_mixing_ratio_bias_corrected`
* CORS is enabled for all origins (update for production)
* Models run in inference mode (no training)

---

# 🚀 Deployment

* Backend: FastAPI
* Recommended Hosting: Render / Railway
* Frontend: React + Leaflet Map

---

# 🔥 Hackathon Pitch Line

> "A multi-agent AI system for real-time methane leak detection using satellite data, physics-informed modeling, and graph-based source attribution."

---
