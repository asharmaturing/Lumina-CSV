import React, { useState, useMemo } from 'react';
import { CsvData } from '../types';

interface DataTableProps {
  data: CsvData;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const pageSize = 50;

  const filteredData = useMemo(() => {
    let processed = [...data.rows];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      processed = processed.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(lowerTerm)
        )
      );
    }

    // Sort
    if (sortConfig) {
      processed.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }, [data.rows, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const currentData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-xl">
      {/* Toolbar */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Data Grid</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search data..."
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-64 transition-colors"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 w-16 text-center">
                #
              </th>
              {data.headers.map((header) => (
                <th 
                  key={header} 
                  className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 cursor-pointer hover:text-indigo-400 transition-colors select-none group"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {sortConfig?.key === header && (
                      <span className="text-indigo-400">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                    {!sortConfig || sortConfig.key !== header ? (
                       <span className="opacity-0 group-hover:opacity-30 text-slate-500">↕</span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentData.length > 0 ? currentData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-xs text-slate-500 text-center font-mono border-r border-slate-800/50">
                  {(page - 1) * pageSize + idx + 1}
                </td>
                {data.headers.map((header) => (
                  <td key={`${idx}-${header}`} className="p-4 text-sm text-slate-300 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                     {row[header]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={data.headers.length + 1} className="p-12 text-center text-slate-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-between items-center text-sm text-slate-400">
        <div>
          Showing <span className="text-white font-medium">{filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="text-white font-medium">{Math.min(page * pageSize, filteredData.length)}</span> of <span className="text-white font-medium">{filteredData.length}</span> rows
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white transition-colors"
          >
            Prev
          </button>
          <div className="flex items-center gap-1 px-2">
             Page {page} of {totalPages || 1}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
