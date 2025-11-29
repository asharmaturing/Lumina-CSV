import React, { useState } from 'react';
import { DataUploader } from './components/DataUploader';
import { DataTable } from './components/DataTable';
import { ChartGallery } from './components/ChartGallery';
import { AiAnalyst } from './components/AiAnalyst';
import { parseCSV } from './utils/csvHelper';
import { CsvData, ViewMode } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<CsvData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DATA);

  const handleDataLoaded = (content: string, name: string) => {
    const parsed = parseCSV(content);
    setData(parsed);
    setFileName(name);
  };

  const handleReset = () => {
    setData(null);
    setFileName("");
    setViewMode(ViewMode.DATA);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Lumina CSV
          </h1>
        </div>

        {data && (
           <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300 truncate max-w-[150px]">{fileName}</span>
              <button 
                onClick={handleReset}
                className="ml-2 p-1 hover:bg-slate-700 rounded-full text-slate-500 hover:text-red-400 transition-colors"
                title="Remove File"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
           </div>
        )}

        <div>
           {/* Placeholder for user profile or settings */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 p-6 flex flex-col h-screen overflow-hidden">
        {!data ? (
          <DataUploader onDataLoaded={handleDataLoaded} />
        ) : (
          <div className="flex flex-col h-full gap-6">
            
            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-slate-800 pb-1">
              {[
                { id: ViewMode.DATA, label: 'Data Grid', icon: 'M3 10h18M3 14h18m-9-4v8m-7-8v8m14-8v8M3 6h18' },
                { id: ViewMode.CHARTS, label: 'Visualizations', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
                { id: ViewMode.INSIGHTS, label: 'AI Analyst', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as ViewMode)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors
                    ${viewMode === tab.id 
                      ? 'border-indigo-500 text-indigo-400 bg-slate-800/30' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     {tab.id === ViewMode.INSIGHTS && tab.icon.includes('M11') ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                     ) : tab.id === ViewMode.INSIGHTS ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                     ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                     )}
                     {/* Fix for reused logic inside map */}
                     {tab.id !== ViewMode.INSIGHTS && tab.id !== ViewMode.CHARTS && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />}
                     {tab.id === ViewMode.CHARTS && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-hidden relative animate-fade-in-up">
              {viewMode === ViewMode.DATA && <DataTable data={data} />}
              {viewMode === ViewMode.CHARTS && <ChartGallery data={data} />}
              {viewMode === ViewMode.INSIGHTS && <AiAnalyst data={data} />}
            </div>
          </div>
        )}
      </main>
      
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
