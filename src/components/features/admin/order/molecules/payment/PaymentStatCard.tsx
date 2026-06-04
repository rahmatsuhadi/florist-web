import React from 'react';

interface PaymentStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: 'emerald' | 'indigo' | 'amber';
}

export const PaymentStatCard = ({ title, value, icon: Icon, colorClass }: PaymentStatCardProps) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    amber: 'bg-amber-50 text-amber-700'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-brand/10 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[colorClass]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-lg font-bold text-gray-900">{value}</h4>
      </div>
    </div>
  );
};
