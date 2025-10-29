import { Protocol } from '../types';

export const demoProtocols: Protocol[] = [
  {
    protocol_id: 'NIVO-LUNG-001',
    title: 'Phase 3 Study of Nivolumab in Combination with Chemotherapy for Advanced NSCLC',
    sponsor: 'OncoPharm',
    study_type: 'Interventional',
    phase: 3,
    complexity: {
      num_objectives: 4,
      num_endpoints: 6,
      num_eligibility_criteria: 35,
      num_countries: 25,
    },
    patient_burden: {
      num_visits: 20,
      num_procedures_per_visit: 5,
      is_invasive_procedure: true,
      num_patient_reported_outcomes: 4,
    },
    site_burden: {
      num_crf_pages: 200,
      num_data_points: 5000,
      is_specialized_equipment_required: true,
      num_investigators_per_site: 4,
    }
  },
  {
    protocol_id: 'HER2-BR-002',
    title: 'A Study of Adjuvant Trastuzumab for HER2+ Breast Cancer',
    sponsor: 'FemmeTherapeutics',
    study_type: 'Interventional',
    phase: 3,
    complexity: {
      num_objectives: 2,
      num_endpoints: 3,
      num_eligibility_criteria: 22,
      num_countries: 18,
    },
    patient_burden: {
      num_visits: 15,
      num_procedures_per_visit: 3,
      is_invasive_procedure: false,
      num_patient_reported_outcomes: 3,
    },
    site_burden: {
      num_crf_pages: 120,
      num_data_points: 2500,
      is_specialized_equipment_required: false,
      num_investigators_per_site: 3,
    }
  },
    {
    protocol_id: 'AML-LEUK-003',
    title: 'A Phase 1/2 Study of Novel Agent AZD-556 in Relapsed/Refractory AML',
    sponsor: 'HemaInnovate',
    study_type: 'Interventional',
    phase: 1,
    complexity: {
      num_objectives: 5,
      num_endpoints: 10,
      num_eligibility_criteria: 40,
      num_countries: 10,
    },
    patient_burden: {
      num_visits: 25,
      num_procedures_per_visit: 8,
      is_invasive_procedure: true,
      num_patient_reported_outcomes: 2,
    },
    site_burden: {
      num_crf_pages: 250,
      num_data_points: 6000,
      is_specialized_equipment_required: true,
      num_investigators_per_site: 5,
    }
  },
  {
    protocol_id: 'BRAF-MEL-004',
    title: 'Observational Registry for BRAF V600-Mutant Melanoma Patients',
    sponsor: 'Dermacology Inc.',
    study_type: 'Observational',
    phase: 'N/A',
    complexity: {
      num_objectives: 2,
      num_endpoints: 2,
      num_eligibility_criteria: 15,
      num_countries: 12,
    },
    patient_burden: {
      num_visits: 6,
      num_procedures_per_visit: 1,
      is_invasive_procedure: false,
      num_patient_reported_outcomes: 3,
    },
    site_burden: {
      num_crf_pages: 40,
      num_data_points: 800,
      is_specialized_equipment_required: false,
      num_investigators_per_site: 2,
    }
  },
  {
    protocol_id: 'ENZA-PROS-005',
    title: 'A Phase 4 Study of Enzalutamide in Metastatic Castration-Resistant Prostate Cancer',
    sponsor: 'UroGen',
    study_type: 'Interventional',
    phase: 4,
    complexity: {
      num_objectives: 2,
      num_endpoints: 4,
      num_eligibility_criteria: 20,
      num_countries: 15,
    },
    patient_burden: {
      num_visits: 10,
      num_procedures_per_visit: 3,
      is_invasive_procedure: false,
      num_patient_reported_outcomes: 6,
    },
    site_burden: {
      num_crf_pages: 80,
      num_data_points: 1500,
      is_specialized_equipment_required: false,
      num_investigators_per_site: 2,
    }
  },
  {
    protocol_id: 'GBM-RAD-006',
    title: 'Phase 2 Trial of Radiotherapy plus Concurrent and Adjuvant Temozolomide for Glioblastoma',
    sponsor: 'Neuro-Oncology Associates',
    study_type: 'Interventional',
    phase: 2,
    complexity: {
      num_objectives: 3,
      num_endpoints: 5,
      num_eligibility_criteria: 30,
      num_countries: 8,
    },
    patient_burden: {
      num_visits: 18,
      num_procedures_per_visit: 6,
      is_invasive_procedure: true,
      num_patient_reported_outcomes: 3,
    },
    site_burden: {
      num_crf_pages: 180,
      num_data_points: 4500,
      is_specialized_equipment_required: true,
      num_investigators_per_site: 4,
    }
  }
];
