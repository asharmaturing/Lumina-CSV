import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { CsvData, ColumnStats } from '../types';
import { analyzeColumns } from '../utils/csvHelper';

interface ChartGalleryProps {
  data: CsvData;
}

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444'];

export const ChartGallery: React.FC<ChartGalleryProps> = ({ data }) => {
  const stats = useMemo(() => analyzeColumns(data), [data]);
  
  // Identify potential categorical and numerical columns
  const numericColumns = stats.filter(s => s.type === 'number');
  const categoricalColumns = stats.filter(s => s.type === 'string' && s.uniqueCount < 20); // Low cardinality for grouping

  // 1. Distribution of First Numerical Column (Bar)
  const renderDistributionChart = () => {
    if (numericColumns.length === 0 || categoricalColumns.length === 0) return null;
    
    const catCol = categoricalColumns[0].field;
    const numCol = numericColumns[0].field;

    // Aggregate data
    const aggData: Record<string, number> = {};
    data.rows.forEach(row => {
      const key = String(row[catCol]);
      const val = Number(row[numCol]) || 0;
      aggData[key] = (aggData[key] || 0) + val;
    });

    const chartData = Object.entries(aggData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10

    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-slate-200 font-semibold mb-4">Total {numCol} by {catCol}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tick={{fill: '#94a3b8'}} />
              <YAxis stroke="#94a3b8" fontSize={12} tick={{fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 2. Trend Line (First Numeric across Rows - simulating time series if applicable)
  const renderTrendChart = () => {
    if (numericColumns.length === 0) return null;
    const numCol = numericColumns[0].field;
    
    // Just take first 50 points to avoid clutter if huge
    const chartData = data.rows.slice(0, 50).map((row, idx) => ({
      index: idx,
      value: Number(row[numCol]) || 0
    }));

    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-slate-200 font-semibold mb-4">{numCol} Trend (First 50 Rows)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#94a3b8" hide />
              <YAxis stroke="#94a3b8" fontSize={12} tick={{fill: '#94a3b8'}} />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 3. Composition (Pie)
  const renderCompositionChart = () => {
    if (categoricalColumns.length === 0) return null;
    const catCol = categoricalColumns[0].field;

    // Count frequency
    const freq: Record<string, number> = {};
    data.rows.forEach(row => {
      const key = String(row[catCol]);
      freq[key] = (freq[key] || 0) + 1;
    });

    const chartData = Object.entries(freq)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6

    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-slate-200 font-semibold mb-4">{catCol} Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (numericColumns.length === 0 && categoricalColumns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-12">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p>Not enough numeric or categorical data to generate charts automatically.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1 overflow-auto max-h-full pb-20">
      {renderDistributionChart()}
      {renderTrendChart()}
      {renderCompositionChart()}
      {/* Fallback info */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center">
        <h3 className="text-slate-200 font-semibold mb-2">Dataset Stats</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
            <li>Rows: <span className="text-white">{data.rows.length}</span></li>
            <li>Columns: <span className="text-white">{data.headers.length}</span></li>
            <li>Numeric Fields: <span className="text-white">{numericColumns.map(c => c.field).join(', ') || 'None'}</span></li>
            <li>Categorical Fields: <span className="text-white">{categoricalColumns.map(c => c.field).join(', ') || 'None'}</span></li>
        </ul>
      </div>
    </div>
  );
};
