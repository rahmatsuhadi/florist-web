import React from 'react';

export const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-brand/10 shadow-sm overflow-hidden flex flex-col">
    {children}
  </div>
);

export const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>
    <tr className="border-b border-gray-100 bg-brand-light/30 text-gray-400 font-semibold uppercase text-xs">
      {children}
    </tr>
  </thead>
);

export const TableHead = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-6 py-4 font-medium ${className}`}>
    {children}
  </th>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-50">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <tr className={`hover:bg-gray-50/50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', colSpan }: { children?: React.ReactNode, className?: string, colSpan?: number }) => (
  <td className={`px-6 py-4.5 ${className}`} colSpan={colSpan}>
    {children}
  </td>
);

