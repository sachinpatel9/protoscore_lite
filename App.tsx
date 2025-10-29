import React, { useState, useMemo } from 'react';
import { Protocol, ScoringResult, FeatureVector } from './types';
import { demoProtocols } from './data/demo_protocols';
import { calculatePcsScore, calculateBenchmark, getRiskProfile, calculateVectorScores } from './services/scoringService';
import { benchmarkDatabase } from './data/benchmark_database';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Button } from './components/Button';
import { BenchmarkModal } from './components/BenchmarkModal';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// As per guidelines, API key is in process.env.API_KEY.
// This requires the build environment to be configured to expose this variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insights, setInsights] = useState<string>('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);


  const handleSelectProtocol = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const protocolId = e.target.value;
    if (!protocolId) {
        setSelectedProtocol(null);
        return;
    }
    const protocol = demoProtocols.find(p => p.protocol_id === protocolId) || null;
    setSelectedProtocol(protocol);
    setScoringResult(null);
    setInsights('');
  };

  const handleCalculateScore = () => {
    if (!selectedProtocol) return;
    setIsLoading(true);

    const featureVector: FeatureVector = {
      complexity: selectedProtocol.complexity,
      patient_burden: selectedProtocol.patient_burden,
      site_burden: selectedProtocol.site_burden,
    };

    setTimeout(() => {
      const pcsScore = calculatePcsScore(featureVector);
      const benchmarkScore = calculateBenchmark(pcsScore, benchmarkDatabase);
      const riskProfile = getRiskProfile(pcsScore);
      const vectorScores = calculateVectorScores(featureVector);

      setScoringResult({
        pcsScore,
        benchmarkScore,
        riskProfile,
        vectorScores
      });
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  const handleReset = () => {
    setSelectedProtocol(null);
    setScoringResult(null);
    setInsights('');
    // Also reset the dropdown
    const select = document.getElementById('protocol-select') as HTMLSelectElement;
    if(select) select.value = '';
  };
  
  const generateInsights = async () => {
    if (!selectedProtocol || !scoringResult) return;
    setIsGeneratingInsights(true);
    setInsights('');

    const { pcsScore, riskProfile, vectorScores } = scoringResult;
    const { complexity, patient_burden, site_burden } = selectedProtocol;

    const prompt = `
      Analyze the following clinical trial protocol for complexity and provide actionable insights for simplification.
      The protocol has a Protocol Complexity Score (PCS) of ${pcsScore.toFixed(1)}, which is considered ${riskProfile.level}.

      Protocol Title: ${selectedProtocol.title}
      Study Type: ${selectedProtocol.study_type}, Phase: ${selectedProtocol.phase}

      Score Breakdown:
      - Complexity Score: ${vectorScores.complexityScore.toFixed(1)}
      - Patient Burden Score: ${vectorScores.patientBurdenScore.toFixed(1)}
      - Site Burden Score: ${vectorScores.siteBurdenScore.toFixed(1)}

      Key Feature Vectors:
      - Complexity: ${complexity.num_objectives} objectives, ${complexity.num_endpoints} endpoints, ${complexity.num_eligibility_criteria} eligibility criteria, ${complexity.num_countries} countries.
      - Patient Burden: ${patient_burden.num_visits} visits, ${patient_burden.num_procedures_per_visit} procedures/visit, invasive procedures: ${patient_burden.is_invasive_procedure}, ${patient_burden.num_patient_reported_outcomes} PROs.
      - Site Burden: ${site_burden.num_crf_pages} CRF pages, ${site_burden.num_data_points} data points, specialized equipment: ${site_burden.is_specialized_equipment_required}.

      Based on this data, provide a concise summary of the key complexity drivers. Then, list 3-5 specific, actionable recommendations to reduce the complexity score and mitigate risks.
      Format the output as a JSON object with two keys: "summary" (a string) and "recommendations" (an array of strings). Do not include any other text or markdown formatting.
    `;
    
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const text = response.text;
      setInsights(text);
    } catch (error) {
        console.error("Error generating insights:", error);
        setInsights('{"summary": "Failed to generate insights. Please try again.", "recommendations": []}');
    } finally {
        setIsGeneratingInsights(false);
    }
  };

  const parsedInsights = useMemo(() => {
    if (!insights) return null;
    try {
        // Gemini might return markdown with ```json ... ```, so we clean it up.
        const cleanJson = insights.replace(/```json\n|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse insights JSON:", e);
        return { summary: "Could not parse insights from AI. The format might be incorrect.", recommendations: [] };
    }
  }, [insights]);


  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans p-4 sm:p-8">
      <main className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                ProtoScore Lite
            </h1>
            <p className="text-slate-400">
                Leveraging AI to analyze and benchmark clinical trial protocols for operational efficiency.
            </p>
        </header>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-300 mb-4">Select a Demo Protocol to Analyze</h2>
             <select
                id="protocol-select"
                onChange={handleSelectProtocol}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                defaultValue=""
             >
                <option value="">-- Clear Selection --</option>
                {demoProtocols.map(p => (
                    <option key={p.protocol_id} value={p.protocol_id}>
                       {p.protocol_id} - {p.title}
                    </option>
                ))}
            </select>
        </div>

        {selectedProtocol && !scoringResult && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-slate-300 border-b border-slate-700 pb-2">Key Trial Design Features: <span className="text-purple-400">{selectedProtocol.protocol_id}</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Complexity Details */}
                    <div>
                        <h3 className="font-bold text-slate-400 mb-2">Complexity</h3>
                        <ul>
                            <li>Objectives: {selectedProtocol.complexity.num_objectives}</li>
                            <li>Endpoints: {selectedProtocol.complexity.num_endpoints}</li>
                            <li>Eligibility Criteria: {selectedProtocol.complexity.num_eligibility_criteria}</li>
                            <li>Countries: {selectedProtocol.complexity.num_countries}</li>
                        </ul>
                    </div>
                     {/* Patient Burden Details */}
                     <div>
                        <h3 className="font-bold text-slate-400 mb-2">Patient Burden</h3>
                         <ul>
                            <li>Visits: {selectedProtocol.patient_burden.num_visits}</li>
                            <li>Procedures / Visit: {selectedProtocol.patient_burden.num_procedures_per_visit}</li>
                            <li>Invasive: {selectedProtocol.patient_burden.is_invasive_procedure ? 'Yes' : 'No'}</li>
                            <li>PROs: {selectedProtocol.patient_burden.num_patient_reported_outcomes}</li>
                        </ul>
                    </div>
                     {/* Site Burden Details */}
                     <div>
                        <h3 className="font-bold text-slate-400 mb-2">Site Burden</h3>
                         <ul>
                            <li>CRF Pages: {selectedProtocol.site_burden.num_crf_pages}</li>
                            <li>Data Points: {selectedProtocol.site_burden.num_data_points}</li>
                            <li>Specialized Equipment: {selectedProtocol.site_burden.is_specialized_equipment_required ? 'Yes' : 'No'}</li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={handleCalculateScore} isLoading={isLoading}>
                        Run Assessment
                    </Button>
                </div>
            </div>
        )}

        {scoringResult && (
            <>
                <ResultsDisplay result={scoringResult} onBenchmark={() => setIsModalOpen(true)} onReset={handleReset} />
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-4">
                    <h2 className="text-xl font-semibold text-slate-300">Generative AI Insights</h2>
                    {!insights && !isGeneratingInsights && (
                        <div className="text-center">
                            <p className="text-slate-400 mb-4">Get actionable recommendations to simplify this protocol.</p>
                            <Button onClick={generateInsights} isLoading={isGeneratingInsights}>Generate Insights with Gemini</Button>
                        </div>
                    )}
                    {isGeneratingInsights && (
                         <div className="flex items-center justify-center text-slate-400">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Gemini is analyzing the protocol...</span>
                        </div>
                    )}
                    {parsedInsights && (
                        <div className="animate-fade-in-fast space-y-4">
                            <div>
                                <h3 className="font-bold text-purple-400">Summary</h3>
                                <p className="text-slate-300 mt-1">{parsedInsights.summary}</p>
                            </div>
                             <div>
                                <h3 className="font-bold text-purple-400">Recommendations</h3>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                                    {parsedInsights.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )}
        <BenchmarkModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            benchmarkData={benchmarkDatabase}
            currentScore={scoringResult?.pcsScore ?? 0}
        />
      </main>
      <footer className="text-center text-xs text-slate-600 pt-8">
        ProtoScore Lite v1.0
      </footer>
    </div>
  );
}

export default App;