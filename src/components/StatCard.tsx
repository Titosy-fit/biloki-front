import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  subtitle?: string;
  icon: ReactNode;
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex items-start justify-between">
      <div>
        <h3 className="text-slate-400 font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <span className="text-xs text-slate-500 mt-1 block">{subtitle}</span>}
      </div>
      <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
        {icon}
      </div>
    </div>
  );
}