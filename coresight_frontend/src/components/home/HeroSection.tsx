'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column - Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Institutional Intelligence
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Unified Academic & <span className="text-[#176B52] dark:text-[#81D3AD]">Student Information</span> System.
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-sans">
            CoreSight streamlines institutional workflows, department structures, student lifecycles, and academic analytics with unmatched precision and role-based clarity.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-xl bg-[#176B52] hover:bg-[#125440] text-white font-medium text-base transition-all shadow-lg hover:shadow-emerald-900/20 flex items-center gap-2 group"
            >
              Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-7 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-base transition-all"
            >
              View Admin Demo
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[var(--border-color)]">
            <div>
              <p className="font-display text-2xl font-bold text-[#176B52] dark:text-[#81D3AD]">99.9%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">System Reliability</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[#176B52] dark:text-[#81D3AD]">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Role-Based Security</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[#176B52] dark:text-[#81D3AD]">24/7</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Academic Tracking</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Academic Visual Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#176B52]/10 dark:bg-[#81D3AD]/10 flex items-center justify-center text-[#176B52] dark:text-[#81D3AD]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">CoreSight Portal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Institutional Hub</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[#176B52] dark:text-[#81D3AD] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live System
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)]">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Department Hierarchy</span>
                    <span className="text-[#176B52] dark:text-[#81D3AD]">8 Active Depts</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#176B52] dark:bg-[#81D3AD] h-full w-3/4 rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)]">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Student Enrollment Rate</span>
                    <span className="text-[#176B52] dark:text-[#81D3AD]">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#176B52] dark:bg-[#81D3AD] h-full w-[94%] rounded-full" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" /> Secure Institutional Authentication Enabled
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}