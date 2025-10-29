import React from 'react';
import { BenchmarkProtocol } from '../types';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  benchmarkData: BenchmarkProtocol[];
  currentScore: number;
}

const getPhaseLabel = (phase: number | string) => {
    if (phase === 'N/A') return 'Observational';
    return `Phase ${phase}`;
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ isOpen, onClose, benchmarkData, currentScore }) => {
  if (!isOpen) return null;

  const scoresByPhase: Record<string, number[]> = benchmarkData.reduce((acc, p) => {
    const phaseKey = getPhaseLabel(p.phase);
    if (!acc[phaseKey]) {
      acc[phaseKey] = [];
    }
    acc[phaseKey].push(p.final_pcs_score);
    return acc;
  }, {} as Record<string, number[]>);

  const avgScoresByPhase = Object.entries(scoresByPhase).map(([phase, scores]) => ({
      phase,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length
  })).sort((a,b) => a.phase.localeCompare(b.phase));

  const maxAvgScore = Math.max(...avgScoresByPhase.map(p => p.avg), currentScore);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl p-8 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Benchmark Comparison</h2>

        <div className="space-y-4">
            <p className="text-slate-300">
                This chart compares your protocol's Protocol Complexity Score (PCS) against the average scores of similar studies in our benchmark database, categorized by study phase.
            </p>

            <div className="bg-slate-900/50 p-4 rounded-md space-y-3">
                {avgScoresByPhase.map(({ phase, avg }) => (
                    <div key={phase} className="flex items-center gap-4 text-sm">
                        <span className="w-28 text-slate-400 font-semibold">{phase}</span>
                        <div className="flex-1 bg-slate-700 rounded-full h-6">
                           <div className="bg-purple-600 h-6 rounded-full" style={{ width: `${(avg / maxAvgScore) * 100}%` }}></div>
                        </div>
                        <span className="w-12 text-right font-mono">{avg.toFixed(1)}</span>
                    </div>
                ))}
                 <div className="flex items-center gap-4 text-sm border-t-2 border-purple-500/50 pt-3 mt-3">
                    <span className="w-28 text-purple-300 font-bold">Your Protocol</span>
                    <div className="flex-1 bg-slate-700 rounded-full h-6">
                        <div className="bg-yellow-500 h-6 rounded-full" style={{ width: `${(currentScore / maxAvgScore) * 100}%` }}></div>
                    </div>
                    <span className="w-12 text-right font-mono font-bold text-yellow-300">{currentScore.toFixed(1)}</span>
                </div>
            </div>

            <p className="text-xs text-slate-500 text-center pt-2">
                Benchmark data is derived from {benchmarkData.length} historical protocols.
            </p>
        </div>

      </div>
    </div>
  );
};
