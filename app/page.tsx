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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">Performance Marketing Intelligence</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  SaaS Platform
                </span>
              </div>
              <p className="text-xs text-slate-500">Multimodal Funnel & Creative Diagnostic Agent for Media Buyers</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-8 py-10 w-full flex-1 space-y-8">
        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Client Workspaces</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analyze Funnels, Creatives & ROAS With Claude Engine
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect Meta Ads MCP or upload raw performance spreadsheets. The AI cross-examines ad metrics, Google Drive video hooks, landing page promises, and 60-day historical memory before formulating your prioritized 7-day action plan.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs flex-shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Workspaces</span>
              <span className="text-xl font-extrabold text-slate-900">{clients.length} Clients</span>
            </div>
            <div className="pl-4 border-l border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Reasoning Core</span>
              <span className="text-sm font-bold text-blue-700">Claude 3.5 Sonnet</span>
            </div>
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Select Client Workspace</h2>
            <span className="text-xs text-slate-500">Benchmark demo data included</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    {c.metaConnected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Meta Connected
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Manual / CSV Mode
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">{c.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-2">{c.businessName}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{c.productService}</p>
                </div>

                {/* Metadata & CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="block text-slate-400">Last Analysis:</span>
                      <span className="font-semibold text-slate-800">{c.lastAnalysisDate || '18 Sep 2026'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Active Experiments:</span>
                      <span className="font-semibold text-blue-700">{c.activeExperimentsCount} Tests</span>
                    </div>
                  </div>

                  <Link
                    href={`/client/${c.id}`}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Open Client Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-xs text-slate-400">
        Performance Marketing Intelligence Platform • Built for High-Growth Media Buyers & Performance Agencies
      </footer>

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
