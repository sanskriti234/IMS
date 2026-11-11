'use client';

import { useState } from 'react';
import { AdminNavbar } from '@/components/navigation/AdminNavbar';
import { Users, Plus, Mail, BookOpen, Shield } from 'lucide-react';

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'add' | 'assignments'>('directory');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="font-display text-3xl font-bold">Department Faculty</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Directory & Assignments for Computer Science Faculty
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('add')}
            className="px-4 py-2 rounded-xl bg-[#176B52] hover:bg-[#125440] text-white text-xs font-medium transition-all shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Department Faculty
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'directory' ? 'border-[#176B52] text-[#176B52]' : 'border-transparent text-slate-500'
            }`}
          >
            Faculty Directory
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'assignments' ? 'border-[#176B52] text-[#176B52]' : 'border-transparent text-slate-500'
            }`}
          >
            Assignments (Teaching vs Mentorship)
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'add' ? 'border-[#176B52] text-[#176B52]' : 'border-transparent text-slate-500'
            }`}
          >
            Add New Faculty
          </button>
        </div>

        {/* Directory View */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Anita Sharma', role: 'Associate Professor', email: 'a.sharma@cs.edu', courses: 2 },
              { name: 'Prof. Ramesh Verma', role: 'Assistant Professor', email: 'r.verma@cs.edu', courses: 3 },
              { name: 'Dr. Kavita Patel', role: 'Professor & HOD Assistant', email: 'k.patel@cs.edu', courses: 1 },
            ].map((faculty, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#176B52]/10 text-[#176B52] font-bold flex items-center justify-center">
                    {faculty.name[4]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{faculty.name}</h3>
                    <p className="text-xs text-slate-500">{faculty.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {faculty.email}</div>
                  <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> {faculty.courses} Active Courses</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workload Assignments View */}
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Teaching Assignments */}
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#176B52] font-bold text-base">
                <BookOpen className="w-5 h-5" /> Course Teaching Assignments
              </div>
              <p className="text-xs text-slate-500">Assign faculty to specific subject offerings and sections.</p>
              
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                <p className="text-xs font-bold">Algorithms (CS501) → Section A</p>
                <p className="text-xs text-slate-500">Faculty: Dr. Kavita Patel</p>
              </div>
            </div>

            {/* Mentorship Assignments */}
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#176B52] font-bold text-base">
                <Shield className="w-5 h-5" /> Student Mentorship Assignments
              </div>
              <p className="text-xs text-slate-500">Assign faculty mentors to student cohorts for guidance.</p>
              
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-2">
                <p className="text-xs font-bold">Batch 2025-29 (Section A Mentorship)</p>
                <p className="text-xs text-slate-500">Mentor: Dr. Anita Sharma (30 Mentees)</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Faculty Form View */}
        {activeTab === 'add' && (
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-5">
            <h2 className="font-display font-bold text-xl">Register New Faculty</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input type="text" placeholder="Dr. Firstname Lastname" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Institutional Email</label>
                <input type="email" placeholder="faculty@cs.edu" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Designation</label>
                <select className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] font-medium">
                  <option>Assistant Professor</option>
                  <option>Associate Professor</option>
                  <option>Professor</option>
                </select>
              </div>
              <button className="w-full py-3 bg-[#176B52] text-white font-semibold rounded-xl hover:bg-[#125440] transition-colors">
                Add Faculty Member
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}