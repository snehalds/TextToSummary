import React, { useEffect, useState, useCallback } from 'react';
import { getProductDocuments, Document } from '../api/documentApi';
import { getSummaryInfo, previewSummary, generateSummary, SummaryInfo } from '../api/summaryApi';

interface DocumentListProps {
  productId: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ productId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [summaries, setSummaries] = useState<SummaryInfo[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<SummaryInfo | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoadingPreviews, setIsLoadingPreviews] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [docs, summaryData] = await Promise.all([
        getProductDocuments(productId),
        getSummaryInfo()
      ]);
      
      setDocuments(docs);
      setSummaries(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleGenerateSummary = async () => {
    if (selectedDocs.length === 0) {
      setError('Please select at least one document');
      return;
    }

    try {
      setIsGenerating(true);
      await generateSummary(productId, selectedDocs);
      // Refresh the summary list after generation
      const updatedSummaries = await getSummaryInfo();
      setSummaries(updatedSummaries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async (summaryId: number) => {
    setIsLoadingPreviews(prev => ({ ...prev, [summaryId]: true }));
    try {
      const content = await previewSummary(summaryId);
      setPreviewContent(content);
      setSelectedSummary(summaries.find(s => s.summary_id === summaryId) || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setIsLoadingPreviews(prev => ({ ...prev, [summaryId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Documents for Product {productId}</h3>
        <div className="max-h-96 overflow-y-auto border rounded">
          {documents.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No documents found</div>
          ) : (
            documents.map(doc => (
              <div 
                key={doc.document_id} 
                className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc.document_id)}
                  onChange={() => toggleDocumentSelection(doc.document_id)}
                  className="mr-3 h-4 w-4"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.document_name}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(doc.created_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {documents.length > 0 && (
          <button
            onClick={handleGenerateSummary}
            disabled={selectedDocs.length === 0 || isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : `Generate Summary (${selectedDocs.length} selected)`}
          </button>
        )}
      </div>

      {/* Summary History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Previous Summaries</h3>
        {summaries.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No summaries available</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {summaries.map(summary => (
              <div key={summary.summary_id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{summary.summary_name}</h4>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      Documents: {summary.document_names.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(summary.created_date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreview(summary.summary_id)}
                    disabled={isLoadingPreviews[summary.summary_id]}
                    className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isLoadingPreviews[summary.summary_id] ? 'Loading...' : 'Preview'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {selectedSummary && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold truncate">
              Preview: {selectedSummary.summary_name}
            </h3>
          </div>
          <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
            {previewContent ? (
              <div dangerouslySetInnerHTML={{ __html: previewContent }} />
            ) : (
              'No preview content available'
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;