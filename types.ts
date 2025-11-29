export interface CsvData {
  headers: string[];
  rows: Record<string, string | number>[];
  rawRows: string[][]; // Keep raw order for safety
}

export interface AnalysisResult {
  summary: string;
  insights: string[];
  suggestedCharts?: string[];
}

export enum ViewMode {
  DATA = 'DATA',
  CHARTS = 'CHARTS',
  INSIGHTS = 'INSIGHTS'
}

export interface ColumnStats {
  field: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  uniqueCount: number;
  min?: number;
  max?: number;
}
