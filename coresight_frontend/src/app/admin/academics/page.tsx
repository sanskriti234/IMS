'use client';

import { useEffect, useState } from 'react';
import { institutionApi } from '@/lib/api';

export default function LiveAcademicsClient() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    institutionApi.getSections()
      .then((data) => {
        setSections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load sections from FastAPI backend:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading institutional sections...</div>;

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Active Institutional Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((sec) => (
          <div key={sec.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
            <p className="font-bold text-sm">{sec.name}</p>
            <p className="text-xs text-slate-500 mt-1">Capacity: {sec.capacity_informational} students</p>
          </div>
        ))}
      </div>
    </div>
  );
}