
const BASE_URL = 'http://localhost:8050';


// API Call to Upload PDF and Generate Default Summary
export const uploadAndGetDefaultSummary = async (productId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/summary/product/${productId}/default_summary`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to upload PDF for default summary:', error);
    throw error;
  }
};

// API Call to Upload PDF and Generate Custom Summary
export const uploadAndGetCustomSummary = async (
  productId: string,
  file: File,
  sections: { title: string; wordLimit: number }[]
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sections', JSON.stringify(sections));

  try {
    const response = await fetch(`${BASE_URL}/summary/product/${productId}/custom_summary`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to upload PDF for custom summary:', error);
    throw error;
  }
};

// API Call to Download Summary
export const downloadSummary = async (summaryId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/summary/download_summary/${summaryId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary_${summaryId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download summary:', error);
    throw error;
  }
};
