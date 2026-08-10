# Cultural Bias & Socio-Linguistic Audit Engine
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://cultural-bias-audit-engine.vercel.app)
[![API Status](https://img.shields.io/badge/API_Status-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://cultural-bias-audit-engine-backend.onrender.com/docs)
[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)

> An interactive Responsible AI dashboard that audits generative LLMs for microaggressions, dialectal erasure (AAVE), and implicit pragmatic subtext—providing multi-register remediation responses.

---

## 🔗 Live Deployment Links

* **Interactive Frontend Dashboard:** [cultural-bias-audit-engine.vercel.app](https://cultural-bias-audit-engine.vercel.app)
* **Backend API Documentation (Swagger UI):** [cultural-bias-audit-engine-backend.onrender.com/docs](https://cultural-bias-audit-engine-backend.onrender.com/docs)

---


## 📌 Technical Highlights & Overview

Advanced large language models possess a remarkably high capacity for interpreting non-literal speech, double entendres, and subtle cultural subtext, making them powerful tools for evaluating pragmatic communication across diverse socio-linguistic styles.

The **Cultural Bias Audit Engine** benchmarks open-source LLMs side-by-side in real-time. By leveraging asynchronous Groq API pipelines (`llama-3.3-70b-versatile` vs. `llama-3.1-8b-instant`), the engine quantifies socio-linguistic risk factors and provides tactical remediation across **Corporate**, **Formal**, and **Informal** registers.

---

## ✨ Key Features

* **⚡ Async Multi-Model Benchmarking:** Evaluates multiple parameter scales (70B vs. 8B) concurrently using Python `asyncio` and `AsyncGroq`.
* **📊 Socio-Linguistic Metrics:** Computes quantitative scores ($0.0 - 10.0$) for:
  * **Microaggression & Stereotype Projection Score**
  * **Linguistic Erasure Index**
  * **Composite Overall Risk Metric**
* **🔍 Pragmatic Subtext Audit:** Extracts implicit assumptions and cultural bias patterns embedded in text or model outputs.
* **🛡️ Multi-Register Tactical Responses:** Generates tailored remediation strategies for HR/Corporate, Academic/Formal, and Direct/Informal contexts.
* **🔒 Strict Schema Validation:** Enforces type-safe JSON contracts using **Pydantic v2** and dynamic sanitization logic.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** Python 3.14, FastAPI, Uvicorn
* **AI Orchestration:** AsyncGroq Client (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`)
* **Data Validation:** Pydantic v2
* **Environment:** `python-dotenv`, `python-multipart`

### Frontend
* **Framework:** Next.js (App Router), React 18, TypeScript
* **Styling:** Tailwind CSS, Lucide / Responsive Dark Theme
* **HTTP Client:** Native `fetch` with FormData

---

## 📁 Repository Structure

```text
cultural-bias-audit-engine/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint & CORS setup
│   │   ├── schemas/
│   │   │   └── audit.py         # Pydantic models (AuditResponse, ModelAuditResult)
│   │   └── services/
│   │       └── evaluator.py     # Groq Async API pipeline & socio-linguistic prompt
│   ├── .env                     # Environment variables (GROQ_API_KEY)
│   └── requirements.txt         # Backend Python dependencies
└── dashboard/                   # Next.js frontend application
    ├── src/
    │   ├── app/
    │   │   └── page.tsx         # Responsive interactive audit dashboard
    │   └── types/
    │       └── audit.ts         # TypeScript interfaces matching backend schemas
    ├── package.json
    └── tailwind.config.ts
```

## 🚀 Quick Start & Installation

### Prerequisites

Python 3.11+

Node.js 18+

Groq API Key


## 🚀 Local Development Setup

# 1. Clone Repository & Setup Backend

```Bash
git clone [https://github.com/your-username/cultural-bias-audit-engine.git](https://github.com/your-username/cultural-bias-audit-engine.git)
cd cultural-bias-audit-engine/cultural-bias-audit-engine-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_key_here" > .env

# Launch FastAPI development server
uvicorn app.main:app --reload --port 8000
```

# 2. Setup Frontend Dashboard
In a new terminal:
```Bash
cd cultural-bias-audit-engine/cultural-bias-audit-engine-frontend

# Install node modules
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)" > .env.local

# Start Next.js dev server
npm run dev
```