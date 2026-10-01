'use client';

import React, { useState } from 'react';
import { ClientProfile } from '@/lib/types';
import { 
  Building2, 
  Globe, 
  Target, 
  ShieldCheck, 
  AlertOctagon, 
  Save, 
  Check, 
  Users, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ClientKnowledgeViewProps {
  client: ClientProfile;
  onSaveClient: (updated: ClientProfile) => void;
}

export const ClientKnowledgeView: React.FC<ClientKnowledgeViewProps> = ({
  client,
  onSaveClient
}) => {
  const [formData, setFormData] = useState<ClientProfile>(client);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveClient(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{client.name} — Client Context & Knowledge Base</h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Persistent Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              The AI reasoning engine strictly adheres to these brand tone rules, customer objections, and claim boundaries.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Changes Saved!' : 'Save Knowledge Base'}</span>
        </button>
      </div>

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Business Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Business & Offer Foundation</h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Business / Brand Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product / Service</label>
            <input
              type="text"
              value={formData.productService}
              onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Front-End Offer</label>
            <textarea
              rows={2}
              value={formData.mainOffer}
              onChange={(e) => setFormData({ ...formData, mainOffer: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Audience & Geographies</label>
            <textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>
        </div>

        {/* Brand Tone, Claims & Objections */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Positioning & Anti-Hallucination Guardrails</h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Brand Voice & Tone</label>
            <input
              type="text"
              value={formData.brandTone}
              onChange={(e) => setFormData({ ...formData, brandTone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Core Unique Selling Proposition (USP)</label>
            <textarea
              rows={2}
              value={formData.usp}
              onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Approved Proof Claims
            </label>
            <textarea
              rows={2}
              value={formData.approvedClaims.join('\n')}
              onChange={(e) => setFormData({ ...formData, approvedClaims: e.target.value.split('\n') })}
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-md p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-rose-800 block mb-1 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              Restricted / Forbidden Claims
            </label>
            <textarea
              rows={2}
              value={formData.restrictedClaims.join('\n')}
              onChange={(e) => setFormData({ ...formData, restrictedClaims: e.target.value.split('\n') })}
              className="w-full bg-rose-50/30 border border-rose-200 rounded-md p-2 text-slate-900"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
