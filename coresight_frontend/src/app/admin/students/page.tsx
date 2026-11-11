'use client';

import { useState } from 'react';
import { AdminNavbar } from '@/components/navigation/AdminNavbar';
import { Search, ArrowLeftRight, UserCheck } from 'lucide-react';

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'transfers'>('directory');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="font-display text-3xl font-bold">Department Students</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computer Science & Engineering Student Management & Transfers
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'directory' ? 'border-[#176B52] text-[#176B52]' : 'border-transparent text-slate-500'
            }`}
          >
            Student Directory
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'transfers' ? 'border-[#176B52] text-[#176B52]' : 'border-transparent text-slate-500'
            }`}
          >
            Section Transfers
          </button>
        </div>

        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name or roll number..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-[var(--border-color)] uppercase font-semibold text-slate-500">
                  <tr>
                    <th className="p-4">Roll No</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Batch</th>
                    <th className="p-4">Section</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  <tr>
                    <td className="p-4 font-bold">2024CS001</td>
                    <td className="p-4 font-medium">Aarav Mehta</td>
                    <td className="p-4">2024-28</td>
                    <td className="p-4">Section A</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-[#176B52] font-semibold">Active</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">2024CS002</td>
                    <td className="p-4 font-medium">Ananya Roy</td>
                    <td className="p-4">2024-28</td>
                    <td className="p-4">Section B</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-[#176B52] font-semibold">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section Transfers Tab */}
        {activeTab === 'transfers' && (
          <div className="max-w-xl p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#176B52] font-bold text-base">
              <ArrowLeftRight className="w-5 h-5" /> HOD Section Transfer Approval
            </div>
            <p className="text-xs text-slate-500">Transfer student from one section to another upon request.</p>

            <div className="space-y-3 text-xs pt-2">
              <div>
                <label className="block font-semibold mb-1">Select Student</label>
                <select className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]">
                  <option>2024CS001 — Aarav Mehta (Current: Section A)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Target Section</label>
                <select className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]">
                  <option>Section B</option>
                </select>
              </div>
              <button className="w-full py-2.5 bg-[#176B52] text-white font-semibold rounded-xl hover:bg-[#125440] transition-colors">
                Approve Transfer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}