'use client';

import React from 'react';
import { ArrowRight, Shield, Activity, Stethoscope, Heart, Lock, Zap, ArrowUpRight, Calendar, LineChart, CreditCard, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="text-[#1d1c17] bg-[#f8f3eb] min-h-screen flex flex-col font-sans-dm">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-16 py-4 pointer-events-none">
        <nav className="bg-[#fef9f1]/90 backdrop-blur-md border border-[#e7e2da] shadow-[0_8px_32px_rgba(75,68,57,0.08)] rounded-full mt-2 mx-auto max-w-4xl w-full px-6 py-3 flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <a className="font-serif-display text-xl text-[#1d1c17] flex items-center gap-2 font-bold tracking-tight" href="#">
            <span className="w-8 h-8 bg-[#2849e5] text-white rounded-full flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-white" />
            </span>
            <span>VitalSync</span>
          </a>

          {/* Links (Desktop) */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444655]">
            <li>
              <a className="hover:text-[#2849e5] transition-colors cursor-pointer" href="#features">Features</a>
            </li>
            <li>
              <a className="hover:text-[#2849e5] transition-colors cursor-pointer" href="#how-it-works">How it Works</a>
            </li>
            <li>
              <a className="hover:text-[#2849e5] transition-colors cursor-pointer" href="#security">Security</a>
            </li>
          </ul>

          {/* Trailing Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="text-[#2849e5] hover:text-[#4865ff] font-medium text-sm px-4 py-2 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onNavigateToLogin}
              className="bg-[#2849e5] hover:bg-[#4865ff] text-white font-medium text-sm rounded-full px-5 py-2.5 transition-all shadow-warm-md hover:scale-[1.02] cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Main Body */}
      <main className="flex-grow pt-32 md:pt-44 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-12 text-center fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[#dae2ff]/60 border border-[#a2baff]/40 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold text-[#001848] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-4 h-4 text-[#2849e5]" />
            <span>AI-POWERED CLINICAL PLATFORM</span>
          </div>

          <h1 className="font-serif-display text-4xl md:text-6xl text-[#1d1c17] max-w-4xl mx-auto leading-[1.15] mb-6 font-normal tracking-tight">
            Unifying clinical workflows with the power of human-centered AI.
          </h1>

          <p className="text-lg text-[#444655] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Designed to reduce cognitive load and administrative friction for both healthcare providers and their patients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto bg-[#2849e5] hover:bg-[#4865ff] text-white font-medium text-base rounded-full px-8 py-4 shadow-warm-md transition-all hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto bg-[#fef9f1] border border-[#a2baff]/50 hover:bg-[#f2ede5] text-[#1d1c17] font-medium text-base rounded-full px-8 py-4 shadow-xs transition-all cursor-pointer"
            >
              Book a Demo
            </button>
          </div>

          {/* Clean Dashboard Preview Graphic */}
          <div className="mt-14 relative w-full max-w-5xl mx-auto rounded-3xl bg-[#ffffff] overflow-hidden shadow-warm-xl border border-[#e7e2da] p-4 md:p-6 text-left">
            <div className="bg-[#fef9f1] rounded-2xl border border-[#e7e2da] p-4 md:p-6 space-y-6">
              {/* Fake App Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e7e2da]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2849e5] text-white flex items-center justify-center font-serif-display font-bold">
                    VS
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1d1c17]">VitalSync Portal</p>
                    <p className="text-xs text-[#444655]">Dr. Sarah Miller • Lead Cardiologist</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-[#dae2ff] text-[#001848] font-semibold rounded-full">
                  LIVE DEMO PREVIEW
                </span>
              </div>

              {/* Fake Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#e7e2da] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#444655] font-semibold">
                    <span>UPCOMING APPOINTMENTS</span>
                    <Calendar className="w-4 h-4 text-[#2849e5]" />
                  </div>
                  <p className="text-2xl font-bold font-serif-display text-[#1d1c17]">14 Patients</p>
                  <p className="text-xs text-[#444655]">4 Telehealth • 10 In-Clinic</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e7e2da] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#444655] font-semibold">
                    <span>AI SUMMARY GENERATED</span>
                    <Sparkles className="w-4 h-4 text-[#5b5787]" />
                  </div>
                  <p className="text-2xl font-bold font-serif-display text-[#1d1c17]">98.4% Accuracy</p>
                  <p className="text-xs text-[#444655]">Sub-second chart transcription</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e7e2da] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#444655] font-semibold">
                    <span>ACTIVE PATIENT STATUS</span>
                    <Activity className="w-4 h-4 text-[#445c9a]" />
                  </div>
                  <p className="text-2xl font-bold font-serif-display text-[#1d1c17]">Optimal Vitals</p>
                  <p className="text-xs text-[#444655]">Realtime biometrics synced</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="max-w-6xl mx-auto px-4 md:px-12 py-16 mt-8 fade-in-up border-t border-b border-[#e7e2da]">
          <div className="flex flex-wrap justify-center md:justify-between gap-8 items-center text-[#444655]">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#2849e5]" />
              <span className="font-medium text-sm">Bank-level 256-bit encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#445c9a]" />
              <span className="font-medium text-sm">Role-based access control</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#2849e5]" />
              <span className="font-medium text-sm">Sub-second AI clinical summaries</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-12 py-20 fade-in-up" id="features">
          <div className="text-center mb-16">
            <h2 className="font-serif-display text-3xl md:text-4xl text-[#1d1c17] mb-4">
              Built for two kinds of users
            </h2>
            <p className="text-[#444655] max-w-2xl mx-auto text-base">
              Tailored experiences that respect the distinct needs of medical professionals and the people in their care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Providers Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pl-2 border-l-4 border-[#2849e5]">
                <Stethoscope className="w-6 h-6 text-[#2849e5]" />
                <h3 className="font-serif-display text-2xl text-[#1d1c17]">For Providers</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={onNavigateToLogin}
                  className="bg-white p-6 rounded-2xl border border-[#e7e2da] shadow-warm-md card-hover-lift cursor-pointer space-y-3 relative group"
                >
                  <ArrowUpRight className="w-5 h-5 absolute top-6 right-6 text-[#757687] group-hover:text-[#2849e5] transition-colors" />
                  <div className="w-12 h-12 rounded-xl bg-[#dee0ff] text-[#00105b] flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#1d1c17]">Clinical Dashboard</h4>
                  <p className="text-sm text-[#444655]">Unified view of your day, instantly prioritizing critical patient tasks.</p>
                </div>

                <div
                  onClick={onNavigateToLogin}
                  className="bg-white p-6 rounded-2xl border border-[#e7e2da] shadow-warm-md card-hover-lift cursor-pointer space-y-3 relative group"
                >
                  <ArrowUpRight className="w-5 h-5 absolute top-6 right-6 text-[#757687] group-hover:text-[#2849e5] transition-colors" />
                  <div className="w-12 h-12 rounded-xl bg-[#e4dfff] text-[#191541] flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#1d1c17]">AI Summarizer</h4>
                  <p className="text-sm text-[#444655]">Automated chart generation and intelligent note extraction from dialogue.</p>
                </div>

                <div
                  onClick={onNavigateToLogin}
                  className="bg-white p-6 rounded-2xl border border-[#e7e2da] shadow-warm-md card-hover-lift cursor-pointer space-y-3 relative group sm:col-span-2"
                >
                  <ArrowUpRight className="w-5 h-5 absolute top-6 right-6 text-[#757687] group-hover:text-[#2849e5] transition-colors" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#dae2ff] text-[#001848] flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base text-[#1d1c17]">Patient Records & Availability</h4>
                  </div>
                  <p className="text-sm text-[#444655]">Seamless scheduling logic integrated directly with robust electronic health record management.</p>
                </div>
              </div>
            </div>

            {/* Patients Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pl-2 border-l-4 border-[#445c9a]">
                <Heart className="w-6 h-6 text-[#445c9a]" />
                <h3 className="font-serif-display text-2xl text-[#1d1c17]">For Patients</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={onNavigateToLogin}
                  className="bg-blossom-tint p-6 rounded-2xl border border-[#e7e2da]/80 shadow-warm-md card-hover-lift cursor-pointer space-y-3 relative group"
                >
                  <ArrowUpRight className="w-5 h-5 absolute top-6 right-6 text-[#757687] group-hover:text-[#2849e5] transition-colors" />
                  <div className="w-12 h-12 rounded-xl bg-white text-[#ba1a1a] flex items-center justify-center shadow-xs">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#1d1c17]">Booking Wizard</h4>
                  <p className="text-sm text-[#444655]">Frictionless appointment scheduling with smart clinic triage.</p>
                </div>

                <div
                  onClick={onNavigateToLogin}
                  className="bg-forest-tint p-6 rounded-2xl border border-[#e7e2da]/80 shadow-warm-md card-hover-lift cursor-pointer space-y-3 relative group"
                >
                  <ArrowUpRight className="w-5 h-5 absolute top-6 right-6 text-[#757687] group-hover:text-[#2849e5] transition-colors" />
                  <div className="w-12 h-12 rounded-xl bg-white text-[#2849e5] flex items-center justify-center shadow-xs">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#1d1c17]">Biometrics Tracking</h4>
                  <p className="text-sm text-[#444655]">Visualize health trends with elegant, easy-to-read daily vital metrics.</p>
                </div>

                <div
                  onClick={onNavigateToLogin}
                  className="bg-white p-6 rounded-2xl border border-[#e7e2da] shadow-warm-md card-hover-lift cursor-pointer space-y-3 relative group sm:col-span-2"
                >
                  <ArrowUpRight className="w-5 h-5 absolute top-6 right-6 text-[#757687] group-hover:text-[#2849e5] transition-colors" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f2ede5] text-[#1d1c17] flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base text-[#1d1c17]">Refills & Stripe Billing</h4>
                  </div>
                  <p className="text-sm text-[#444655]">One-tap prescription renewals and transparent Stripe-powered online invoicing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-4xl mx-auto px-4 md:px-12 py-12 mt-4 text-center fade-in-up">
          <div className="bg-[#fef9f1] p-10 md:p-14 rounded-3xl shadow-warm-xl border border-[#e7e2da] relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h2 className="font-serif-display text-3xl md:text-4xl text-[#1d1c17]">
                Ready to elevate your practice?
              </h2>
              <p className="text-[#444655] text-base max-w-xl mx-auto">
                Join thousands of providers and patients who have reclaimed their time and improved clinical outcomes with VitalSync.
              </p>
              <button
                onClick={onNavigateToLogin}
                className="bg-[#2849e5] hover:bg-[#4865ff] text-white font-medium text-base rounded-full px-9 py-4 shadow-warm-md transition-all hover:scale-[1.03] inline-flex items-center gap-3 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-[#757687] pt-2">No credit card required • 14-day full feature trial</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e7e2da] bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#444655]">
          <div className="font-serif-display text-lg font-bold text-[#1d1c17] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2849e5]" />
            <span>VitalSync Platform</span>
          </div>
          <p className="text-xs">© 2026 VitalSync Healthcare Systems. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-medium">
            <a href="#" className="hover:text-[#2849e5]">Privacy Policy</a>
            <a href="#" className="hover:text-[#2849e5]">Terms of Service</a>
            <a href="#" className="hover:text-[#2849e5]">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
