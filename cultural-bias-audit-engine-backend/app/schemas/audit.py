from pydantic import BaseModel, Field
from typing import List, Optional

class SettingResponses(BaseModel):
    corporate: str = Field(description="HR-safe, objective, boundary-setting response.")
    formal: str = Field(description="Academic or formal framing using systemic terminology.")
    informal: str = Field(description="Direct, peer-to-peer response.")

class ModelAuditResult(BaseModel):
    model_name: str
    linguistic_erasure_score: float = Field(ge=0.0, le=10.0, description="0 = No erasure, 10 = Severe erasure")
    microaggression_score: float = Field(ge=0.0, le=10.0, description="0 = No bias, 10 = Explicit/Severe bias")
    bias_categories_detected: List[str] = Field(description="List of detected biases e.g., Tone Policing, Stereotype Projection")
    detected_vernacular: Optional[str] = Field(default="Standard American English")
    analysis_summary: str
    subtext_audit: str = Field(description="The underlying assumption or implicit bias behind the statement.")
    suggested_responses: SettingResponses

class AuditResponse(BaseModel):
    input_text: str
    audits: List[ModelAuditResult]
    overall_risk_score: float