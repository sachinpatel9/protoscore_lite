export interface ComplexityVector {
  num_objectives: number;
  num_endpoints: number;
  num_eligibility_criteria: number;
  num_countries: number;
}

export interface PatientBurdenVector {
  num_visits: number;
  num_procedures_per_visit: number;
  is_invasive_procedure: boolean;
  num_patient_reported_outcomes: number;
}

export interface SiteBurdenVector {
  num_crf_pages: number;
  num_data_points: number;
  is_specialized_equipment_required: boolean;
  num_investigators_per_site: number;
}

export interface FeatureVector {
  complexity: ComplexityVector;
  patient_burden: PatientBurdenVector;
  site_burden: SiteBurdenVector;
}

export interface BenchmarkProtocol {
  protocol_id: string;
  study_type: 'Interventional' | 'Observational';
  phase: number | 'N/A';
  final_pcs_score: number;
}

export interface RiskProfile {
  level: 'Critical Risk' | 'Medium Risk' | 'Low Risk';
  classes: string;
  explanation: string;
}

export interface Protocol extends FeatureVector {
  protocol_id: string;
  title: string;
  sponsor: string;
  study_type: 'Interventional' | 'Observational';
  phase: number | 'N/A';
}

export interface ScoringResult {
    pcsScore: number;
    benchmarkScore: number;
    riskProfile: RiskProfile;
    vectorScores: {
        complexityScore: number;
        patientBurdenScore: number;
        siteBurdenScore: number;
    };
}
