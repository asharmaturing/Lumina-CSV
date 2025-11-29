import React, { useState } from 'react';
import { analyzeCsvWithGemini } from '../services/geminiService';
import { CsvData } from '../types';
import ReactMarkdown from 'react-markdown';

interface AiAnalystProps {
  data: CsvData;
}

export const AiAnalyst: React.FC<AiAnalystProps> = ({ data }) => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalysis = async (customQuery?: string) => {
    setIsLoading(true);
    const result = await analyzeCsvWithGemini(data, customQuery);
    setResponse(result);
    setIsLoading(false);
    setHasAnalyzed(true);
  };

  const handleQuickQuestion = (q: string) => {
      setQuery(q);
      handleAnalysis(q);
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
           <span className="text-indigo-400">✨</span> Gemini AI Analyst
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {!hasAnalyzed && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <div>
                <h3 className="text-xl font-medium text-white mb-2">Ready to Analyze</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Gemini can identify trends, summarize data, and answer questions about your CSV file instantly.
                </p>
            </div>
            <button 
                onClick={() => handleAnalysis()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
                Generate Executive Summary
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-4">
                {['What are the outliers?', 'Summarize the numeric trends', 'Explain the categorical distribution', 'Suggest 3 actionable insights'].map(q => (
                    <button 
                        key={q}
                        onClick={() => handleQuickQuestion(q)}
                        className="p-3 text-sm text-slate-300 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-750 rounded-lg transition-colors text-left"
                    >
                        {q}
                    </button>
                ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
             <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
             </div>
             <p className="text-slate-300 animate-pulse">Consulting Gemini...</p>
          </div>
        )}

        {!isLoading && hasAnalyzed && (
          <div className="animate-fade-in space-y-4">
             {query && (
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                     <p className="text-xs text-slate-400 uppercase font-semibold mb-1">You Asked</p>
                     <p className="text-white">{query}</p>
                 </div>
             )}
             <div className="prose prose-invert prose-indigo max-w-none">
                 <ReactMarkdown>{response}</ReactMarkdown>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                if(query.trim()) handleAnalysis(query);
            }}
            className="flex gap-2"
        >
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your data..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                Send
            </button>
        </form>
      </div>
    </div>
  );
};
