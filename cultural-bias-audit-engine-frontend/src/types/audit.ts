export interface SuggestedResponses {
  corporate: string;
  formal: string;
  informal: string;
}

export interface ModelAuditResult {
  model_name: string;
  linguistic_erasure_score: number;
  microaggression_score: number;
  bias_categories_detected: string[];
  detected_vernacular: string;
  analysis_summary: string;
  subtext_audit: string;
  suggested_responses: SuggestedResponses;
}

export interface AuditResponse {
  input_text: string;
  overall_risk_score: number;
  audits: ModelAuditResult[];
}