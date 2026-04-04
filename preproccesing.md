# 🧠 Methane AI Pipeline – Preprocessing Documentation

---

# 📌 Overview

This document explains the **data preprocessing pipeline** used before applying:

* 🤖 **Agent 1: False Positive Filter**
* 📝 **Agent 2: Regulatory Intervention Brief Generator**

The preprocessing ensures that raw methane alerts are:

* Clean
* Structured
* Context-aware
* Ready for intelligent decision-making

---

# ⚙️ Stage 1: Raw Alert Generation

## Source:

* Synthetic Generator (`generator.py`)
* Satellite Model Output (`/predict`, `/predict-location`)

## Raw Alert Format:

```json
{
  "id": 12345,
  "location": {
    "latitude": 22.3,
    "longitude": 70.8
  },
  "methane_flux": 320,
  "confidence": 0.92,
  "timestamp": "2026-04-04T10:00:00"
}
```

---

# 🧼 Stage 2: Data Cleaning

### Steps:

* Remove NaN / invalid values
* Normalize methane values (if needed)
* Ensure all required fields exist

### Example:

```python
data = np.nan_to_num(data)
```

---

# 🌍 Stage 3: Geospatial Enrichment

## Objective:

Attach **real-world context** to alerts

### Process:

* Compute distance to nearest facility
* Assign:

  * `facility`
  * `facility_type`
  * `distance_km`

### Output:

```json
{
  "facility": "Mumbai Refinery",
  "facility_type": "oil_gas",
  "distance_km": 23.5
}
```

---

# 🏭 Stage 4: Facility-Type Mapping

## Purpose:

Determine methane emission likelihood

### Mapping:

```python
METHANE_RELEVANCE = {
    "oil_gas": "HIGH",
    "landfill": "HIGH",
    "coal_mine": "HIGH",
    "agriculture": "MEDIUM",
    "food": "MEDIUM",
    "textile": "LOW",
    "it": "LOW"
}
```

---

# 🤖 Stage 5: Agent 1 Preprocessing

## Inputs:

* Alert data
* Facility data
* Distance calculation

## Derived Features:

* `near_facility`
* `facility_type`
* `relevance_level`
* `distance_km`

## Decision Rules:

```text
IF no facility nearby AND low flux → FALSE_POSITIVE
IF low confidence → UNCERTAIN
IF facility type LOW → FALSE_POSITIVE
ELSE → REAL
```

## Output:

```json
{
  "status": "REAL",
  "facility": "Jamnagar Refinery",
  "facility_type": "oil_gas"
}
```

---

# 🧮 Stage 6: Feature Engineering for Agent 2

## Derived Metrics:

* Danger Score
* Risk Level
* Priority Ranking

### Formula:

```python
danger_score = methane_flux * confidence * facility_weight
```

---

# 🏆 Stage 7: Ranking & Filtering

* Sort alerts by `danger_score`
* Select Top N (default = 5)

---

# 📝 Stage 8: Report Preprocessing (Agent 2)

## Fields Prepared:

* Rank
* Location
* Facility Info
* Methane Flux
* Confidence
* Danger Score
* Recommended Action

---

# 🚨 Stage 9: Action Mapping

### Rules:

```text
Flux > 350 → Immediate Shutdown
Flux > 200 → Urgent Inspection
Flux > 100 → Maintenance Required
Else → Monitor
```

---

# 🔄 Final Preprocessed Output

```json
{
  "rank": 1,
  "facility": "Mumbai Refinery",
  "facility_type": "oil_gas",
  "methane_flux": 420,
  "confidence": 0.91,
  "danger_score": 382.2,
  "recommended_action": "Immediate shutdown required"
}
```

---

# 🧠 Pipeline Summary

```text
Raw Alert
   ↓
Cleaning
   ↓
Geospatial Enrichment
   ↓
Agent 1 (Validation)
   ↓
Feature Engineering
   ↓
Agent 2 (Ranking + Report)
```

---

# ⚠️ Notes

* All alerts are enriched with facility context (no missing values)
* Distance-based validation improves realism
* Facility-type filtering reduces false positives
* Scoring ensures priority-based intervention
