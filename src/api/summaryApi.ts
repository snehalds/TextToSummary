// src/api/summaryApi.ts
import apiClient from './apiClient';

interface SummaryResponse {
  summary_id: string;
  summary_text: string;
}

interface ErrorResponse {
  detail: string;
}

// Upload PDF and get the default summary
export const getDefaultSummary = async (productId: string, file: File): Promise<SummaryResponse | ErrorResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/summary/product/${productId}/default_summary`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
     // Add timeout
     timeout: 30000,
     // Add error handling
     validateStatus: (status) => {
       return status >= 200 && status < 300;
     }
   });

    return response.data;

 } catch (error: any) {
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.data);
      return { detail: error.response.data.message || 'Server error occurred' };
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
      return { detail: 'Network error - server not responding' };
    } else {
      // Error setting up request
      console.error('Request error:', error.message);
      return { detail: 'Error setting up request' };
    }
  }
};

// Upload PDF and get the custom summary
export const getCustomSummary = async (
  productId: string,
  file: File,
  sections: { section_name: string; word_limit: number }[]
): Promise<SummaryResponse | ErrorResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sections', JSON.stringify(sections));

    const response = await apiClient.post(`/summary/product/${productId}/custom_summary`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error during custom summarization:', error);
    throw error?.response?.data || { detail: 'Unknown error occurred' };
  }
};
