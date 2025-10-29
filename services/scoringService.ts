import { FeatureVector, BenchmarkProtocol, ComplexityVector, PatientBurdenVector, SiteBurdenVector, RiskProfile } from '../types';

// --- Internal Weighting Configuration ---

const COMPLEXITY_WEIGHTS = {
  num_objectives: 2,
  num_endpoints: 2.5,
  num_eligibility_criteria: 1, // Reduced from 3 to prevent score inflation
  num_countries: 1.5,
};

const PATIENT_BURDEN_WEIGHTS = {
  num_visits: 3,
  num_procedures_per_visit: 2,
  is_invasive_procedure: 15,
  num_patient_reported_outcomes: 1,
};

const SITE_BURDEN_WEIGHTS = {
  num_crf_pages: 0.1,
  num_data_points: 0.01, // Reduced from 0.05 to prevent score inflation
  is_specialized_equipment_required: 10,
  num_investigators_per_site: 2,
};

const VECTOR_WEIGHTS = {
  complexity: 0.45,
  patient_burden: 0.35,
  site_burden: 0.20,
};

// --- Scoring Functions ---

const calculateVectorScore = <T extends object>(vector: T, weights: Record<keyof T, number>): number => {
  let score = 0;
  for (const key in vector) {
    const typedKey = key as keyof T;
    const value = vector[typedKey];
    if (typeof value === 'number') {
      score += value * weights[typedKey];
    } else if (typeof value === 'boolean') {
      score += (value ? 1 : 0) * weights[typedKey];
    }
  }
  return score;
};

export const calculateVectorScores = (featureVector: FeatureVector) => {
    const complexityScore = calculateVectorScore(featureVector.complexity, COMPLEXITY_WEIGHTS);
    const patientBurdenScore = calculateVectorScore(featureVector.patient_burden, PATIENT_BURDEN_WEIGHTS);
    const siteBurdenScore = calculateVectorScore(featureVector.site_burden, SITE_BURDEN_WEIGHTS);
    return { complexityScore, patientBurdenScore, siteBurdenScore };
};

export const calculatePcsScore = (featureVector: FeatureVector): number => {
  const { complexityScore, patientBurdenScore, siteBurdenScore } = calculateVectorScores(featureVector);

  const totalScore = 
    complexityScore * VECTOR_WEIGHTS.complexity +
    patientBurdenScore * VECTOR_WEIGHTS.patient_burden +
    siteBurdenScore * VECTOR_WEIGHTS.site_burden;
  
  // Scale the score to a 0-100 range
  return parseFloat(totalScore.toFixed(1));
};

export const calculateBenchmark = (rawScore: number, benchmarkData: BenchmarkProtocol[]): number => {
  if (benchmarkData.length === 0) {
    return 0;
  }
  const scores = benchmarkData.map(p => p.final_pcs_score);
  const scoresBelow = scores.filter(s => s < rawScore).length;
  const percentile = (scoresBelow / scores.length) * 100;

  return Math.round(percentile);
};

export const getRiskProfile = (score: number): RiskProfile => {
    if (score >= 70) { // Adjusted for 0-100 scale
        return { 
            level: 'Critical Risk', 
            classes: 'bg-red-900/50 text-red-300 border-red-700',
            explanation: 'This protocol exhibits a high degree of complexity, posing significant risks to timelines, budget, and patient recruitment. Immediate simplification is strongly recommended.'
        };
    }
    if (score >= 40) { // Adjusted for 0-100 scale
        return { 
            level: 'Medium Risk', 
            classes: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
            explanation: 'This protocol has moderate complexity. While manageable, certain aspects may introduce challenges. Review actionable insights to identify areas for optimization.'
        };
    }
    return { 
        level: 'Low Risk', 
        classes: 'bg-green-900/50 text-green-300 border-green-700',
        explanation: 'This protocol is well-structured with a low complexity profile. It is likely to proceed with minimal operational friction and high efficiency.'
    };
};