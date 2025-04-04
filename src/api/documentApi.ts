import apiClient from './apiClient';

export interface Document {
  document_id: string;
  product_id: number;
  document_name: string;
  resource_type: string;
  resource_url: string;
  version: string;
  language_culture_code: string;
  friendly_name: string;
  created_by: string;
  is_active: boolean;
  source_name: string;
  document_metadata: Record<string, unknown>;
  processed_date: string;
  created_date: string;
}

interface GetProductDocumentsParams {
  limit?: number;
  offset?: number;
  source_type?: 'FILE' | 'WEB' | 'JIRA' | 'CONFLUENCE' | 'CUSTOM_WEB';
}

export const getProductDocuments = async (
  productId: string,
  params: GetProductDocumentsParams = {}
): Promise<Document[]> => {
  try {
    const response = await apiClient.get<{
      status_code: number;
      message: string;
      data: {
        documents: Document[];
        count: number;
      };
    }>(`/product/${productId}/documents`, {
      params: {
        limit: 10,
        offset: 0,
        source_type: 'FILE',
        ...params,
      },
    });
    return response.data.data?.documents || [];
  } catch (error) {
    console.error('Error fetching product documents:', error);
    throw new Error('Failed to load documents');
  }
};