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
    <div className="bg-white border border-[#eef0ec] rounded-[32px] p-7 shadow-2xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f4f5f2]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
            <FlaskConical className="w-5 h-5 text-[#e2f976]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#141517]">Creative & Funnel Experiment Tracker</h3>
              <span className="text-xs font-bold bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                {experiments.length} Total Tests
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track structured hypotheses, variables, target metrics, and learnings over time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#fbfcfb] border border-[#eef0ec] text-slate-800 rounded-full px-4 py-2 font-bold focus:outline-none cursor-pointer"
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
            className="flex items-center gap-2 px-5 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full font-black text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#e2f976]" />
            <span>New Experiment</span>
          </button>
        </div>
      </div>

      {/* Experiment List */}
      <div className="space-y-4">
        {filteredExperiments.map((exp) => (
          <div
            key={exp.id}
            className="border border-[#eef0ec] rounded-[24px] p-5 bg-[#fbfcfb] hover:bg-white transition space-y-3.5 text-xs shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-extrabold text-[#141517]">{exp.title}</span>
                <span className="text-[10px] font-bold bg-[#f4f5f2] text-slate-700 px-3 py-1 rounded-full">
                  Variable: {exp.variable}
                </span>
                <span className="text-[10px] font-black bg-[#e2f976]/30 text-[#141517] px-3 py-1 rounded-full border border-[#e2f976]">
                  KPI: {exp.kpi}
                </span>
              </div>

              {/* Status Picker */}
              <div className="flex items-center gap-2">
                {getStatusBadge(exp.status)}
                <select
                  value={exp.status}
                  onChange={(e) => handleStatusChange(exp.id, e.target.value as any)}
                  className="bg-white border border-[#eef0ec] text-slate-800 text-[11px] font-bold rounded-full px-3 py-1 focus:outline-none cursor-pointer"
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
            <div className="bg-white p-3.5 rounded-2xl border border-[#eef0ec] space-y-1">
              <span className="font-extrabold text-[#141517] block text-[10px] uppercase tracking-wider">Hypothesis:</span>
              <p className="text-slate-700 italic leading-relaxed">"{exp.hypothesis}"</p>
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
                <span className="text-emerald-800 font-extrabold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Current Result: {exp.currentResult}
                </span>
              )}
              <span className="text-slate-400">Launched: {exp.startDate}</span>
            </div>

            {/* Learnings Log */}
            {exp.learnings && (
              <div className="bg-[#e2f976]/15 border border-[#e2f976] p-3 rounded-2xl text-[11px] text-[#141517]">
                <span className="font-extrabold block mb-0.5">Verified Learnings:</span>
                <p className="leading-relaxed">{exp.learnings}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Experiment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-lg w-full mx-auto overflow-hidden">
            <div className="bg-white border-b border-[#f4f5f2] px-7 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                  <FlaskConical className="w-5 h-5 text-[#e2f976]" />
                </div>
                <h4 className="font-extrabold text-base text-[#141517]">Launch New Growth Experiment</h4>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-9 h-9 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExperiment} className="p-7 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Experiment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Problem Hook vs Contrarian Math Hook"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Hypothesis</label>
                <textarea
                  rows={3}
                  required
                  placeholder="If we [change variable], we will achieve [target metric] because [reason]..."
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Variable</label>
                  <select
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value as any)}
                    className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
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
                  <label className="font-bold text-slate-700 block mb-1.5">Primary KPI</label>
                  <select
                    value={newKpi}
                    onChange={(e) => setNewKpi(e.target.value as any)}
                    className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
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
                  <label className="font-bold text-slate-700 block mb-1.5">Baseline Metric</label>
                  <input
                    type="text"
                    value={newBaseline}
                    onChange={(e) => setNewBaseline(e.target.value)}
                    className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Target Goal</label>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#f4f5f2]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-2.5 bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-800 rounded-full font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full font-black shadow-sm transition"
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
