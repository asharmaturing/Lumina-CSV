import { CsvData, ColumnStats } from '../types';

export const parseCSV = (text: string): CsvData => {
  const lines = text.split(/\r\n|\n/);
  const dataLines = lines.filter(line => line.trim() !== '');
  
  if (dataLines.length === 0) {
    return { headers: [], rows: [], rawRows: [] };
  }

  // Simple parser handling comma separation. 
  // For production, a robust parser handling quotes containing commas is preferred.
  // We will implement a basic quoted-value aware splitter.
  
  const splitLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"')); // Remove surrounding quotes and unescape
  };

  const headers = splitLine(dataLines[0]);
  const rawRows: string[][] = [];
  const rows: Record<string, string | number>[] = [];

  for (let i = 1; i < dataLines.length; i++) {
    const currentLine = splitLine(dataLines[i]);
    // Skip if mismatched columns (simple validation)
    if (currentLine.length === headers.length) {
      rawRows.push(currentLine);
      const rowObj: Record<string, string | number> = {};
      headers.forEach((header, index) => {
        const val = currentLine[index];
        const numVal = parseFloat(val);
        // Basic number detection
        rowObj[header] = !isNaN(numVal) && val.trim() !== '' ? numVal : val;
      });
      rows.push(rowObj);
    }
  }

  return { headers, rows, rawRows };
};

export const analyzeColumns = (data: CsvData): ColumnStats[] => {
  if (data.headers.length === 0) return [];

  return data.headers.map(header => {
    const values = data.rows.map(row => row[header]);
    const definedValues = values.filter(v => v !== undefined && v !== null && v !== '');
    
    // Determine type
    const isNumber = definedValues.every(v => typeof v === 'number');
    const uniqueValues = new Set(definedValues);
    
    const stats: ColumnStats = {
      field: header,
      type: isNumber ? 'number' : 'string',
      uniqueCount: uniqueValues.size
    };

    if (isNumber) {
      const numValues = definedValues as number[];
      stats.min = Math.min(...numValues);
      stats.max = Math.max(...numValues);
    }

    return stats;
  });
};
