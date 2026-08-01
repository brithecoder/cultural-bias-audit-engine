import os
import json
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq
from app.schemas.audit import ModelAuditResult


load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is not set. Please check your .env file.")

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_AUDIT_PROMPT = """
You are an expert socio-linguist specializing in Responsible AI, African-American Vernacular English (AAVE), Pan-African history, implicit bias, and workplace microaggressions.

Analyze the input text for:
1. Microaggressions & Stereotype Projection: Implicit assumptions about educational access, socioeconomic status, competence, or communication style based on identity.
2. Linguistic Erasure: Over-correcting or penalizing valid dialectal variation (e.g., AAVE) into Standard American English.
3. Pragmatic Intent & Subtext: What implicit assumption is being made by the speaker?

Generate tactical responses across three distinct registers:
- Corporate: Professional, HR-safe, metrics-focused, de-escalating while setting clear boundaries.
- Formal: Academic, analytical, referencing systemic communication patterns.
- Informal: Direct, peer-to-peer, boundary-asserting.

Output strictly valid JSON matching the requested schema fields.
"""

async def run_single_model_audit(input_text: str, model_name: str = "llama-3.3-70b-versatile") -> ModelAuditResult:
    response = await client.chat.completions.create(
        model=model_name,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_AUDIT_PROMPT},
            {"role": "user", "content": f"Analyze this input text:\n\n\"{input_text}\"\n\nReturn JSON with: model_name, linguistic_erasure_score (0.0-10.0), microaggression_score (0.0-10.0), bias_categories_detected (list of strings), detected_vernacular, analysis_summary, subtext_audit, and suggested_responses (corporate, formal, informal)."}
        ],
        temperature=0.2,
    )
    
    raw_content = response.choices[0].message.content
    data = json.loads(raw_content)
    data["model_name"] = model_name
    return ModelAuditResult(**data)

async def audit_text_pipeline(input_text: str, models: list = None) -> list[ModelAuditResult]:
    if not models:
        # We can compare the 70B versatile model against the smaller 8B instant model!
        models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
    
    tasks = [run_single_model_audit(input_text, model) for model in models]
    return await asyncio.gather(*tasks)