import apiClient from './apiClient';

export interface SummaryInfo {
  summary_id: number;
  document_ids: string[];
  document_names: string[];
  summary_name: string;
  created_date: string;
  created_by: string;
  status?: string;
}

interface PreviewSummaryResponse {
  status: number;
  summary_id: number;
  content: string;
}


export const getSummaryInfo = async (): Promise<SummaryInfo[]> => {
    try {
      const response = await apiClient.get<{
        status: number;
        data?: SummaryInfo[]; // Handle cases where `data` might be missing
      }>('/summary/summary_info');
  
      return response.data?.data || []; // ✅ Ensure it returns an empty array if no summaries exist
    } catch (error) {
      console.error('Error fetching summary info:', error);
      throw new Error('Failed to load summary history');
    }
  };
  

export const previewSummary = async (summaryId: number): Promise<string> => {
  try {
    const response = await apiClient.get<PreviewSummaryResponse>(
      `/summary/preview_summary/${summaryId}`
    );
    return response.data.content || 'No content available';
  } catch (error) {
    console.error('Error previewing summary:', error);
    throw new Error('Failed to load preview');
  }
};

export const generateSummary = async (productId: string, documentIds: string[]): Promise<void> => {
    try {
      const documentIdsQuery = documentIds.join(","); 
  
      console.log("🔹 Generating summary with data:", {
        url: `/summary/product/${productId}/default_summary`,
        params: { document_ids: documentIdsQuery },
      });
  
      await apiClient.post(
        `/summary/product/${productId}/default_summary`,
        null,
        {
          params: { document_ids: documentIdsQuery }, 
        }
      );
  
      console.log("✅ Summary generation request sent successfully");
    } catch (error: any) {
      console.error("❌ Error generating summary:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to generate summary");
    }
  };
  