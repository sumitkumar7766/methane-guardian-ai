# 🌍 Methane Guardian AI

🚀 **Multi-Agent AI System for Methane Leak Detection & Decision Intelligence**

---

# 📌 Overview

Methane Guardian AI is an **end-to-end intelligent system** that detects, validates, and prioritizes methane leaks using:

* 🛰️ Satellite Data (.nc files)
* 🤖 Multi-Agent AI System
* 🌍 Geospatial Intelligence
* 🧠 Explainable AI + Chatbot

---

# 🎯 Problem

Methane leaks are:

* Invisible ❌
* Highly dangerous ⚠️
* Poorly monitored ❌

### Challenges:

* Noisy satellite data 🌫️
* False positives ❌
* No actionable insights ❌

---

# 💡 Solution

We built a **multi-agent AI pipeline** that:

✔ Detects methane leaks
✔ Filters false alerts
✔ Generates regulatory reports
✔ Explains results via AI chatbot

---

# 🧠 System Architecture

```text
Satellite Data / Synthetic Alerts
        ↓
Denoising (Noise Handling)
        ↓
Methane Detection Model
        ↓
Agent 1 (Validation)
        ↓
Agent 2 (Decision Engine)
        ↓
AI Chatbot Explanation
        ↓
Frontend Dashboard (Map + Alerts)
```

---

# 🤖 Agent-Based Intelligence

## 🔹 Agent 1 – False Positive Filter

👉 Purpose:

* Validate methane alerts

👉 Checks:

* Nearby facility 🏭
* Facility type relevance
* Distance + flux + confidence

👉 Output:

* REAL ✅
* FALSE_POSITIVE ❌
* UNCERTAIN ⚠️

---

## 🔹 Agent 2 – Regulatory Intervention Generator

👉 Purpose:

* Identify most dangerous leaks

👉 Features:

* Danger score calculation
* Top 5 ranking
* Action recommendation

👉 Output:

* Ranked alerts
* Suggested actions

---

# 🧠 AI Chatbot (Innovation 🔥)

👉 Converts raw data into human understanding

### 💬 Features:

* Brief explanation
* Detailed technical analysis
* Q&A support

---

# 🛰️ Satellite Processing Pipeline

### Input:

* Sentinel-5P `.nc` data

### Steps:

1. Load NetCDF data
2. Normalize values
3. Add noise (simulation)
4. **Denoising (Twist 2)**
5. Methane segmentation

---

# 🌫️ Twist Handling (Noise Problem)

👉 Problem:

* Satellite sensor degradation

👉 Solution:

* Gaussian noise simulation
* Image denoising before detection

👉 Result:

* Reduced false positives
* Improved accuracy

---

# 🌍 Geospatial Intelligence

* Industrial facility database
* Facility type classification
* Distance-based validation

---

# 📊 Features

* 🔥 Real-time methane detection
* 🤖 Multi-agent AI pipeline
* 📍 Map-based visualization
* 📋 Regulatory report generation
* 💬 AI chatbot explanations
* 🌫️ Noise-aware processing

---

# 🌐 API Endpoints

| Endpoint            | Method | Description              |
| ------------------- | ------ | ------------------------ |
| `/alerts`           | GET    | Synthetic alerts         |
| `/report`           | GET    | Agent 2 report           |
| `/predict`          | POST   | Upload .nc file          |
| `/predict-location` | POST   | Location-based detection |

---

# 💻 Frontend

* ⚛️ React.js
* 🗺️ Leaflet Map
* 📊 Dashboard UI
* 📋 Popup report system

---

# ⚙️ Installation

```bash
git clone https://github.com/sumitkumar7766/methane-guardian-ai.git
cd methane-guardian-ai
```

### Backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

---

# 📁 Project Structure

```bash
├── main.py
├── generator.py
├── agent_filter.py
├── agent_report.py
├── facilities.py
├── utils.py
├── preprocessing/
├── frontend/
```

---

# 🚀 Deployment

* Backend: Render / Railway
* Frontend: Vercel / Netlify

---

# 🧠 Innovation Highlights

* 🔥 Multi-Agent AI Architecture
* 🌫️ Noise-aware satellite processing
* 🧠 AI chatbot explanation system
* 📊 Risk-based prioritization
* 🌍 Geospatial intelligence

---

# 📊 Example Output

```json
{
  "facility": "Mumbai Refinery",
  "status": "REAL",
  "danger_score": 382.2,
  "recommended_action": "Immediate shutdown required"
}
```

---

# 🎯 Future Scope

* 🔥 Real ML model (U-Net / CNN)
* 📡 Live satellite API integration
* 🧠 LLM-powered chatbot
* 🌍 Global dataset integration
* 📄 PDF report export

---

# 🏆 Hackathon Pitch

> “A multi-agent, explainable AI system that transforms noisy satellite methane data into actionable environmental intelligence.”

---

# 👨‍💻 Contributors

* Sumit Kumar
* Team CREATIVE TANKS

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
