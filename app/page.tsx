'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getStoredClients, 
  saveClientProfile 
} from '@/lib/storage';
import { ClientProfile } from '@/lib/types';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  FlaskConical, 
  ArrowRight, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function HomePage() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newOffer, setNewOffer] = useState('');

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newBusinessName) return;

    const newClient: ClientProfile = {
      id: `client-${Date.now().toString(36)}`,
      name: newClientName,
      businessName: newBusinessName,
      website: newWebsite || 'https://example.com',
      productService: newProduct || 'Core Product / Service',
      mainOffer: newOffer || 'Free Initial Discovery Call',
      targetAudience: 'Growth Founders & Digital Buyers',
      geography: 'India, US, UK',
      usp: 'High converting customer acquisition framework',
      painPoints: ['Rising CAC and ad fatigue'],
      desires: ['Scale ad spend profitably above 3.5x ROAS'],
      customerObjections: ['Will this work in our niche?'],
      competitors: ['Market leaders in category'],
      brandTone: 'Professional, Direct, Data-Driven',
      approvedClaims: ['Proven framework across active ad spend'],
      restrictedClaims: ['No unverified income claims'],
      metaConnected: false,
      lastAnalysisDate: new Date().toISOString().split('T')[0],
      activeExperimentsCount: 0,
      currency: 'INR'
    };

    saveClientProfile(newClient);
    setClients(getStoredClients());
    setShowAddClientModal(false);
    setNewClientName('');
    setNewBusinessName('');
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfcfb] text-[#121316] font-sans p-6 sm:p-10 lg:p-12 flex justify-center items-start">
      {/* Main Container */}
      <div className="w-full max-w-7xl bg-white rounded-[32px] border border-neutral-200/80 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecefec] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-[#e2f976]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#121316] text-lg tracking-tight font-display">Antigravity Intelligence</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#e2f976] text-[#121316] shadow-sm">
                  Agency OS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Multimodal Funnel & Creative Diagnostic Agent for Media Buyers</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#121316] hover:bg-black text-white rounded-full text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>

        {/* Hero Section with Inline Pill Badges */}
        <div className="bg-[#f0f3f0] border border-[#e2e7e2] rounded-[30px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#121316] tracking-tight font-display flex flex-wrap items-center gap-2">
              <span>Managing</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300/80 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Your Clients
              </span>
              <span>and</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e2f976] text-[#121316] rounded-full text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#121316]" />
                Creative Workflows
              </span>
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Upload raw agency multi-tab Excel workbooks or connect Meta Ads. The agent deterministically audits unit economics, downloads public Drive video ads to 720p, runs multimodal vision teardowns, and produces prioritized 7-day action playbooks.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white border border-[#e2e7e2] p-4 rounded-2xl text-xs flex-shrink-0 shadow-sm">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Workspaces</span>
              <span className="text-2xl font-extrabold text-[#121316] font-display">{clients.length} Clients</span>
            </div>
            <div className="pl-4 border-l border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Reasoning Core</span>
              <span className="text-xs font-extrabold text-[#121316] bg-[#e2f976] px-2 py-0.5 rounded-full inline-block mt-0.5">
                Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>

        {/* Client Workspaces Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Select Client Workspace</h2>
            <span className="text-xs text-slate-500 font-medium">Multi-tab agency audits supported</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-[#e2e7e2] rounded-[28px] p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between space-y-5 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#f0f3f0] group-hover:bg-[#e2f976] text-[#121316] flex items-center justify-center font-extrabold text-sm transition">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    {c.metaConnected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Meta Connected
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f0f3f0] text-slate-700 border border-slate-200">
                        Excel / Agency Mode
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-lg text-[#121316] tracking-tight font-display">{c.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-1">{c.businessName}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{c.productService}</p>
                </div>

                {/* Metadata & CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                    <div>
                      <span className="block text-slate-400">Offer / Pricing:</span>
                      <span className="font-bold text-slate-900">{c.pricing || c.mainOffer || '₹499'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Past Tests:</span>
                      <span className="font-bold text-slate-900">{c.pastLearnings?.length || 9} Learnings</span>
                    </div>
                  </div>

                  <Link
                    href={`/client/${c.id}`}
                    className="w-full py-2.5 bg-[#121316] hover:bg-black text-white font-bold rounded-full text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">Create Client Workspace</h3>
            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Client Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GrowthLabs Tech"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://growthlabs.io"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
