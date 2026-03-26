import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabase";
import { loadStripe } from "@stripe/stripe-js";
import { Search, Plus, ChevronRight, X, Check, Clock, Building2, Home, Phone, Mail, MapPin, Filter, ArrowLeft, Send, Star, Zap, Menu, LogOut, Bell, TrendingUp, Heart, ClipboardList, ArrowRight, Shield, Globe, Lock, BarChart3, Activity, CreditCard, ExternalLink } from "lucide-react";

// âââ Stripe Setup âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || "price_placeholder";

// âââ Mock Data âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const COUNTRIES = ["All", "Australia", "United States"];

const RESOURCES = [
  // âââ AUSTRALIA ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { id: 1, name: "Headspace National Mental Health", country: "Australia", category: "Mental Health", type: "Youth Mental Health", address: "485 La Trobe St, Melbourne VIC 3000", phone: "1800 650 890", email: "info@headspace.org.au", website: "https://headspace.org.au", availability: "Accepting", waitTime: "1-3 weeks", insurance: ["Medicare", "Bulk Billed", "Private Health"], languages: ["English", "Arabic", "Mandarin", "Vietnamese"], hours: "Mon-Fri 9am-5pm (centres vary)", rating: 4.8, notes: "Free or low-cost mental health support for 12-25 year olds. 150+ centres nationally. Online and phone counselling available.", tags: ["youth", "mental health", "anxiety", "depression", "bulk billed", "free", "AU"] },
  { id: 2, name: "Mission Australia Housing", country: "Australia", category: "Housing", type: "Crisis & Transitional Housing", address: "580 George St, Sydney NSW 2000", phone: "1800 111 400", email: "housing@missionaustralia.com.au", website: "https://missionaustralia.com.au", availability: "Limited", waitTime: "2-7 days", insurance: ["N/A"], languages: ["English", "Arabic", "Dari", "Vietnamese"], hours: "24/7 Crisis Line", rating: 4.5, notes: "Emergency accommodation, transitional housing, and long-term supported housing across all states and territories.", tags: ["shelter", "emergency", "families", "crisis", "transitional", "AU"] },
  { id: 3, name: "Foodbank Australia", country: "Australia", category: "Food & Nutrition", type: "Food Relief", address: "70-72 Enterprise St, Welshpool WA 6106", phone: "1300 363 744", email: "info@foodbank.org.au", website: "https://foodbank.org.au", availability: "Accepting", waitTime: "Same day", insurance: ["N/A"], languages: ["English"], hours: "Mon-Fri 8am-4pm (varies by state)", rating: 4.9, notes: "Australia's largest food relief organisation. 2,500+ charity partners nationally. No documentation required.", tags: ["food", "nutrition", "no-doc", "school meals", "food relief", "AU"] },
  { id: 4, name: "Lives Lived Well", country: "Australia", category: "Substance Abuse", type: "Residential & Outpatient Treatment", address: "269 Wickham St, Fortitude Valley QLD 4006", phone: "1300 727 957", email: "intake@liveslivedwell.org.au", website: "https://liveslivedwell.org.au", availability: "Waitlist", waitTime: "2-4 weeks", insurance: ["Medicare", "Bulk Billed", "Private Health", "NDIS"], languages: ["English"], hours: "24/7 (Residential) / Mon-Fri 9am-5pm (Outpatient)", rating: 4.4, notes: "Detox, residential rehab, and outpatient programs across QLD and NSW. NDIS-registered. Culturally safe programs for First Nations peoples.", tags: ["addiction", "detox", "residential", "NDIS", "First Nations", "rehab", "AU"] },
  { id: 5, name: "Legal Aid Australia", country: "Australia", category: "Legal Services", type: "Free Legal Assistance", address: "Services in all states & territories", phone: "1300 888 529", email: "via state offices", website: "https://legalaid.nsw.gov.au", availability: "Accepting", waitTime: "1-2 weeks", insurance: ["N/A"], languages: ["English", "Arabic", "Mandarin", "Vietnamese", "Greek"], hours: "Mon-Fri 9am-5pm", rating: 4.7, notes: "Free legal advice and representation. Family law, criminal law, immigration, housing disputes. Means-tested.", tags: ["legal", "immigration", "family law", "housing rights", "free", "DV orders", "AU"] },
  { id: 6, name: "Royal Children's Hospital", country: "Australia", category: "Healthcare", type: "Paediatric & Family Health", address: "50 Flemington Rd, Parkville VIC 3052", phone: "(03) 9345 5522", email: "info@rch.org.au", website: "https://rch.org.au", availability: "Accepting", waitTime: "3-5 days", insurance: ["Medicare", "Bulk Billed", "Private Health"], languages: ["English", "Mandarin", "Arabic", "Somali", "Vietnamese"], hours: "Mon-Fri 8am-6pm", rating: 4.7, notes: "Paediatric outpatient clinics, immunisations, developmental assessments. Bulk-billed under Medicare.", tags: ["paediatric", "children", "immunisations", "bulk billed", "AU"] },
  { id: 7, name: "Workforce Australia", country: "Australia", category: "Employment", type: "Job Services & Training", address: "Services in all states & territories", phone: "1800 805 260", email: "via local providers", website: "https://workforceaustralia.gov.au", availability: "Accepting", waitTime: "Same day", insurance: ["N/A"], languages: ["English", "Arabic", "Vietnamese", "Mandarin", "Somali"], hours: "Mon-Fri 8:30am-5pm", rating: 4.3, notes: "Free employment services. Resume help, skills training, work placements. Special programs for youth, First Nations, and migrants.", tags: ["jobs", "employment", "training", "Centrelink", "resume", "AU"] },
  { id: 8, name: "1800RESPECT DV Services", country: "Australia", category: "Domestic Violence", type: "Crisis & Support Services", address: "Confidential, National Service", phone: "1800 737 732", email: "counsellor@1800respect.org.au", website: "https://1800respect.org.au", availability: "Accepting", waitTime: "Immediate", insurance: ["N/A"], languages: ["English", "Arabic", "Mandarin", "Vietnamese", "Hindi", "100+ via TIS"], hours: "24/7 Hotline & Online Chat", rating: 4.9, notes: "National DV and sexual assault hotline. Safety planning, crisis counselling, and referrals to local refuges.", tags: ["DV", "domestic violence", "crisis", "safety planning", "confidential", "AU"] },
  { id: 9, name: "My Aged Care", country: "Australia", category: "Senior Services", type: "Aged Care & Home Support", address: "National Service, Govt of Australia", phone: "1800 200 422", email: "via online portal", website: "https://myagedcare.gov.au", availability: "Accepting", waitTime: "1-2 weeks (assessment)", insurance: ["Medicare", "Commonwealth Funded", "Private"], languages: ["English", "Italian", "Greek", "Mandarin", "Vietnamese"], hours: "Mon-Fri 8am-8pm, Sat 10am-2pm", rating: 4.6, notes: "Government gateway to aged care services. Home care packages, respite, meals on wheels, and residential care.", tags: ["senior", "aged care", "home care", "meals", "respite", "AU"] },
  { id: 10, name: "ReachOut Australia", country: "Australia", category: "Youth Services", type: "Online Youth Support", address: "National, Online Service", phone: "N/A (Online)", email: "info@reachout.com", website: "https://reachout.com", availability: "Accepting", waitTime: "Immediate", insurance: ["N/A"], languages: ["English"], hours: "24/7 Online", rating: 4.8, notes: "Free online mental health support for young people 14-25 and their parents. Peer support forums and self-help tools.", tags: ["youth", "online", "mental health", "peer support", "free", "AU"] },

  // âââ UNITED STATES ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  { id: 11, name: "SAMHSA National Helpline", country: "United States", category: "Mental Health", type: "Crisis & Referral", address: "Nationwide, All 50 States", phone: "1-800-662-4357", email: "via online locator", website: "https://samhsa.gov", availability: "Accepting", waitTime: "Immediate", insurance: ["Medicaid", "Medicare", "Private", "Uninsured"], languages: ["English", "Spanish"], hours: "24/7 Helpline", rating: 4.8, notes: "Free, confidential, 24/7 treatment referral and information service for mental health and substance abuse. Available in English and Spanish.", tags: ["mental health", "substance abuse", "crisis", "free", "24/7", "US"] },
  { id: 12, name: "National Alliance to End Homelessness", country: "United States", category: "Housing", type: "Emergency & Supportive Housing", address: "Nationwide, All 50 States", phone: "211 (Local)", email: "via 211.org", website: "https://endhomelessness.org", availability: "Limited", waitTime: "Varies by area", insurance: ["N/A"], languages: ["English", "Spanish"], hours: "24/7 via 211", rating: 4.5, notes: "Dial 211 for local emergency shelter, transitional housing, and rapid rehousing programs. HUD-funded Continuum of Care programs in every state.", tags: ["shelter", "emergency", "HUD", "rapid rehousing", "211", "US"] },
  { id: 13, name: "Feeding America", country: "United States", category: "Food & Nutrition", type: "Food Banks & Pantries", address: "Nationwide, 200+ Food Banks", phone: "1-800-771-2303", email: "via online locator", website: "https://feedingamerica.org", availability: "Accepting", waitTime: "Same day", insurance: ["N/A"], languages: ["English", "Spanish"], hours: "Varies by location", rating: 4.9, notes: "Nationwide network of 200+ food banks serving 40M+ people. Food pantry locator on website. SNAP application assistance available.", tags: ["food", "nutrition", "SNAP", "food bank", "pantry", "US"] },
  { id: 14, name: "SAMHSA Treatment Locator", country: "United States", category: "Substance Abuse", type: "Treatment Referral", address: "Nationwide, All 50 States", phone: "1-800-662-4357", email: "via findtreatment.gov", website: "https://findtreatment.gov", availability: "Accepting", waitTime: "1-3 weeks", insurance: ["Medicaid", "Medicare", "Private", "Sliding Scale"], languages: ["English", "Spanish"], hours: "24/7 Referral Line", rating: 4.4, notes: "Federal database of 13,000+ treatment facilities. Detox, residential, outpatient, and MAT programs. Many accept Medicaid or offer sliding scale.", tags: ["addiction", "detox", "MAT", "residential", "Medicaid", "US"] },
  { id: 15, name: "Legal Services Corporation (LSC)", country: "United States", category: "Legal Services", type: "Free Civil Legal Aid", address: "Nationwide, 132 Programs", phone: "Via local LSC office", email: "via lsc.gov locator", website: "https://lsc.gov", availability: "Accepting", waitTime: "1-2 weeks", insurance: ["N/A"], languages: ["English", "Spanish", "Mandarin", "Arabic"], hours: "Mon-Fri 9am-5pm", rating: 4.6, notes: "Federally funded civil legal aid for low-income Americans. Family law, housing, immigration, benefits. 132 programs serving every county.", tags: ["legal", "immigration", "family law", "housing rights", "free", "US"] },
  { id: 16, name: "Community Health Centers (HRSA)", country: "United States", category: "Healthcare", type: "Primary & Preventive Care", address: "Nationwide, 1,400+ Centers", phone: "Via findahealthcenter.hrsa.gov", email: "via locator", website: "https://findahealthcenter.hrsa.gov", availability: "Accepting", waitTime: "3-7 days", insurance: ["Medicaid", "Medicare", "CHIP", "Sliding Scale", "Uninsured"], languages: ["English", "Spanish", "Mandarin", "Vietnamese", "Arabic"], hours: "Mon-Sat (varies)", rating: 4.6, notes: "Federally funded health centers in every state. Primary care, dental, behavioral health. Sliding fee scale. No one is turned away for inability to pay.", tags: ["primary care", "dental", "sliding scale", "uninsured", "FQHC", "US"] },
  { id: 17, name: "American Job Centers (CareerOneStop)", country: "United States", category: "Employment", type: "Job Training & Placement", address: "Nationwide, 2,400+ Centers", phone: "1-877-872-5627", email: "via careeronestop.org", website: "https://careeronestop.org", availability: "Accepting", waitTime: "Same day", insurance: ["N/A"], languages: ["English", "Spanish"], hours: "Mon-Fri 8am-5pm", rating: 4.3, notes: "Free employment services in every state. Resume workshops, job fairs, skills training, GED prep, and veteran services. WIOA-funded programs.", tags: ["jobs", "employment", "training", "GED", "resume", "veterans", "US"] },
  { id: 18, name: "National DV Hotline", country: "United States", category: "Domestic Violence", type: "Crisis Services", address: "Confidential, Nationwide", phone: "1-800-799-7233", email: "via thehotline.org", website: "https://thehotline.org", availability: "Accepting", waitTime: "Immediate", insurance: ["N/A"], languages: ["English", "Spanish", "200+ via interpreters"], hours: "24/7 Hotline, Chat & Text", rating: 4.9, notes: "Confidential crisis intervention, safety planning, and referrals to local shelters. Text START to 88788. Interpreter services for 200+ languages.", tags: ["DV", "domestic violence", "crisis", "safety planning", "confidential", "US"] },
  { id: 19, name: "Eldercare Locator (ACL)", country: "United States", category: "Senior Services", type: "Aging Services & Support", address: "Nationwide, All 50 States", phone: "1-800-677-1116", email: "via eldercare.acl.gov", website: "https://eldercare.acl.gov", availability: "Accepting", waitTime: "1-3 days", insurance: ["Medicare", "Medicaid", "OAA Funded"], languages: ["English", "Spanish"], hours: "Mon-Fri 9am-8pm ET", rating: 4.6, notes: "Federal gateway to local aging services. Meals on Wheels, home care, transportation, caregiver support, and elder abuse prevention.", tags: ["senior", "aged care", "home care", "meals", "caregiver", "US"] },
  { id: 20, name: "Boys & Girls Clubs of America", country: "United States", category: "Youth Services", type: "After-School & Youth Development", address: "Nationwide, 4,700+ Clubs", phone: "Via local club", email: "via bgca.org locator", website: "https://bgca.org", availability: "Accepting", waitTime: "1-2 weeks", insurance: ["N/A"], languages: ["English", "Spanish"], hours: "Mon-Fri 3pm-8pm (varies)", rating: 4.7, notes: "After-school programs, mentoring, tutoring, STEM activities, and college prep for youth ages 6-18. Low-cost or free membership.", tags: ["youth", "after-school", "mentoring", "tutoring", "STEM", "US"] },
];

const CATEGORIES = ["All", "Mental Health", "Housing", "Food & Nutrition", "Substance Abuse", "Legal Services", "Healthcare", "Employment", "Domestic Violence", "Senior Services", "Youth Services"];

const INITIAL_REFERRALS = [
  { id: 1, personName: "Sarah K.", resourceId: 2, resourceName: "Mission Australia Housing", status: "In Progress", dateCreated: "2026-01-20", dateUpdated: "2026-03-15", priority: "High", notes: "Accepted into transitional housing program in Western Sydney. Permanent housing application lodged with DCJ.", followUpDate: "2026-04-01" },
  { id: 2, personName: "Sarah K.", resourceId: 3, resourceName: "Foodbank Australia", status: "Completed", dateCreated: "2026-01-22", dateUpdated: "2026-02-05", priority: "Medium", notes: "Connected with local Foodbank partner. Receiving weekly hampers.", followUpDate: null },
  { id: 3, personName: "David M.", resourceId: 4, resourceName: "Lives Lived Well", status: "Pending", dateCreated: "2026-03-01", dateUpdated: "2026-03-10", priority: "High", notes: "On waitlist for residential rehab in QLD. Attending outpatient in meantime. NDIS plan review pending.", followUpDate: "2026-03-28" },
  { id: 4, personName: "Fatima A.", resourceId: 5, resourceName: "Legal Aid Australia", status: "In Progress", dateCreated: "2026-02-25", dateUpdated: "2026-03-20", priority: "High", notes: "Initial consultation completed with Legal Aid NSW. Solicitor assigned for immigration matter.", followUpDate: "2026-04-10" },
  { id: 5, personName: "Fatima A.", resourceId: 7, resourceName: "Workforce Australia", status: "Completed", dateCreated: "2026-02-28", dateUpdated: "2026-03-18", priority: "Medium", notes: "Enrolled in Workforce Australia. Attending resume workshops and English skills program.", followUpDate: null },
  { id: 6, personName: "Henry L.", resourceId: 9, resourceName: "My Aged Care", status: "In Progress", dateCreated: "2026-03-05", dateUpdated: "2026-03-22", priority: "Medium", notes: "ACAT assessment scheduled. Home care package level 2 application submitted. Meals on wheels referral in progress.", followUpDate: "2026-03-30" },
];

// âââ Utility Components âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const Badge = ({ children, variant = "default" }) => {
  const styles = { default: "bg-slate-100 text-slate-700", success: "bg-emerald-100 text-emerald-700", warning: "bg-amber-100 text-amber-700", danger: "bg-red-100 text-red-700", info: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>{children}</span>;
};

const StatusBadge = ({ status }) => {
  const map = { "Accepting": "success", "Limited": "warning", "Waitlist": "danger", "Completed": "success", "In Progress": "info", "Pending": "warning", "Cancelled": "danger" };
  return <Badge variant={map[status] || "default"}>{status}</Badge>;
};

const PriorityBadge = ({ priority }) => {
  const map = { "High": "danger", "Medium": "warning", "Low": "info" };
  return <Badge variant={map[priority] || "default"}>{priority}</Badge>;
};

const StatCard = ({ icon: Icon, label, value, trend, color = "blue" }) => {
  const colors = { blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600", purple: "bg-purple-50 text-purple-600", amber: "bg-amber-50 text-amber-600" };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}><Icon size={20} /></div>
        {trend && <span className="text-xs font-medium text-emerald-600 flex items-center gap-1"><TrendingUp size={12} />{trend}</span>}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, wide }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl ${wide ? "max-w-3xl" : "max-w-lg"} w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// âââ Landing Page âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const LandingPage = ({ onLogin, onSignup, onViewPricing }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"><Heart size={18} className="text-white" /></div>
        <span className="text-xl font-bold text-slate-900">ReferralHub</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <button onClick={onViewPricing} className="hover:text-blue-600 transition">Pricing</button>
        <span className="hover:text-blue-600 transition cursor-pointer">Features</span>
        <span className="hover:text-blue-600 transition cursor-pointer">About</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition">Log In</button>
        <button onClick={onSignup} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-200">Start Free Trial</button>
      </div>
    </nav>

    <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"><Zap size={14} />Built by social workers, for social workers</div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">Stop losing clients<br />in the referral gap</h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">ReferralHub helps you find the right resource, send the referral, and track the outcome. Less paperwork, more time with the people who need you.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onSignup} className="px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-200 flex items-center gap-2">Start 14-Day Free Trial <ArrowRight size={18} /></button>
        <button onClick={onViewPricing} className="px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition">Just $15/month. See what's included</button>
      </div>
      <p className="text-sm text-slate-400 mt-4">No credit card required. Cancel anytime.</p>
    </div>

    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Search, title: "Smart Resource Directory", desc: "Search over 10,000 verified community resources across Australia and the US. Filter by need, location, language, insurance, and real-time availability." },
          { icon: ClipboardList, title: "Referral Tracking", desc: "Track every referral from start to finish. Get alerts for follow-ups and waitlist changes. No sensitive client data is stored on our servers." },
          { icon: Shield, title: "Privacy-First Design", desc: "No sensitive client data stored on our servers. Only referral initials and resource connections are tracked. Your clients stay safe." },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-5"><f.icon size={24} className="text-blue-600" /></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white border-t border-b border-slate-200 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Always up to date</h2>
          <p className="text-lg text-slate-600">Our dedicated team keeps every resource current so you don't have to.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: "Weekly Verification", desc: "Our resource team personally verifies availability, contact info, and wait times with every listed provider on a weekly basis." },
            { icon: Globe, title: "Community-Powered", desc: "Social workers flag outdated info right from the app. Updates are reviewed and published within 24 hours." },
            { icon: Bell, title: "Change Alerts", desc: "Get notified when a resource you've referred to changes availability, hours, or acceptance criteria." },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><f.icon size={22} className="text-blue-600" /></div>
              <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">Trusted by social workers across Australia & the US</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ v: "12,000+", l: "Social Workers" }, { v: "850+", l: "Agencies" }, { v: "98%", l: "Satisfaction" }, { v: "45,000+", l: "Referrals / Month" }].map((s, i) => (
            <div key={i}><div className="text-2xl font-bold text-slate-900">{s.v}</div><div className="text-sm text-slate-500">{s.l}</div></div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">One plan. Everything included. $15/month.</h2>
        <p className="text-blue-100 text-lg mb-8">No tiers, no upsells, no surprises. Every social worker gets the full toolkit.</p>
        <button onClick={onSignup} className="px-8 py-3.5 text-base font-semibold text-blue-700 bg-white rounded-xl hover:bg-blue-50 transition shadow-lg">Start Your Free Trial</button>
      </div>
    </div>

    <footer className="bg-slate-900 text-slate-400 py-10 px-6 text-center text-sm">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Heart size={16} className="text-blue-400" /><span className="font-semibold text-white">ReferralHub</span>
      </div>
      <p>&copy; 2026 ReferralHub. Empowering social workers everywhere.</p>
    </footer>
  </div>
);

// âââ Pricing Page âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const PricingPage = ({ onBack, onSignup }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white/80 backdrop-blur border-b border-slate-200">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium text-sm"><ArrowLeft size={18} />Back</button>
      <div className="flex items-center gap-2"><div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"><Heart size={18} className="text-white" /></div><span className="text-xl font-bold text-slate-900">ReferralHub</span></div>
      <button onClick={onSignup} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">Sign Up</button>
    </nav>
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">One simple price for everyone</h1>
        <p className="text-lg text-slate-600">We believe every social worker deserves great tools, regardless of budget.</p>
      </div>
      <div className="bg-white rounded-2xl border-2 border-blue-500 ring-2 ring-blue-100 p-8 mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4">EVERYTHING INCLUDED</div>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-extrabold text-slate-900">$15</span>
            <span className="text-xl text-slate-500">/month</span>
          </div>
          <p className="text-slate-600">per social worker, billed monthly. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-8">
          {["Full national resource directory","Unlimited referral tracking","Real-time availability updates","Follow-up reminders & alerts","Search by need, language, insurance","Priority & status tracking","Export referral reports (PDF/CSV)","Custom referral templates","Resource change notifications","Community-verified data weekly","Email & chat support","Mobile-friendly access"].map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-700"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />{f}</div>
          ))}
        </div>
        <button onClick={onSignup} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-200 text-base">Start 14-Day Free Trial</button>
        <p className="text-center text-xs text-slate-400 mt-3">No credit card required. Full access for 14 days.</p>
      </div>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
        <h3 className="font-semibold text-slate-900 mb-2">Agency or team?</h3>
        <p className="text-sm text-slate-600 mb-3">It's the same $15/month per person. No enterprise pricing, no sales calls. Just sign up your team and go.</p>
        <p className="text-sm text-slate-600">Need 50+ seats? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Contact us</span> for volume discounts.</p>
      </div>
      <div className="mt-8 bg-emerald-50 rounded-xl border border-emerald-200 p-6">
        <div className="flex items-start gap-3">
          <Shield size={24} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Privacy-first by design</h3>
            <p className="text-sm text-slate-600">ReferralHub does not store sensitive client data. Referrals use only initials and are linked to resources, not full client records. Your clients' privacy is our priority.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// âââ Auth Screen (Real Supabase) ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const AuthScreen = ({ mode, onSuccess, onSwitch, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, organization: org }
          }
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6"><ArrowLeft size={16} />Back to home</button>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center gap-2 mb-6"><div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"><Heart size={18} className="text-white" /></div><span className="text-xl font-bold text-slate-900">ReferralHub</span></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="text-sm text-slate-500 mb-6">{isLogin ? "Sign in to your account" : "Start your 14-day free trial, then $15/month"}</p>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <div className="space-y-4">
            {!isLogin && <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Jane Doe" /></div>}
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Password</label><input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Min 6 characters" /></div>
            {!isLogin && <div><label className="block text-sm font-medium text-slate-700 mb-1">Organization (optional)</label><input value={org} onChange={e => setOrg(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Melbourne Community Services" /></div>}
            <button onClick={handleSubmit} disabled={loading || !email || !password} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-200 disabled:opacity-60">{loading ? "Please wait..." : isLogin ? "Sign In" : "Start Free Trial"}</button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}<button onClick={onSwitch} className="text-blue-600 font-medium hover:underline">{isLogin ? "Start free trial" : "Sign in"}</button></p>
        </div>
      </div>
    </div>
  );
};

// âââ Dashboard ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const Dashboard = ({ referrals, onNavigate, userName }) => {
  const active = referrals.filter(r => r.status === "In Progress" || r.status === "Pending");
  const upcoming = active.filter(r => r.followUpDate).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate)).slice(0, 5);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Good morning, {userName || "there"}</h1><p className="text-slate-500">Here's your referral overview for today.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Send} label="Total Referrals" value={referrals.length} color="blue" trend="+3 this week" />
        <StatCard icon={Clock} label="Active Referrals" value={active.length} color="purple" />
        <StatCard icon={Bell} label="Pending Follow-ups" value={upcoming.length} color="amber" />
        <StatCard icon={Check} label="Completed" value={referrals.filter(r => r.status === "Completed").length} color="green" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-slate-900">Upcoming Follow-ups</h2><button onClick={() => onNavigate("referrals")} className="text-sm text-blue-600 hover:underline">View all</button></div>
          {upcoming.length === 0 ? <p className="text-sm text-slate-500">No upcoming follow-ups.</p> : (
            <div className="space-y-3">
              {upcoming.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div><p className="text-sm font-medium text-slate-900">{r.personName}</p><p className="text-xs text-slate-500">{r.resourceName}</p></div>
                  <div className="text-right"><p className="text-xs font-medium text-slate-700">{r.followUpDate}</p><StatusBadge status={r.status} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-slate-900">Recent Referrals</h2><button onClick={() => onNavigate("referrals")} className="text-sm text-blue-600 hover:underline">View all</button></div>
          <div className="space-y-3">
            {referrals.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div><p className="text-sm font-medium text-slate-900">{r.personName} â {r.resourceName}</p><p className="text-xs text-slate-500">{r.dateCreated}</p></div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: Plus, label: "New Referral", page: "referrals" },
            { icon: Search, label: "Find Resource", page: "resources" },
            { icon: BarChart3, label: "View All Referrals", page: "referrals" },
          ].map((a, i) => (
            <button key={i} onClick={() => onNavigate(a.page)} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition text-left">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center"><a.icon size={18} className="text-blue-600" /></div>
              <span className="text-sm font-medium text-slate-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// âââ Resource Directory âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const ResourceDirectory = ({ onCreateReferral }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All");
  const [selected, setSelected] = useState(null);
  const [avFilter, setAvFilter] = useState("All");

  const filtered = useMemo(() => RESOURCES.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || r.category === category;
    const matchCountry = country === "All" || r.country === country;
    const matchAv = avFilter === "All" || r.availability === avFilter;
    return matchSearch && matchCat && matchCountry && matchAv;
  }), [search, category, country, avFilter]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Resource Directory</h1><p className="text-slate-500">Search verified community resources by need, location, or availability.</p></div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search by name, type, or keyword..." /></div>
        <div className="flex gap-2 items-center flex-wrap"><Globe size={14} className="text-slate-400" /><span className="text-xs text-slate-500">Country:</span>{COUNTRIES.map(c => <button key={c} onClick={() => setCountry(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${country === c ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{c}</button>)}</div>
        <div className="flex flex-wrap gap-2">{CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${category === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{c}</button>)}</div>
        <div className="flex gap-2 items-center"><Filter size={14} className="text-slate-400" /><span className="text-xs text-slate-500">Availability:</span>{["All", "Accepting", "Limited", "Waitlist"].map(a => <button key={a} onClick={() => setAvFilter(a)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${avFilter === a ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{a}</button>)}</div>
      </div>
      <p className="text-sm text-slate-500">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found</p>
      <div className="grid gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer" onClick={() => setSelected(r)}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2"><h3 className="font-semibold text-slate-900">{r.name}</h3><StatusBadge status={r.availability} /></div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><Building2 size={14} />{r.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} />{r.address}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />Wait: {r.waitTime}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">{r.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{t}</span>)}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); onCreateReferral(r); }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1 shrink-0"><Send size={14} />Refer</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name} wide>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3"><Badge variant="info">{selected.category}</Badge><StatusBadge status={selected.availability} /><div className="flex items-center gap-1 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < Math.floor(selected.rating) ? "currentColor" : "none"} />)}<span className="text-sm text-slate-600 ml-1">{selected.rating}</span></div></div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-slate-700"><Building2 size={16} className="text-slate-400" />{selected.type}</p>
                <p className="flex items-center gap-2 text-slate-700"><MapPin size={16} className="text-slate-400" />{selected.address}</p>
                <p className="flex items-center gap-2 text-slate-700"><Phone size={16} className="text-slate-400" />{selected.phone}</p>
                <p className="flex items-center gap-2 text-slate-700"><Mail size={16} className="text-slate-400" />{selected.email}</p>
                <p className="flex items-center gap-2 text-slate-700"><Clock size={16} className="text-slate-400" />{selected.hours}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-700"><span className="font-medium">Wait Time:</span> {selected.waitTime}</p>
                <p className="text-slate-700"><span className="font-medium">Insurance:</span> {selected.insurance.join(", ")}</p>
                <p className="text-slate-700"><span className="font-medium">Languages:</span> {selected.languages.join(", ")}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-slate-700">{selected.notes}</p></div>
            <button onClick={() => { onCreateReferral(selected); setSelected(null); }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition">Create Referral to {selected.name}</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

// âââ Referral Tracking ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const ReferralTracking = ({ referrals, setReferrals, createModalData, clearCreateModal }) => {
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [newRef, setNewRef] = useState({ personName: "", resourceId: "", priority: "Medium", notes: "" });

  useEffect(() => {
    if (createModalData) {
      setNewRef(prev => ({ ...prev, resourceId: String(createModalData.id) }));
      setShowCreate(true);
    }
  }, [createModalData]);

  const filtered = filter === "All" ? referrals : referrals.filter(r => r.status === filter);

  const handleCreate = () => {
    const resource = RESOURCES.find(r => r.id === Number(newRef.resourceId));
    if (!newRef.personName.trim() || !resource) return;
    const today = new Date().toISOString().split("T")[0];
    const followUp = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    const ref = { id: referrals.length + 1, personName: newRef.personName.trim(), resourceId: resource.id, resourceName: resource.name, status: "Pending", dateCreated: today, dateUpdated: today, priority: newRef.priority, notes: newRef.notes, followUpDate: followUp };
    setReferrals([ref, ...referrals]);
    setNewRef({ personName: "", resourceId: "", priority: "Medium", notes: "" });
    setShowCreate(false);
    if (clearCreateModal) clearCreateModal();
  };

  const updateStatus = (id, status) => {
    const today = new Date().toISOString().split("T")[0];
    setReferrals(referrals.map(r => r.id === id ? { ...r, status, dateUpdated: today } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900">Referral Tracking</h1><p className="text-slate-500">Monitor referrals from creation to completion.</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-200 text-sm"><Plus size={18} />New Referral</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["Pending", "In Progress", "Completed", "Cancelled"].map(s => {
          const count = referrals.filter(r => r.status === s).length;
          const colors = { Pending: "border-amber-300 bg-amber-50", "In Progress": "border-blue-300 bg-blue-50", Completed: "border-emerald-300 bg-emerald-50", Cancelled: "border-red-300 bg-red-50" };
          return <button key={s} onClick={() => setFilter(filter === s ? "All" : s)} className={`p-4 rounded-xl border-2 text-center transition ${filter === s ? colors[s] : "border-slate-200 bg-white hover:border-slate-300"}`}><div className="text-2xl font-bold text-slate-900">{count}</div><div className="text-xs text-slate-500">{s}</div></button>;
        })}
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition cursor-pointer" onClick={() => setViewing(r)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1"><h3 className="font-semibold text-slate-900">{r.personName}</h3><ChevronRight size={14} className="text-slate-400" /><span className="text-sm text-slate-600">{r.resourceName}</span></div>
                <div className="flex items-center gap-3"><StatusBadge status={r.status} /><PriorityBadge priority={r.priority} /><span className="text-xs text-slate-400">Created {r.dateCreated}</span>{r.followUpDate && <span className="text-xs text-amber-600 flex items-center gap-1"><Bell size={12} />Follow-up: {r.followUpDate}</span>}</div>
              </div>
              <div className="flex gap-2">
                {r.status === "Pending" && <button onClick={e => { e.stopPropagation(); updateStatus(r.id, "In Progress"); }} className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">Start</button>}
                {r.status === "In Progress" && <button onClick={e => { e.stopPropagation(); updateStatus(r.id, "Completed"); }} className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition">Complete</button>}
                {(r.status === "Pending" || r.status === "In Progress") && <button onClick={e => { e.stopPropagation(); updateStatus(r.id, "Cancelled"); }} className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">Cancel</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Referral Details" wide>
        {viewing && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Person (Initials)</p><p className="font-medium text-slate-900">{viewing.personName}</p></div>
              <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Resource</p><p className="font-medium text-slate-900">{viewing.resourceName}</p></div>
              <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Status</p><StatusBadge status={viewing.status} /></div>
              <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Priority</p><PriorityBadge priority={viewing.priority} /></div>
              <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Created</p><p className="text-sm text-slate-700">{viewing.dateCreated}</p></div>
              <div className="bg-slate-50 rounded-lg p-4"><p className="text-xs text-slate-500 mb-1">Last Updated</p><p className="text-sm text-slate-700">{viewing.dateUpdated}</p></div>
            </div>
            {viewing.followUpDate && <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"><Bell size={16} className="text-amber-600" /><span className="text-sm text-amber-800">Follow-up scheduled for <strong>{viewing.followUpDate}</strong></span></div>}
            <div><p className="text-sm font-medium text-slate-700 mb-2">Notes</p><div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">{viewing.notes || "No notes yet."}</div></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); if (clearCreateModal) clearCreateModal(); }} title="Create New Referral">
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2"><Shield size={16} className="text-emerald-600 mt-0.5 shrink-0" /><p className="text-xs text-emerald-800">For privacy, use only initials or a first name. No full names or identifying info are stored on our servers.</p></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Person (initials or first name)</label><input value={newRef.personName} onChange={e => setNewRef({ ...newRef, personName: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Maria S., J.W., Alex" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Resource</label><select value={newRef.resourceId} onChange={e => setNewRef({ ...newRef, resourceId: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select a resource...</option>{RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name} ({r.category})</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Priority</label><select value={newRef.priority} onChange={e => setNewRef({ ...newRef, priority: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Low</option><option>Medium</option><option>High</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Notes</label><textarea value={newRef.notes} onChange={e => setNewRef({ ...newRef, notes: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" placeholder="Add context about this referral..." /></div>
          <button onClick={handleCreate} disabled={!newRef.personName.trim() || !newRef.resourceId} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">Create Referral</button>
        </div>
      </Modal>
    </div>
  );
};

// âââ Main App âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [createReferralResource, setCreateReferralResource] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setScreen("app");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        setScreen("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen("landing");
    setUser(null);
  };

  const handleAuthSuccess = () => {
    setScreen("app");
  };

  const handleCreateReferral = (resource) => {
    setCreateReferralResource(resource);
    setPage("referrals");
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  if (screen === "landing") return <LandingPage onLogin={() => setScreen("login")} onSignup={() => setScreen("signup")} onViewPricing={() => setScreen("pricing")} />;
  if (screen === "pricing") return <PricingPage onBack={() => setScreen("landing")} onSignup={() => setScreen("signup")} />;
  if (screen === "login") return <AuthScreen mode="login" onSuccess={handleAuthSuccess} onSwitch={() => setScreen("signup")} onBack={() => setScreen("landing")} />;
  if (screen === "signup") return <AuthScreen mode="signup" onSuccess={handleAuthSuccess} onSwitch={() => setScreen("login")} onBack={() => setScreen("landing")} />;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "resources", label: "Resources", icon: Search },
    { id: "referrals", label: "Referrals", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Heart size={18} className="text-white" /></div>
          {sidebarOpen && <span className="text-lg font-bold text-slate-900">ReferralHub</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${page === item.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <item.icon size={20} />{sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"><Menu size={20} />{sidebarOpen && "Collapse"}</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600 transition"><LogOut size={20} />{sidebarOpen && "Log Out"}</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Badge variant="info">$15/month Plan</Badge>
              <span>{user?.email || "user@referralhub.com"}</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500"><Bell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>

          {page === "dashboard" && <Dashboard referrals={referrals} onNavigate={setPage} userName={userName} />}
          {page === "resources" && <ResourceDirectory onCreateReferral={handleCreateReferral} />}
          {page === "referrals" && <ReferralTracking referrals={referrals} setReferrals={setReferrals} createModalData={createReferralResource} clearCreateModal={() => setCreateReferralResource(null)} />}
        </div>
      </main>
    </div>
  );
}
