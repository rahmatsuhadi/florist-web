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

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemName?: string;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemName = 'data'
}: TablePaginationProps) => {
  return (
    <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans bg-gray-50/50">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Tampilkan</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-200 rounded-lg text-sm px-2 py-1 outline-none focus:border-brand"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-500">
          dari {totalItems} {itemName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white shadow-sm"
        >
          Kembali
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors shadow-sm ${currentPage === page
                    ? "bg-brand text-white font-medium border border-brand"
                    : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200"
                    }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="text-gray-400">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white shadow-sm"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
};
