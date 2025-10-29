import React from 'react';
import { ScoringResult } from '../types';
import { Button } from './Button';

interface ResultsDisplayProps {
  result: ScoringResult | null;
  onBenchmark: () => void;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onBenchmark, onReset }) => {
  if (!result) return null;

  const { pcsScore, benchmarkScore, riskProfile, vectorScores } = result;

  const scoreColorClass = riskProfile.level === 'Critical Risk' ? 'text-red-400' :
                         riskProfile.level === 'Medium Risk' ? 'text-yellow-400' :
                         'text-green-400';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-300 mb-2">Protocol Complexity Score (PCS)</h2>
        <p className={`text-7xl font-mono font-bold tracking-tighter ${scoreColorClass}`}>{pcsScore.toFixed(1)}</p>
        <p className="text-sm text-slate-500 mt-1">(Score from 0 to 100, where 100 is the highest complexity)</p>
      </div>

      <div className={`p-4 rounded-lg border ${riskProfile.classes}`}>
        <p className="font-bold text-lg">{riskProfile.level}</p>
        <p className="text-sm mt-1">{riskProfile.explanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-4 rounded-md">
          <h3 className="text-slate-400 font-semibold mb-2">Score Breakdown</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Complexity:</strong> {vectorScores.complexityScore.toFixed(1)}</p>
            <p><strong>Patient Burden:</strong> {vectorScores.patientBurdenScore.toFixed(1)}</p>
            <p><strong>Site Burden:</strong> {vectorScores.siteBurdenScore.toFixed(1)}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-md">
          <h3 className="text-slate-400 font-semibold mb-2">Industry Benchmark</h3>
          <p className="text-3xl font-bold text-purple-400">{benchmarkScore}<span className="text-lg font-normal">%</span></p>
          <p className="text-xs text-slate-500">Your protocol is more complex than {benchmarkScore}% of similar studies in our database.</p>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 pt-4">
          <Button onClick={onBenchmark} variant="secondary">View Benchmark Details</Button>
          <Button onClick={onReset}>Analyze Another Protocol</Button>
      </div>
    </div>
  );
};