from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.audit import AuditResponse
from app.services.evaluator import audit_text_pipeline

app = FastAPI(
    title="Cultural Bias & Representation Audit API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Audit Engine Active"}

@app.post("/api/audit/text", response_model=AuditResponse)
async def audit_text(text: str = Form(...)):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
    
    try:
        results = await audit_text_pipeline(text)
        overall_risk = sum(r.microaggression_score + r.linguistic_erasure_score for r in results) / (len(results) * 2)
        
        return AuditResponse(
            input_text=text,
            audits=results,
            overall_risk_score=round(overall_risk, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))