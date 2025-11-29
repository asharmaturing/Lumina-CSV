import React, { useRef, useState } from 'react';

interface DataUploaderProps {
  onDataLoaded: (fileContent: string, fileName: string) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onDataLoaded(text, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full p-8 animate-fade-in">
      <div 
        className={`
          relative flex flex-col items-center justify-center w-full max-w-2xl p-12 
          border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv" 
          className="hidden" 
        />
        
        <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Upload your CSV</h3>
        <p className="text-slate-400 text-center mb-6 max-w-md">
          Drag and drop your dataset here, or click to browse. 
          <br/>We'll visualize it instantly.
        </p>

        {error && (
          <div className="absolute bottom-4 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">Don't have a file?</p>
        <button 
          onClick={() => {
            const sampleCsv = `Date,Product,Region,Sales,Units,Satisfaction
2024-01-01,Laptop,North,1200,4,4.5
2024-01-02,Mouse,South,45,15,4.2
2024-01-03,Monitor,East,350,2,4.8
2024-01-04,Laptop,West,1200,3,3.9
2024-01-05,Keyboard,North,85,10,4.1
2024-01-06,Mouse,East,45,20,4.0
2024-01-07,Monitor,South,350,5,4.7
2024-01-08,Headset,West,120,8,4.3
2024-01-09,Laptop,North,1250,5,4.6
2024-01-10,Keyboard,South,90,12,4.0`;
            onDataLoaded(sampleCsv, "sample_sales_data.csv");
          }}
          className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm underline transition-colors"
        >
          Load Sample Data
        </button>
      </div>
    </div>
  );
};
