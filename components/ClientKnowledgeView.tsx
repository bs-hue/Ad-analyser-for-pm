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
  Layers,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  FileText,
  FlaskConical,
  MessageSquare
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
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestMetaConnection = async () => {
    if (!formData.metaAccountId || !formData.metaAccessToken) return;
    setIsTestingMeta(true);
    setMetaTestResult(null);
    try {
      const res = await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          adAccountId: formData.metaAccountId,
          accessToken: formData.metaAccessToken
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMetaTestResult({
          success: true,
          message: `✓ Connected: ${data.accountName} (${data.currency})`
        });
        setFormData(prev => ({ ...prev, metaConnected: true }));
      } else {
        setMetaTestResult({
          success: false,
          message: `✕ Error: ${data.error || 'Connection failed'}`
        });
      }
    } catch (err: any) {
      setMetaTestResult({
        success: false,
        message: `✕ Network error: ${err.message}`
      });
    } finally {
      setIsTestingMeta(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveClient(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <Building2 className="w-6 h-6 text-[#e2f976]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#141517]">{client.name} — Client Context & Knowledge Base</h3>
              <span className="text-[10px] font-black bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                Persistent Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The AI reasoning engine strictly adheres to these brand tone rules, customer objections, and claim boundaries.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full font-black text-xs shadow-sm transition"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-[#e2f976]" />}
          <span>{isSaved ? 'Changes Saved!' : 'Save Knowledge Base'}</span>
        </button>
      </div>

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Business Info */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
          <h4 className="font-extrabold text-sm text-[#141517] border-b border-[#f4f5f2] pb-3">Business & Offer Foundation</h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Business / Brand Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Website URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Product / Service</label>
            <input
              type="text"
              value={formData.productService}
              onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Main Front-End Offer</label>
            <textarea
              rows={2}
              value={formData.mainOffer}
              onChange={(e) => setFormData({ ...formData, mainOffer: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Target Audience & Geographies</label>
            <textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>
        </div>

        {/* Brand Tone, Claims & Objections */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
          <h4 className="font-extrabold text-sm text-[#141517] border-b border-[#f4f5f2] pb-3">Positioning & Anti-Hallucination Guardrails</h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Brand Voice & Tone</label>
            <input
              type="text"
              value={formData.brandTone}
              onChange={(e) => setFormData({ ...formData, brandTone: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Core Unique Selling Proposition (USP)</label>
            <textarea
              rows={2}
              value={formData.usp}
              onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
              className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
            />
          </div>

          <div>
            <label className="font-bold text-emerald-800 block mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Approved Proof Claims
            </label>
            <textarea
              rows={2}
              value={formData.approvedClaims.join('\n')}
              onChange={(e) => setFormData({ ...formData, approvedClaims: e.target.value.split('\n') })}
              className="w-full bg-emerald-50/20 border border-emerald-200 rounded-2xl p-3 text-slate-900 font-semibold focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="font-bold text-rose-800 block mb-1.5 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Restricted / Forbidden Claims
            </label>
            <textarea
              rows={2}
              value={formData.restrictedClaims.join('\n')}
              onChange={(e) => setFormData({ ...formData, restrictedClaims: e.target.value.split('\n') })}
              className="w-full bg-rose-50/20 border border-rose-200 rounded-2xl p-3 text-slate-900 font-semibold focus:border-rose-600"
            />
          </div>
        </div>

        {/* Client-Specific Meta Ads Manager API Integration */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f4f5f2] gap-2">
            <div>
              <h4 className="font-extrabold text-sm text-[#141517] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                Meta Ads Manager API Connection (Client-Specific)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Each client has their own dedicated Meta Ad Account and Access Token stored securely in their profile.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                formData.metaConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {formData.metaConnected ? '● Meta Connected' : '○ Not Connected'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Meta Ad Account ID</label>
              <input
                type="text"
                placeholder="act_123456789012345"
                value={formData.metaAccountId || ''}
                onChange={(e) => setFormData({ ...formData, metaAccountId: e.target.value, metaConnected: Boolean(e.target.value) })}
                className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Found in Meta Ads Manager URL or Account Overview</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Meta System User / Access Token</label>
              <div className="relative">
                <input
                  type={showMetaToken ? 'text' : 'password'}
                  placeholder="EAAB..."
                  value={formData.metaAccessToken || ''}
                  onChange={(e) => setFormData({ ...formData, metaAccessToken: e.target.value, metaConnected: Boolean(formData.metaAccountId && e.target.value) })}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 pr-10 text-slate-900 font-semibold focus:border-[#141517]"
                />
                <button
                  type="button"
                  onClick={() => setShowMetaToken(!showMetaToken)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showMetaToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">System User token generated from Meta Business Manager</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Target Acquisition Cost (CPA)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="500"
                  value={formData.targetCpa || ''}
                  onChange={(e) => setFormData({ ...formData, targetCpa: Number(e.target.value) || undefined })}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Threshold used to flag winning vs bleeding ad sets</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Google Drive Creative Folder URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.driveCreativeFolderUrl || ''}
                onChange={(e) => setFormData({ ...formData, driveCreativeFolderUrl: e.target.value })}
                className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Folder containing raw video ads for instant 720p teardowns</span>
            </div>
          </div>

          {/* Test Connection Button & Status */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbfcfb] p-3.5 rounded-2xl border border-[#eef0ec]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestMetaConnection}
                disabled={isTestingMeta || !formData.metaAccountId || !formData.metaAccessToken}
                className="px-4 py-2 bg-[#141517] hover:bg-black text-white text-xs font-bold rounded-full transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isTestingMeta ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <span>Test Connection</span>
                )}
              </button>
              {metaTestResult && (
                <span className={`text-xs font-semibold ${metaTestResult.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {metaTestResult.message}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              Credentials are saved per client in your local agency database.
            </span>
          </div>
        </div>

        {/* Direct-Response Copy Vault (Extracted from Workbook or Entered Manually) */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-5 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f4f5f2] gap-2">
            <div>
              <h4 className="font-extrabold text-sm text-[#141517] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#141517]" />
                Direct-Response Ad Copy Vault & Audience Insights
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Real client winning copy blocks, angles, headlines, and demographic observations extracted from your audit sheet.
              </p>
            </div>
            <span className="text-[10px] font-black bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
              {(formData.primaryTexts?.length || 0)} Copies • {(formData.headlines?.length || 0)} Headlines
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Primary Texts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  Primary Text / Ad Angles (Hinglish / English)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    primaryTexts: [...(formData.primaryTexts || []), '']
                  })}
                  className="text-[11px] font-bold text-[#141517] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Variation
                </button>
              </div>

              {(formData.primaryTexts && formData.primaryTexts.length > 0) ? (
                formData.primaryTexts.map((text, idx) => (
                  <div key={idx} className="relative group">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Variation #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(formData.primaryTexts || [])];
                          updated.splice(idx, 1);
                          setFormData({ ...formData, primaryTexts: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={text}
                      onChange={(e) => {
                        const updated = [...(formData.primaryTexts || [])];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, primaryTexts: updated });
                      }}
                      className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-medium text-xs leading-relaxed focus:border-[#141517]"
                      placeholder="Paste primary ad body copy..."
                    />
                  </div>
                ))
              ) : (
                <div className="bg-[#fbfcfb] border border-dashed border-[#eef0ec] rounded-2xl p-4 text-center text-slate-400 text-xs">
                  No primary text loaded. Upload an agency workbook (with an Assets tab) or click "Add Variation".
                </div>
              )}
            </div>

            {/* Headlines, CTA & Audience Insights */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800">Direct-Response Headlines</label>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      headlines: [...(formData.headlines || []), '']
                    })}
                    className="text-[11px] font-bold text-[#141517] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Headline
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.headlines && formData.headlines.length > 0) ? (
                    formData.headlines.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => {
                            const updated = [...(formData.headlines || [])];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, headlines: updated });
                          }}
                          className="flex-1 bg-[#fbfcfb] border border-[#eef0ec] rounded-xl px-3 py-2 text-slate-900 font-semibold text-xs focus:border-[#141517]"
                          placeholder="Headline..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(formData.headlines || [])];
                            updated.splice(idx, 1);
                            setFormData({ ...formData, headlines: updated });
                          }}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs italic">No headlines configured.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Default Call to Action (CTA)</label>
                <input
                  type="text"
                  value={formData.ctas?.[0] || 'Order Now'}
                  onChange={(e) => setFormData({ ...formData, ctas: [e.target.value] })}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:border-[#141517]"
                  placeholder="e.g. Order Now, Get Report, Learn More"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Audience & Demographic Performance Notes</label>
                <textarea
                  rows={3}
                  value={formData.audienceInsights || ''}
                  onChange={(e) => setFormData({ ...formData, audienceInsights: e.target.value })}
                  placeholder="e.g. Winner : Open | 23-65+ | All genders | Performing gender: MALE (70-80% conversions)"
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-medium text-xs focus:border-[#141517]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Historical Testing & Learnings Memory */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f4f5f2] gap-2">
            <div>
              <h4 className="font-extrabold text-sm text-[#141517] flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#141517]" />
                Past Testing & Learnings Memory
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Validated agency experiment memory extracted from sheet "Past Testing & Learning".
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const current = formData.pastLearnings || [];
                setFormData({
                  ...formData,
                  pastLearnings: [...current, { test: 'New Hypothesized Test', learning: 'Outcome observed' }]
                });
              }}
              className="text-xs font-bold bg-[#f4f5f2] hover:bg-[#eef0ec] text-[#141517] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Historical Test
            </button>
          </div>

          <div className="space-y-2.5">
            {(formData.pastLearnings && formData.pastLearnings.length > 0) ? (
              formData.pastLearnings.map((item, idx) => (
                <div key={idx} className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.test}
                        onChange={(e) => {
                          const updated = [...(formData.pastLearnings || [])];
                          updated[idx] = { ...updated[idx], test: e.target.value };
                          setFormData({ ...formData, pastLearnings: updated });
                        }}
                        className="bg-transparent font-bold text-xs text-[#141517] flex-1 focus:outline-none border-b border-transparent focus:border-[#141517]"
                        placeholder="Test hypothesis..."
                      />
                    </div>
                    <div className="pl-7">
                      <input
                        type="text"
                        value={item.learning || ''}
                        onChange={(e) => {
                          const updated = [...(formData.pastLearnings || [])];
                          updated[idx] = { ...updated[idx], learning: e.target.value };
                          setFormData({ ...formData, pastLearnings: updated });
                        }}
                        className="bg-transparent text-xs text-slate-600 font-medium w-full focus:outline-none border-b border-transparent focus:border-slate-300"
                        placeholder="Learning / Result..."
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(formData.pastLearnings || [])];
                      updated.splice(idx, 1);
                      setFormData({ ...formData, pastLearnings: updated });
                    }}
                    className="text-slate-400 hover:text-rose-600 self-end md:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic">No historical test learnings recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
