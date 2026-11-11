'use client';

import { useState } from 'react';
import { AdminNavbar } from '@/components/navigation/AdminNavbar';
import { BookOpen, Plus, Search, Layers, ChevronRight } from 'lucide-react';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'batches' | 'subjects'>('sessions');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="font-display text-3xl font-bold">Department Academics</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computer Science & Engineering Department — Session, Batch & Curriculum Management
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-[#176B52] hover:bg-[#125440] text-white text-xs font-medium transition-all shadow flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Academic Session
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'sessions'
                ? 'border-[#176B52] text-[#176B52] dark:border-[#81D3AD] dark:text-[#81D3AD]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Academic Sessions
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'batches'
                ? 'border-[#176B52] text-[#176B52] dark:border-[#81D3AD] dark:text-[#81D3AD]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Batches & Sections
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'subjects'
                ? 'border-[#176B52] text-[#176B52] dark:border-[#81D3AD] dark:text-[#81D3AD]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Subject Offerings
          </button>
        </div>

        {/* Tab 1: Academic Sessions */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">2026–2027 Academic Session</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold">Current</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Odd Semester (July 2026 - Dec 2026) | 4 Active Batches</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                Manage Terms
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm flex items-center justify-between opacity-80">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">2025–2026 Academic Session</h3>
                  <p className="text-xs text-slate-500 mt-1">Archived Session | Completed</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                View Records
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Batches & Sections */}
        {activeTab === 'batches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Batch 2023-27 (Final Year)', 'Batch 2024-28 (3rd Year)', 'Batch 2025-29 (2nd Year)', 'Batch 2026-30 (1st Year)'].map((batch, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <h3 className="font-display font-bold text-lg">{batch}</h3>
                  <span className="text-xs text-[#176B52] dark:text-[#81D3AD] font-semibold">120 Students</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)]">
                    <p className="font-bold text-sm">Section A</p>
                    <p className="text-slate-500 mt-1">Class Mentor: Dr. A. Sharma</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)]">
                    <p className="font-bold text-sm">Section B</p>
                    <p className="text-slate-500 mt-1">Class Mentor: Prof. R. Verma</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Subject Offerings */}
        {activeTab === 'subjects' && (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-[var(--border-color)] uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Subject Code</th>
                  <th className="p-4">Subject Title</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Assigned Faculty</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                <tr>
                  <td className="p-4 font-bold">CS501</td>
                  <td className="p-4 font-medium">Design & Analysis of Algorithms</td>
                  <td className="p-4">Semester V</td>
                  <td className="p-4">Dr. K. Patel</td>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-[#176B52] font-semibold">Active</span></td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">CS502</td>
                  <td className="p-4 font-medium">Database Management Systems</td>
                  <td className="p-4">Semester V</td>
                  <td className="p-4">Prof. M. Gupta</td>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-[#176B52] font-semibold">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}