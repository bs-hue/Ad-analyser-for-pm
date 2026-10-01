'use client';

import React, { useState } from 'react';
import { ExperimentItem } from '@/lib/types';
import { 
  FlaskConical, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Award, 
  XCircle, 
  HelpCircle, 
  Flame,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExperimentTrackerProps {
  experiments: ExperimentItem[];
  onSaveExperiments: (updated: ExperimentItem[]) => void;
  clientId: string;
}

export const ExperimentTracker: React.FC<ExperimentTrackerProps> = ({
  experiments,
  onSaveExperiments,
  clientId
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Experiment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newVariable, setNewVariable] = useState<ExperimentItem['variable']>('Hook');
  const [newKpi, setNewKpi] = useState<ExperimentItem['kpi']>('CPL');
  const [newBaseline, setNewBaseline] = useState('₹140 CPL');
  const [newTarget, setNewTarget] = useState('< ₹100 CPL');

  const filteredExperiments = experiments.filter((exp) => {
    if (filterStatus !== 'ALL' && exp.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: ExperimentItem['status']) => {
    if (newStatus === 'Winner') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if confetti fails
      }
    }

    const updated = experiments.map((exp) => (exp.id === id ? { ...exp, status: newStatus } : exp));
    onSaveExperiments(updated);
  };

  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newHypothesis) return;

    const newExp: ExperimentItem = {
      id: `exp-${Date.now().toString(36)}`,
      clientId,
      title: newTitle,
      hypothesis: newHypothesis,
      variable: newVariable,
      kpi: newKpi,
      status: 'Planned',
      baselineMetric: newBaseline,
      targetMetric: newTarget,
      startDate: new Date().toISOString().split('T')[0]
    };

    onSaveExperiments([newExp, ...experiments]);
    setShowNewModal(false);
    setNewTitle('');
    setNewHypothesis('');
  };

  const getStatusBadge = (status: ExperimentItem['status']) => {
    switch (status) {
      case 'Winner':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="w-3 h-3 text-emerald-600" /> Winner
          </span>
        );
      case 'Running':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600 animate-spin" /> Running
          </span>
        );
      case 'Planned':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Planned
          </span>
        );
      case 'Loser':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Loser
          </span>
        );
      case 'Completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Needs Review
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Creative & Funnel Experiment Tracker</h3>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              {experiments.length} Total Tests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track structured hypotheses, variables, target metrics, and learnings over time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Running">Running</option>
            <option value="Winner">Winners</option>
            <option value="Planned">Planned</option>
            <option value="Completed">Completed</option>
            <option value="Loser">Losers</option>
          </select>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Experiment</span>
          </button>
        </div>
      </div>

      {/* Experiment List */}
      <div className="space-y-3">
        {filteredExperiments.map((exp) => (
          <div
            key={exp.id}
            className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 hover:bg-slate-50 transition space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-900">{exp.title}</span>
                <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  Variable: {exp.variable}
                </span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  KPI: {exp.kpi}
                </span>
              </div>

              {/* Status Picker */}
              <div className="flex items-center gap-2">
                {getStatusBadge(exp.status)}
                <select
                  value={exp.status}
                  onChange={(e) => handleStatusChange(exp.id, e.target.value as any)}
                  className="bg-white border border-slate-300 text-slate-800 text-[11px] font-semibold rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Planned">Set: Planned</option>
                  <option value="Running">Set: Running</option>
                  <option value="Winner">Set: Winner 🏆</option>
                  <option value="Loser">Set: Loser</option>
                  <option value="Completed">Set: Completed</option>
                  <option value="Needs Review">Set: Needs Review</option>
                </select>
              </div>
            </div>

            {/* Hypothesis */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px] uppercase">Hypothesis:</span>
              <p className="text-slate-700 italic">"{exp.hypothesis}"</p>
            </div>

            {/* Baseline vs Target */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
              <span>
                <strong>Baseline:</strong> {exp.baselineMetric}
              </span>
              <span>
                <strong>Target:</strong> {exp.targetMetric}
              </span>
              {exp.currentResult && (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Current Result: {exp.currentResult}
                </span>
              )}
              <span className="text-slate-400">Launched: {exp.startDate}</span>
            </div>

            {/* Learnings Log */}
            {exp.learnings && (
              <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg text-[11px] text-slate-700">
                <span className="font-bold text-blue-900 block mb-0.5">Verified Learnings:</span>
                <p>{exp.learnings}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Experiment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full mx-auto overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Launch New Growth Experiment</h4>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExperiment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Experiment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Problem Hook vs Contrarian Math Hook"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hypothesis</label>
                <textarea
                  rows={3}
                  required
                  placeholder="If we [change variable], we will achieve [target metric] because [reason]..."
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Variable</label>
                  <select
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                  >
                    <option value="Hook">Hook (0-3s)</option>
                    <option value="Visual Format">Visual Format</option>
                    <option value="Headline">Headline</option>
                    <option value="LP Headline">LP Headline</option>
                    <option value="Offer Framing">Offer Framing</option>
                    <option value="Audience">Audience</option>
                    <option value="CTA">CTA</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary KPI</label>
                  <select
                    value={newKpi}
                    onChange={(e) => setNewKpi(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                  >
                    <option value="CPL">CPL (Cost Per Lead)</option>
                    <option value="CPA">CPA (Cost Per Result)</option>
                    <option value="ROAS">ROAS</option>
                    <option value="CTR">Link CTR</option>
                    <option value="Conversion Rate">Conversion Rate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Baseline Metric</label>
                  <input
                    type="text"
                    value={newBaseline}
                    onChange={(e) => setNewBaseline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Goal</label>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-md text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
                >
                  Create Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
