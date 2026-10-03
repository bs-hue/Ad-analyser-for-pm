# Product Requirements Document (PRD)

## Performance Marketing Intelligence Agent

A production-ready web application engineered for performance marketers. The platform ingests 7-day campaign metrics, multimedia creatives, ad copy, and post-click landing page experiences, leveraging Claude to perform full-funnel diagnoses and generate data-backed creative iterations.

### 1\. Core User Flow

\[Select Client\]   
       │  
       ▼  
\[Set Window: 7D / 14D / 30D / Custom\]  
       │  
       ▼  
\[Data Ingestion: Upload Performance CSV/XLSX/Sheets\]  
       │  
       ▼  
\[Asset Ingestion: Creative Uploads/URLs \+ Metadata\]  
       │  
       ▼  
\[Context & LP: Landing Page URL/DOM \+ Campaign Context\]  
       │  
       ▼  
\[Trigger: "Analyze Funnel"\] ──► \[Claude Deep Diagnostic Engine\]  
       │  
       ▼  
\[Interactive Performance Dashboard & CRO Audit\]  
       │  
       ▼  
\[AI Copywriter & Creative Iteration Suite\]

* **Client Context:** Select an existing client profile or initialize a new brand workspace.  
* **Analysis Period:** Select presets (**Last 7 Days**, **Last 14 Days**, **Last 30 Days**) or configure a **Custom Date Range**.  
* **Performance Data:** Import campaign performance logs via direct spreadsheet upload or Sheets URL.  
* **Creative Library:** Supply ad visual assets (images, video files, ad library screenshots) with accompanying structural metadata.  
* **Landing Page Ingestion:** Input landing page URL, paste raw DOM/text, or provide full-viewport screenshots.  
* **Campaign Guardrails:** Supply contextual guidance (target CPA, current focus, inventory constraints).  
* **Execution:** Trigger full-funnel audit.  
* **Output:** Render interactive diagnostics and generate targeted creative variations.

### 2\. Client Dashboard

A clean, high-density light-theme control panel prioritizing clarity and minimal cognitive overhead.

* **Top Navigation Bar:**  
  * **Client Selector:** Workspace switcher (e.g., Ankit Batra).  
  * **Analysis Period Dropdown:** Active time-window selector.  
* **Contextual Metadata Strip:**  
  * **Campaign:** Active campaign taxonomy filter.  
  * **Platform:** Meta / Google / TikTok / Multi-channel.  
  * **Objective:** Conversions / Leads / ROAS scaling.  
  * **Product / Offer:** Current target SKU, pricing, or front-end hook.  
  * **Target Audience:** Demographic/interest segment definitions.  
* **Primary Actions:**  
  * \[Primary CTA\] **Analyze Performance** (Triggers background audit).  
  * \[Secondary CTA\] **Upload New Data** (Opens ingestion drawer).

### 3\. Data Ingestion & Sanitization

Accept raw performance data exports across formats without breaking on schema divergence.

* **Supported Formats:** .csv, .xlsx, Google Sheets export links.  
* **Expected Field Mapping:**

| Dimension Fields | Delivery Metrics | Conversion Metrics | Efficiency Metrics |
| :---- | :---- | :---- | :---- |
| Date | Spend | Clicks | CTR |
| Campaign | Impressions | Leads | CPC |
| Ad Set | Reach | Purchases | CPM |
| Ad Name |  | Conversion Rate (CVR) | CPL / CPA |
| Ad ID |  | Revenue | ROAS |

* **Resilience Rules:**  
  * Dynamic column discovery; do not reject files with missing non-essential columns.  
  * Auto-detect header variants (e.g., Cost \$\\rightarrow\$ Spend, Results \$\\rightarrow\$ Purchases).  
  * Instant post-parse preview grid showing total rows, spend tally, and confirmation: "Data successfully imported".

### 4\. Creative Library Management

A centralized asset catalog mapping qualitative assets to quantifiable return metrics.

* **Supported File Types:** Static Images (.jpg, .png, .webp), Video files (.mp4, .mov), Creative screenshots, Meta Ad Library captures.  
* **Associated Metadata per Asset:**  
  * Ad Name & ID (for automated sheet join).  
  * Platform & Campaign allocation.  
  * Structural Copy Breakdown: **Hook** (0–3s / Line 1), **Primary Copy**, **Headline**, **Call to Action (CTA)**.  
* **Asset Scorecard View:**  
  * Visual thumbnail preview.  
  * Unified metrics strip (Spend, CVR, CPA, ROAS).  
  * Algorithmic Classification Badge: **Winning**, **Average**, **Underperforming**.  
  * Multi-metric classification: Never classify performance based on a single isolated variable (e.g., high CTR with zero conversion volume must not be labeled a winner).

### 5\. Landing Page Intelligence

A dual-sided conversion audit matching ad intent against the post-click experience.

* **Ingestion Modalities:** Direct URL, pasted DOM/HTML string, or full-page desktop/mobile screenshots.  
* **Above-the-Fold Diagnostics:**  
  * Headline / Subheadline clarity and value delivery.  
  * Primary CTA visibility and frictionless placement.  
  * Core offer comprehensibility within the first screen view.  
* **Conversion Factor Audit:**  
  * Benefit hierarchy vs. feature laundry list.  
  * Proof mechanisms: Customer testimonials, data points, trust badges.  
  * Objection handling & contextual FAQ placement.  
  * Form friction: Input count, unnecessary verification steps.  
* **Funnel Congruency (Message Match Engine):**  
  * Strict comparative mapping: Ad Hook \$\\rightarrow\$ Landing Page Hero \$\\rightarrow\$ Offer Structure \$\\rightarrow\$ Checkout CTA.  
  * Identification of continuity disconnects (e.g., Ad promises *"Get your consultation in 15 minutes"*, but landing page states *"Learn more about our enterprise solutions"*).

### 6\. Performance Analysis Engine

Claude operates as an integrated **Senior Performance Marketing Strategist \+ CRO Specialist \+ Direct Response Copywriter**. The analysis engine must surface structural relationships between creative elements, target cohorts, and commercial unit economics:

\$\$\\{\\text{Hook, Angle, Format}\\} \\times \\{\\text{Audience Cohort}\\} \\Longleftrightarrow \\{\\text{CTR, CPC}\\} \\longrightarrow \\{\\text{LP Message Match}\\} \\longrightarrow \\{\\text{CVR, CPA, ROAS}\\}\$\$

### 7\. Winning Ads Breakdown

* **Asset Performance Strip:** Exact attribution values for Spend, CTR, CPC, CPL/CPA, CVR, and ROAS.  
* **Attribution Rationale:** Structural diagnosis of why the asset succeeded (e.g., visual contrast in feed, early problem dramatization).  
* **Pattern Recognition Matrix:**  
  * Hook Architecture (e.g., Problem-led vs. Product-centric vs. Social proof shock).  
  * Emotional Angle (e.g., Anxiety relief, status enhancement, time recovery).  
  * Core Offer Framing (e.g., Low-commitment trial vs. direct checkout).  
  * Format Delivery (e.g., Lo-fi UGC vs. motion typography).  
* **Actionable Directives:** Concrete instructions on winning traits to scale (e.g., *"Problem-led hooks are delivering a 32% lower CPA than product-led hooks; build 5 additional problem-first angles"*).

### 8\. Iterative Creative Expansion (Winners \$\\rightarrow\$ Variations)

For each high-performing creative, generate systematic iterations without losing the core conversion mechanism:

* **5 Distinct Hooks:** Maintaining the core emotional trigger using different angles.  
* **3 Primary Text Variations:** Varying pacing, formatting, and scannability.  
* **3 High-Impact Headlines:** Direct, benefit-driven, and curiosity-gap styles.  
* **3 CTA Variations:** Direct urgency vs. low-friction commitment.  
* **3 Visual Creative Concepts:** Composition, framing, and visual hierarchy adjustments.  
* **2 UGC Creator Concepts:** Native scripts, visual directions, and creator archetypes.  
* **2 Short-Form Video Concepts:** Second-by-second storyboards for TikTok/Reels.

### 9\. Underperforming Ads Root-Cause Analysis (RCA)

* **Telemetry Strip:** Metric footprints revealing where drop-offs happen.  
* **Isolated Failure Categorization:**  
  * \[Creative Defect\] Scroll-stop failure (Poor CTR / High CPM).  
  * \[Copy Defect\] Engagement drop, bounce before click.  
  * \[Audience Mismatch\] Wrong cohort targeting.  
  * \[Offer Defect\] Insufficient perceived value.  
  * \[Landing Page Friction\] High bounce rate, zero add-to-carts.  
  * \[Conversion Defect\] High intent, drop-off at checkout form.  
* **Probabilistic Reasoning:** Use disciplined, hypothesis-driven language (e.g., *"The data suggests a possible disconnect between the hook and the core promise; this should be tested"*). Avoid unsupported certainty.

### 10\. Underperforming Ads \$\\rightarrow\$ Corrective Playbooks

* **Banned Paradigms ("Don't Do"):**  
  * Explicitly identify hook formats to discontinue immediately.  
  * Identify creative angles that cause engagement drops.  
  * Flag misaligned CTAs or pricing callouts to avoid repeating.  
* **Testing Alternatives ("Test Instead"):**  
  * Provide drop-in replacement hooks, re-framed value propositions, and alternative creative formats.

### 11\. Landing Page Intelligence Report

* **Report Subsections:**  
  1. What’s Working (High-converting proof points and clear value statements).  
  2. Potential Issues (Visual noise, buried value propositions).  
  3. Conversion Friction (Form fields, loading delays, weak assurances).  
  4. Ad-to-Landing-Page Message Match (Discrepancy scoring).  
  5. Recommended Changes (Structural UI/UX shifts).  
* **Targeted Copy Rewrites:**  
  * Drop-in Hero Headline & Subheadline alternatives.  
  * Primary CTA button micro-copy.  
  * Bulleted benefit hierarchy restructuring.  
  * Optimized Social Proof placement.  
  * High-intent objection-clearing FAQ entries.

### 12\. Funnel Bottleneck Diagnosis

A visual funnel mapping stage-by-stage leakage:

\$\$\\text{Impressions} \\xrightarrow{\\quad\\text{CTR}\\quad} \\text{Link Clicks} \\xrightarrow{\\quad\\text{Drop-off}\\quad} \\text{LP Views} \\xrightarrow{\\quad\\text{CVR}\\quad} \\text{Leads / Carts} \\xrightarrow{\\quad\\text{Friction}\\quad} \\text{Closed Sales}\$\$

* Automated diagnosis flags (e.g., High CTR \+ High Bounce Rate \= Creative Clickbait / Post-Click Delivery Failure).

### 13\. Next 7-Day Action Plan

Action items structured by priority:

| Tier | Focus | Requirement |
| :---- | :---- | :---- |
| **P0 — Immediate** | Critical budget bleed & technical errors | Direct fixes for broken ads, misrouted URLs, or zero-converting spenders. |
| **P1 — Test** | High-probability hypothesis testing | Creative hook variations and landing page headline tests. |
| **P2 — Explore** | Net-new angles and creative formats | Experimental UGC archetypes, unproven landing page angles. |

* *Every action item must document:* Specific Action, Strategic Rationale, Expected Learning, and Primary Metric to Monitor.

### 14\. Testing & Experimentation Roadmap

Interactive status tracking matrix for ongoing agency management:

| Test ID | Hypothesis | Variable | Target KPI | Priority | Status Indicator |
| :---- | :---- | :---- | :---- | :---- | :---- |
| EXP-01 | Problem-led hook will beat current product demo CTR | Hook (First 3s) | CTR | High | Planned / Running / Completed / Winner / Loser |
| EXP-02 | Low-friction CTA will improve landing page conversion | CTA Text | CVR | Medium | Planned / Running / Completed / Winner / Loser |
| EXP-03 | Aligning hero headline with top ad hook will reduce bounce | LP Hero Copy | CVR | High | Planned / Running / Completed / Winner / Loser |

### 15\. Standalone AI Direct-Response Copywriter

A dedicated workspace leveraging historical client winners to generate new campaign assets:

* **Contextual Inputs:** Target SKU/Offer, Target Persona, Validated Insight, Creative Format, Target Platform, Brand Voice/Tone.  
* **Output Matrix:**  
  * 10 Ad Hooks (Categorized by mechanism: Curiosity, Problem-first, Contrarian, Social Proof, Direct Benefit).  
  * 5 Primary Text Blocks (Ranging from short-punchy to long-form storytelling).  
  * 5 Compelling Headlines (Direct-response optimized).  
  * 5 Visual Creative Briefs (Static & Motion creative concepts).  
  * 3 Complete UGC Video Scripts (Visual framing, Audio dialogue, and On-screen text cues).

### 16\. Persistent Client Knowledge Base

A centralized context repository preserved across sessions:

* **Brand DNA:** Name, voice, positioning statement, target market.  
* **Offer Mechanics:** Pricing, guarantees, bundling strategies, primary USPs.  
* **Audience Architecture:** Core personas, acute pain points, status desires, chronic objections.  
* **Compliance & Guardrails:** Hard-approved claims, absolute forbidden terms, legal disclaimers.  
* **Asset Memory:** Running log of historically validated winners, documented losers, and landing page changes.

### 17\. Final Executive Report Structure

> 1. **Executive Summary:** 3–5 strategic observations on account health.  
> 2. **Account Performance:** Core efficiency benchmarks (Spend, CPA, ROAS vs. Targets).  
> 3. **Winning Ads:** Comprehensive winner diagnostics and scaling mechanisms.  
> 4. **Losing Ads:** Problem isolation and capital preservation recommendations.  
> 5. **Creative Intelligence:** Cross-asset visual, audio, and hook trends.  
> 6. **Copy Intelligence:** Cross-asset headline, narrative, and angle dynamics.  
> 7. **Landing Page Intelligence:** Message match and conversion friction analysis.  
> 8. **Funnel Diagnosis:** Identification of the primary account bottleneck.  
> 9. **New Ad Opportunities:** Iteration roadmaps expanding on validated angles.  
> 10. **What To Stop:** Deprecated messaging, creative formats, and wasted budget segments.  
> 11. **Next 7 Days:** Prioritized P0/P1/P2 operational action plan.  
> 12. **Experiment Roadmap:** Active testing queue with clear hypotheses and KPI ownership.

### 18\. UI & Visual System Design

* **Theme:** Professional, high-density Light Theme SaaS.  
* **Color Hierarchy:**  
  * Base: Clean white (\#FFFFFF) with subtle border dividers (\#E5E7EB).  
  * Cards/Panels: Neutral off-white and soft grey (\#F9FAFB).  
  * Telemetry Accents: Positive/Scale (\#10B981 Green), Danger/Bleed (\#EF4444 Red), Caution/Pending (\#F59E0B Amber).  
* **Component Styling:** Monospaced data tables for financial figures, clean visual funnels, and zero non-functional gradients.

### 19\. Data Quality & Integrity Validation

Pre-analysis validation engine flagging ingestion issues before inference:

* Detection of negative/impossible metrics (e.g., Impressions \= 0 with Spend \> 0).  
* De-duplication of shared Ad IDs across merged sets.  
* Automated flagging of missing conversion values or currency mismatches.  
* Surface dynamic alert: "Data Quality Warning: \[X\] rows contain missing conversion telemetry. Projections will run on available metrics."

### 20\. AI Reasoning & Strategic Guardrails

* Absolute grounding: Claude must never synthesize, extrapolate, or hallucinate metrics not present in the imported data.  
* Never declare an ad a winner on vanity metrics (CTR alone) without verifying conversion volume and minimum spend thresholds.  
* Factor in attribution lag and sample size before recommending asset deactivation.  
* Every recommendation must explicitly reference supporting historical metrics.

### 21\. Architectural Scope

* **Frontend:** React with clean modular dashboard components.  
* **Data Processing:** In-browser/server parsing for CSV/XLSX and Google Sheets.  
* **AI Engine:** Claude API integration for contextual reasoning, vision analysis, and copy generation.  
* **Asset Storage:** Local or cloud bucket storage for creative assets and landing page captures.  
* **Pragmatism:** No workflow automation dependencies (no n8n); designed to cleanly bridge into official ad network APIs in future versions.

### 22\. Phased Rollout Matrix

* **Version 1 (Core MVP):**  
  * Client Profile Setup.  
  * CSV/XLSX Data Ingestion & Validation.  
  * Creative Asset & Copy Manual Upload.  
  * Landing Page URL & DOM Text Extraction.  
  * Claude-Powered Funnel Diagnostics & Action Plan.  
* **Version 2 (Advanced Intelligence):**  
  * Creative library cross-pattern clustering.  
  * Automated winning/losing iteration generators.  
  * Dynamic Testing Roadmap management.  
* **Version 3 (Ecosystem Connectors):**  
  * Direct Meta Ads & Google Ads API OAuth sync.  
  * Historical multi-window retention database.  
  * Automated scheduled audits.

## **Technical & Operational Challenges**

Building this system exposes several engineering, mathematical, and architectural challenges that must be addressed during implementation.

### **1\. Google Drive & File Permissions**

* **The Permission Wall:** Marketers typically store ad assets across Google Drive, Dropbox, or local drives. Using Google Drive links in uploaded spreadsheets means files are often locked behind private permissions.  
* **The Auth Trap:** Accessing private Drive folders programmatically requires the Google OAuth drive.readonly scope. Because drive.readonly is classified as a Restricted Scope, publishing a production app requires a formal third-party Cloud Application Security Assessment (CASA) audit, which introduces high recurring costs and months of compliance review.  
* **Subfolder Traversal:** Drive links often point to messy folder structures with subfolders, nested revisions (v2\_final\_final.mp4), and mixed file formats. Automated scrapers struggle to map which specific file corresponds to which row in the performance spreadsheet.  
* **The Alternative:** For the MVP, avoid relying on Google Drive API authentication. Provide direct multi-file drag-and-drop uploads (using presigned URLs to an S3/Cloudflare R2 bucket) and ask the user to map files to Ad IDs inside the UI.

### **2\. Large Google Sheets & Ingestion Limits**

* **Cell & File Volume:** Agency campaign sheets often contain tens of thousands of rows spanning months of raw ad-set data, along with broken formulas, nested pivot tables, and non-standard export structures.  
* **API Ingestion & Rate Limits:** Fetching large Google Sheets directly through the Google Sheets API frequently triggers rate limits or times out during large batch extractions.  
* **LLM Context Window Overload:** You cannot pass 10,000 rows of raw spreadsheet data directly into Claude. Doing so wastes millions of tokens and triggers the **"Lost in the Middle"** phenomenon, where the model misses underperforming ad variations buried among hundreds of rows.  
* **The Fix:** The backend must aggregate the data before passing it to Claude. Pre-calculate campaign totals, isolate the Top 10 Winners and Bottom 10 Losers deterministically via application logic, and only pass the structured summary to Claude.

### **3\. Video Processing & LLM Modality Constraints**

* **Claude Cannot Watch Raw Video:** Claude 3.5 Sonnet processes text and static images natively, but it cannot ingest .mp4 or .mov files directly.  
* **Dual-Pipeline Requirement:** To analyze video creatives, you must build an asset pre-processing pipeline:  
  * **Audio Pipeline:** Extract the audio track and transcribe it (using an API like Whisper) so Claude can analyze the verbal hook, pacing, and script.  
  * **Visual Pipeline:** Run an FFmpeg process to extract key video frames (e.g., 1 frame per second for the first 3–5 seconds) and send those frames as a multi-image payload to Claude Vision to evaluate visual hooks, text overlays, and framing.

**Note: This is not applied if we are using the model that is capable of reading the video itself.**

### **4\. Non-Deterministic Math & Hallucinations**

* **LLMs Struggle with Accurate Arithmetic:** LLMs should not be relied upon to calculate CPAs, divide spend by clicks to confirm CPCs, or rank ROAS across a spreadsheet. Claude will occasionally calculate metrics incorrectly or invent numbers when operating under heavy context loads.  
* **Strict Separation of Concerns:** Your application backend (Node.js/Python) must handle 100% of the mathematical calculations deterministically:  
  \$\$\\text{CTR} \= \\frac{\\text{Clicks}}{\\text{Impressions}}, \\quad \\text{CPC} \= \\frac{\\text{Spend}}{\\text{Clicks}}, \\quad \\text{ROAS} \= \\frac{\\text{Revenue}}{\\text{Spend}}\$\$  
* Send Claude the *already-calculated* metrics in a clean JSON payload. Claude’s prompt should strictly focus on qualitative analysis, pattern extraction, copy diagnosis, and strategic recommendations based on the provided numbers.

### **5\. Statistical Significance & The "Fluke Ad" Problem**

* **The Low-Spend Anomaly:** An ad that spends \$10, receives 1 click, and generates 1 sale will show a 100% conversion rate and a 15x ROAS. An unconstrained LLM will label this ad the "\#1 Winner to Scale Immediately."  
* **Budget Starvation:** In Meta Advantage+ or dynamic ad sets, the algorithm often allocates 90% of the budget to one creative while starving others with \$2–\$5 of spend. These starved ads are not necessarily "Losing Ads"—they simply lack statistical power.  
* **Required Guardrail:** Your data-parsing engine must enforce minimum statistical thresholds (e.g., minimum spend \$\\ge 1.5\\times\$ target CPA or a minimum of 1,000 impressions) before categorizing an ad as a Winner or Loser. Ads below these thresholds must be labeled Insufficient Data / Inconclusive.

### **6\. Landing Page Scraping & Message Match Bottlenecks**

* **Dynamic Client-Side Renders:** Many modern landing pages rely on complex JavaScript frameworks (Next.js, React, Shopify Hydrogen) that load DOM elements and reviews asynchronously. Simple HTML fetchers (like Axios/Cheerio) only download empty container shells.  
* **Interactive Elements:** Cookie banners, newsletter popups, age gates, and country-selection modals often cover the primary hero section on load. If your automated snapshot engine triggers immediately, the screenshot sent to Claude Vision may only show a generic modal overlay rather than the actual landing page headline and offer.  
* **Crawler Blockers:** Enterprise stores frequently run Cloudflare Turnstile, DataDome, or Akamai bot protection, which will return 403 Forbidden pages when accessed by basic headless browser scripts.  
* **The Fix:** The scraping layer requires headless browser automation (Puppeteer/Playwright) configured to wait for networkidle2, inject scripts to dismiss common overlay elements, extract both full-page and viewport-specific screenshots, and pull the hero text into structured JSON.

### **7\. Execution Timeouts & Request Lifecycle**

* **Synchronous Timeouts:** Scraping a target landing page, downloading 10 images/videos, extracting video frames via FFmpeg, running audio transcription, and sending a 40,000-token prompt to Claude Vision can take anywhere from **45 to 90 seconds**.  
* **Serverless Execution Limits:** Standard serverless API endpoints (such as default Vercel or AWS API Gateway routes) time out after 10–15 seconds, which will break a synchronous "Click to Analyze" request.  
* **The Architecture:** The app requires an asynchronous task execution flow. The user triggers "Analyze Funnel," the backend queues the task (via BullMQ, Celery, or similar), provides a stepped progress state in the UI, and returns the finished strategic report once the pipeline finishes processing.

## **Technical & Operational Challenges**

Building this system comes with several technical challenges. These need to be handled properly so the system can work reliably at scale.

### **1\. Google Drive & File Permissions/based on scripts** 

* **The main problem:** Ad creatives are often stored in Google Drive, Dropbox, or local computers. If a spreadsheet contains a Google Drive link, the file may not be publicly accessible.  
* **Access problem:** To automatically access private Google Drive files, we need Google OAuth permissions. The required `drive.readonly` permission is a **Restricted Scope**, which can require Google's security assessment (CASA) before the app can be used in production. This can be expensive and time-consuming.  
* **Messy folders:** Google Drive folders can contain many subfolders and duplicate files such as `video_final.mp4`, `video_final_v2.mp4`, and `video_final_final.mp4`. It becomes difficult for the system to know which file belongs to which ad.  
* **Better MVP approach:** Don't depend on Google Drive access initially. Let users **upload multiple images/videos directly into the system** and manually connect each file to its **Ad ID**.

---

### **2\. Large Google Sheets & Data Limits**

* **Large amounts of data:** Campaign spreadsheets can contain thousands or even tens of thousands of rows covering multiple campaigns, ad sets, and ads.  
* **Google Sheets limitations:** Trying to fetch a very large sheet through the API can be slow, fail, or hit API limits.  
* **LLM limitations:** We should not send thousands of raw rows directly to Claude. This uses too many tokens and makes it harder for Claude to identify important information.  
* **Better approach:** The backend should process the data first:  
  * Calculate campaign-level totals.  
  * Calculate important metrics.  
  * Identify the **Top 10 performing ads**.  
  * Identify the **Bottom 10 performing ads**.  
  * Remove unnecessary raw data.  
  * Send only the important, structured information to Claude.

This allows Claude to focus on **analysis instead of basic data processing**.

---

### **3\. Video Processing & AI Model Limitations**

If the selected AI model cannot directly understand video files, the system needs to process the video before sending it to the AI.

#### **Audio Analysis**

* Extract the audio from the video.  
* Convert the speech into text using a transcription tool such as Whisper.  
* Send the transcript to Claude.  
* Claude can then analyze the **hook, script, messaging, and pacing**.

#### **Visual Analysis**

* Use FFmpeg to extract important frames from the video.  
* For example, extract frames every second from the first 3–5 seconds.  
* Send these images to Claude Vision.  
* Claude can analyze the **visual hook, text overlays, composition, and framing**.

**Important:** If the AI model being used can directly understand and analyze video, this additional video-processing pipeline may not be required.

---

### **4\. Accurate Calculations & AI Hallucinations**

AI models should **not be responsible for doing important calculations**.

For example, the AI may incorrectly calculate:

* CTR  
* CPC  
* CPA  
* ROAS  
* Conversion rate

The backend should calculate these metrics using code.

For example:

**CTR \= Clicks ÷ Impressions**

**CPC \= Spend ÷ Clicks**

**ROAS \= Revenue ÷ Spend**

The backend should calculate these numbers first and then send the results to Claude.

Claude's job should be to:

* Understand the numbers.  
* Find patterns.  
* Analyze the creative.  
* Identify possible reasons for performance.  
* Give recommendations.

This keeps the mathematical part **accurate and reliable**.

---

### **5\. Statistical Significance & "Fluke Ads"**

Sometimes an ad looks like a winner simply because it has received very little data.

For example:

> An ad spends \$10, gets 1 click, and generates 1 sale.

It may show a very high conversion rate and ROAS, but that doesn't necessarily mean the ad is actually a strong performer.

Similarly, Meta may give most of the budget to one ad while other ads receive only $2–$5\. Those low-spend ads shouldn't automatically be considered failures.

#### **Required solution**

The system should define minimum data requirements before calling an ad a **Winner** or **Loser**.

For example:

* Minimum spend ≥ 1.5 × target CPA, **or**  
* Minimum 1,000 impressions.

If an ad doesn't have enough data, classify it as:

**Insufficient Data / Inconclusive**

This prevents the system from making decisions based on unreliable results.

---

### **6\. Landing Page Scraping & Message Matching**

The system also needs to analyze the landing page connected to the ad.

#### **Problem 1: Modern websites**

Many websites use technologies such as React, Next.js, and Shopify Hydrogen. Important content may load only after JavaScript runs.

A simple scraper may therefore see an almost empty page.

#### **Problem 2: Popups and overlays**

Landing pages may show:

* Cookie popups  
* Newsletter popups  
* Age verification  
* Country selection  
* Login windows

These can cover the main headline and offer.

If the system takes a screenshot immediately, Claude may analyze the popup instead of the actual landing page.

#### **Problem 3: Bot protection**

Some websites use services such as Cloudflare, DataDome, or Akamai to block automated visitors.

A basic scraper may receive a **403 Forbidden** response.

#### **Better approach**

Use a real browser automation tool such as **Playwright or Puppeteer** to:

* Load the complete website.  
* Wait for the page to finish loading.  
* Close common popups.  
* Capture the full-page screenshot.  
* Capture the main viewport screenshot.  
* Extract the main headline and offer.  
* Store the important landing-page information as structured data.

This information can then be compared with the ad creative to check **message match**.

---

### **7\. Long Processing Time & Server Timeouts**

The complete analysis can involve many steps:

1. Open the landing page.  
2. Scrape the page.  
3. Download images/videos.  
4. Process videos.  
5. Extract audio.  
6. Transcribe audio.  
7. Extract video frames.  
8. Analyze creatives.  
9. Send data to Claude.  
10. Generate the final report.

This can take **45–90 seconds or more**.

The problem is that normal server/API requests often have much shorter timeout limits. The request could fail before the analysis is completed.

#### **Better architecture**

The analysis should run as an **asynchronous background job**.

Instead of:

**User → Click Analyze → Wait → Result**

Use:

**User → Click Analyze → Job Created → Background Processing → Progress Updates → Final Report**

A queue system such as **BullMQ or Celery** can manage these background tasks.

The UI can show progress such as:

> ✓ Campaign data processed  
> ✓ Creatives uploaded  
> ⏳ Analyzing creatives  
> ⏳ Checking landing page  
> ⏳ Generating recommendations  
> **Report almost ready**

Once everything is complete, the user receives the final strategic report.

---

## **Overall Architecture**

The basic idea is:

**User uploads data & creatives → Backend processes the data → Backend calculates metrics → Creative & landing-page analysis → AI analyzes patterns → Final strategic report**

The key principle is:

> **Let the backend handle data, calculations, file processing, and validation. Let the AI focus on understanding patterns, creative analysis, and strategic recommendations.**

# **Performance Marketing Intelligence Agent**

## **What is this tool?**

This is an AI-powered tool for performance marketing teams.

A marketer can upload:

* Ad performance data  
* Images and videos used in ads  
* Ad copy  
* Landing page details

The system will then analyze the complete customer journey:

**Ad → Click → Landing Page → Lead/Purchase**

It will identify:

* Which ads are performing well  
* Which ads are not performing well  
* Why they are performing that way  
* What should be changed  
* What new ads should be created  
* Whether the landing page matches the ad  
* What should be tested next

The goal is to help performance marketers make **faster and better decisions using actual campaign data**.

---

# **1\. How the Tool Works**

The basic process will be:

**Select Client**  
↓  
**Select Date Range**  
↓  
**Upload Campaign Data**  
↓  
**Upload Ad Creatives**  
↓  
**Add Landing Page**  
↓  
**Click "Analyze Funnel"**  
↓  
**AI Analyzes Everything**  
↓  
**View Performance Dashboard & Report**  
↓  
**Generate New Ad Ideas**

The user can select a client, choose a time period such as 7, 14, or 30 days, upload campaign data, add creatives and landing-page information, and then start the analysis.

---

# **2\. Client Dashboard**

Each client will have their own workspace.

The dashboard will show important information such as:

* Client name  
* Campaign  
* Advertising platform  
* Campaign objective  
* Product or offer  
* Target audience  
* Analysis period

For example:

**Client:** ABC Brand  
**Platform:** Meta Ads  
**Objective:** Leads  
**Product:** Online Course  
**Target Audience:** Working professionals  
**Period:** Last 30 Days

There will be two main buttons:

### **Analyze Performance**

Starts the AI analysis.

### **Upload New Data**

Allows the marketer to add new campaign data or creatives.

---

# **3\. Uploading Campaign Data**

The marketer should be able to upload campaign data using:

* CSV  
* Excel  
* Google Sheets

The system should understand common marketing metrics such as:

* Spend  
* Impressions  
* Clicks  
* Reach  
* CTR  
* CPC  
* CPM  
* Leads  
* Purchases  
* Conversion Rate  
* CPA/CPL  
* Revenue  
* ROAS

The system should also be flexible with different spreadsheet formats.

For example:

If one spreadsheet calls something **"Spend"** and another calls it **"Cost"**, the system should understand that both mean the same thing.

After uploading the file, the system should show a quick confirmation:

**"Data successfully imported."**

It should also show basic information such as:

* Number of rows  
* Total spend  
* Important missing data

---

# **4\. Creative Library**

The system will have a place where marketers can store and analyze their ad creatives.

Supported files can include:

* Images  
* Videos  
* Screenshots  
* Ad Library screenshots

Each creative should be connected to its ad information, such as:

* Ad Name  
* Ad ID  
* Campaign  
* Platform  
* Hook  
* Main Copy  
* Headline  
* CTA

The system will then show each creative along with its performance.

For example:

**Creative A**

Spend: ₹25,000  
CTR: 2.8%  
CPA: ₹450  
ROAS: 3.2

The system can then classify the creative as:

* Winning  
* Average  
* Underperforming

However, it should **not judge an ad using only one metric**.

For example, a high CTR does not automatically mean the ad is successful if it generates no sales.

---

# **5\. Landing Page Analysis**

The system will also check the landing page that people see after clicking the ad.

The user can provide:

* Landing page URL  
* Website content  
* Screenshots

The AI will check things such as:

### **First Screen**

* Is the headline clear?  
* Is the offer easy to understand?  
* Is the main CTA easy to find?  
* Does the page immediately explain the value?

### **Trust & Conversion**

The system will also check:

* Testimonials  
* Reviews  
* Trust signals  
* Benefits  
* FAQs  
* Objection handling  
* Number of form fields  
* Unnecessary steps

---

# **6\. Ad-to-Landing-Page Match**

One important feature is checking whether the ad and landing page are saying the same thing.

For example:

### **Ad says:**

**"Get a free consultation in 15 minutes."**

But after clicking, the landing page says:

**"Learn more about our enterprise solutions."**

There is a clear difference between the promise in the ad and what the user sees on the landing page.

The system should identify these gaps.

It will compare:

**Ad Hook → Landing Page Headline → Offer → CTA**

This helps identify why people may click an ad but not convert.

---

# **7\. Performance Analysis**

Claude will act like a combination of:

* Performance marketing strategist  
* Conversion optimization specialist  
* Direct-response copywriter

It will look at the complete journey:

**Creative → Audience → Clicks → Landing Page → Conversion → Revenue**

The AI should not simply say:

> "This ad is good."

Instead, it should explain **why** the ad appears to be working.

For example:

> "This ad may be performing well because it clearly shows the customer's problem within the first few seconds and uses a strong benefit-focused message."

---

# **8\. Understanding Winning Ads**

For ads that are performing well, the system should explain what makes them successful.

It can look at:

### **Hook**

What grabs attention?

Example:

* Problem-focused  
* Product-focused  
* Question  
* Social proof

### **Emotional Angle**

For example:

* Saving time  
* Reducing stress  
* Making more money  
* Improving status  
* Solving a problem

### **Offer**

For example:

* Free trial  
* Discount  
* Consultation  
* Direct purchase

### **Creative Format**

For example:

* UGC  
* Product demo  
* Talking-head video  
* Animation  
* Static image

The goal is to find **patterns that can be used to create more successful ads**.

---

# **9\. Create More Ads From Winning Ads**

Once the system identifies a successful ad, it should help create new versions of it.

For each successful creative, the system can generate:

* 5 new hooks  
* 3 primary text variations  
* 3 headlines  
* 3 CTA options  
* 3 visual concepts  
* 2 UGC concepts  
* 2 short-form video concepts

The important thing is that the new versions should keep the **main reason the original ad worked**, while testing new ways of presenting it.

---

# **10\. Understanding Poor-Performing Ads**

The system should also explain why an ad may not be working.

Possible reasons include:

### **Creative Problem**

People are not stopping to look at the ad.

### **Copy Problem**

The message is not interesting or clear enough.

### **Audience Problem**

The ad may be reaching the wrong people.

### **Offer Problem**

People don't see enough value in the offer.

### **Landing Page Problem**

People click but leave without taking action.

### **Conversion Problem**

People show interest but drop off during the form or checkout.

The system should avoid saying:

> "This is definitely the reason."

Instead, it should say things like:

> "The data suggests that the landing page may not be matching the promise made in the ad. This should be tested."

This keeps the analysis based on evidence rather than assumptions.

---

# **11\. What Should Be Changed?**

For poor-performing ads, the system should suggest what to test instead.

For example:

### **Instead of:**

"Stop using this type of hook."

It could recommend:

> "Test a problem-focused hook instead of the current product-focused opening."

It can provide:

* New hooks  
* New messages  
* New offers  
* New CTA ideas  
* New creative formats

The goal is not just to identify problems, but to provide **practical alternatives**.

---

# **12\. Landing Page Report**

The system should create a simple landing-page report covering:

### **What's Working**

What is already helping conversions?

### **Potential Problems**

What may be confusing or distracting users?

### **Conversion Friction**

What may be stopping people from completing the action?

### **Ad-to-Page Match**

Does the landing page deliver what the ad promised?

### **Recommended Changes**

What should be changed?

It can also suggest new:

* Headlines  
* Subheadlines  
* CTA text  
* Benefit sections  
* Social proof placement  
* FAQs

---

# **13\. Find Where the Funnel Is Breaking**

The system should show the complete customer journey:

**Impressions**  
↓  
**Clicks**  
↓  
**Landing Page Visits**  
↓  
**Leads / Add to Cart**  
↓  
**Sales**

The system should identify where the biggest problem is.

For example:

**High CTR \+ High Bounce Rate**

This could indicate that the ad is attracting clicks but the landing page is not delivering what users expected.

The system should highlight this as an area that needs investigation.

---

# **14\. What Should the Team Do Next?**

The system should provide a **7-day action plan**.

Actions can be divided into three levels:

### **P0 — Do Immediately**

Critical problems that need fixing now.

Examples:

* Broken ads  
* Wrong URLs  
* Ads spending money without conversions  
* Major tracking problems

### **P1 — Test**

Important changes that should be tested.

Examples:

* New hooks  
* New headlines  
* Landing page changes  
* Different CTAs

### **P2 — Explore**

New ideas that are worth experimenting with.

Examples:

* New UGC styles  
* New creative formats  
* New messaging angles

Each recommendation should explain:

* What to do  
* Why to do it  
* What we expect to learn  
* Which metric to watch

---

# **15\. Testing System**

The tool should also keep track of experiments.

For example:

### **Test 1**

**Hypothesis:** A problem-focused hook may get more clicks.

**What we're changing:** First 3 seconds of the video.

**Metric:** CTR

**Status:** Planned / Running / Completed

---

### **Test 2**

**Hypothesis:** A simpler CTA may increase conversions.

**What we're changing:** CTA text.

**Metric:** Conversion Rate

**Status:** Planned / Running / Completed

This gives the marketing team a clear record of what they are testing and what they have learned.

---

# **16\. AI Copywriter**

The system should also have a separate AI copywriting section.

The marketer provides information such as:

* Product  
* Offer  
* Target audience  
* Customer insight  
* Platform  
* Creative format  
* Brand tone

The AI can then create:

* 10 ad hooks  
* 5 primary texts  
* 5 headlines  
* 5 creative ideas  
* 3 UGC video scripts

The copy should be based on the client's existing brand information and previously successful ads.

---

# **17\. Client Knowledge Base**

Every client should have their own permanent information stored in the system.

This can include:

### **Brand Information**

* Brand name  
* Brand voice  
* Positioning  
* Target market

### **Offer Information**

* Pricing  
* Guarantees  
* Packages  
* USPs

### **Audience Information**

* Customer types  
* Problems  
* Desires  
* Objections

### **Rules**

* Claims that are approved  
* Claims that cannot be used  
* Legal disclaimers

### **Historical Information**

* Ads that worked  
* Ads that didn't work  
* Previous landing-page changes

This means the AI doesn't have to learn the brand from scratch every time.

---

# **18\. Final Report**

At the end of the analysis, the system should create one easy-to-understand report.

The report should include:

1. **Overall Summary**  
2. **Campaign Performance**  
3. **Winning Ads**  
4. **Underperforming Ads**  
5. **Creative Insights**  
6. **Copy Insights**  
7. **Landing Page Insights**  
8. **Funnel Problems**  
9. **New Ad Opportunities**  
10. **What Should Be Stopped or Changed**  
11. **Next 7-Day Action Plan**  
12. **Testing Plan**

The purpose is to give the marketer a clear answer to:

> **What is happening, why is it happening, and what should we do next?**

---

# **19\. Dashboard Design**

The dashboard should be:

* Clean  
* Professional  
* Easy to understand  
* Light theme  
* Data-focused

It should use simple visual indicators for:

🟢 Good performance  
🔴 Problems  
🟡 Needs attention

Important numbers should be easy to find.

The dashboard should avoid unnecessary design elements that distract from the data.

---

# **20\. Data Quality Checks**

Before the AI starts analyzing the campaign, the system should check whether the uploaded data makes sense.

For example:

* Is there spend but zero impressions?  
* Are some Ad IDs repeated?  
* Are conversion numbers missing?  
* Are different currencies being mixed?  
* Are important fields missing?

If there is a problem, the system should show a warning.

For example:

> **Data Quality Warning:** 25 rows are missing conversion data. Analysis will use the available information.

This prevents the AI from making recommendations based on bad data.

---

# **21\. AI Safety & Accuracy Rules**

The AI should always follow some basic rules.

### **Don't invent numbers**

The AI should only use numbers that actually exist in the uploaded data.

### **Don't judge an ad using only CTR**

A high CTR does not automatically mean an ad is successful.

The system should also look at:

* Spend  
* Conversions  
* CPA  
* Revenue  
* ROAS

### **Consider enough data**

An ad with very little spend should not automatically be called a winner or loser.

### **Explain every recommendation**

Every recommendation should be connected to actual campaign data.

For example:

> "This ad has a lower CPA than the account average and generated 18 purchases, so it may be worth testing additional versions of this creative."

The goal is to make the AI **data-driven rather than guess-driven**.

---

# **22\. Technology**

The basic technology behind the product will be:

### **Frontend**

React

Used to build the dashboard and user interface.

### **Data Processing**

The system will process CSV, Excel, and Google Sheets data.

### **AI**

Claude will handle:

* Marketing analysis  
* Creative analysis  
* Image understanding  
* Copy generation  
* Strategic recommendations

### **Storage**

Images, videos, and other assets can be stored locally or in cloud storage.

The first version should stay simple and should not depend on workflow automation tools such as n8n.

Later, the system can connect directly with advertising platforms.

---

# **23\. Product Development Plan**

The product should be built in stages rather than trying to build everything at once.

## **Version 1 — Basic Product**

Start with the core features:

* Create client profile  
* Upload CSV/Excel data  
* Check data quality  
* Upload creatives  
* Add landing page  
* Analyze campaign  
* Generate AI report  
* Generate action plan

This gives us the basic working product.

---

## **Version 2 — Advanced AI**

After the basic system works, add:

* Find patterns across creatives  
* Automatically create new versions of winning ads  
* Better creative recommendations  
* Testing management  
* More advanced campaign insights

---

## **Version 3 — Direct Platform Connections**

Finally, connect the system directly with:

* Meta Ads  
* Google Ads

This will allow campaign data to come automatically into the system instead of requiring manual uploads.

Future versions can also include:

* Historical data storage  
* Automatic scheduled reports  
* Automatic campaign audits

---

# **Simple Summary**

The product is basically an **AI performance marketing analyst**.

A marketer gives it:

**Campaign Data \+ Ad Creatives \+ Landing Page \+ Client Information**

The system gives back:

**What's Working \+ What's Not Working \+ Why \+ What to Test \+ What New Ads to Create**

The core idea is:

> **Don't just show marketers numbers. Explain what those numbers mean and tell them what they can test next.**

