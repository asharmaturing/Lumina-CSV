import { GoogleGenAI } from "@google/genai";
import { CsvData } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCsvWithGemini = async (data: CsvData, query?: string): Promise<string> => {
  try {
    const ai = getGeminiClient();
    
    // Create a truncated version of data to save tokens but give context
    const headers = data.headers.join(',');
    const sampleRows = data.rawRows.slice(0, 15).map(row => row.join(',')).join('\n');
    const rowCount = data.rawRows.length;
    
    const context = `
      I have a dataset with ${rowCount} rows.
      The headers are: ${headers}
      Here are the first 15 rows of data:
      ${sampleRows}
    `;

    const prompt = query 
      ? `${context}\n\nUser Question: ${query}\nPlease answer the user's question based on the data sample provided. If you need more info, make reasonable assumptions based on column names.`
      : `${context}\n\nPlease provide a concise executive summary of this dataset. Identify key trends, potential outliers, and what this data likely represents. Format the output with clear Markdown headings and bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep thought for this interactive tool
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze data. Please check your API key or try again.";
  }
};
