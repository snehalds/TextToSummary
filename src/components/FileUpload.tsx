// import { FaFileUpload } from 'react-icons/fa';
// import { CgAdd } from "react-icons/cg";
// export default function FileUpload() {
//   return (
//     <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center ml-6">
//       <FaFileUpload className="text-cyan-500 text-4xl mx-auto" />
//       <h2 className="text-2xl font-semibold my-4">Upload your PDF</h2>
//       <p className="text-gray-500 text-xl mb-2">Drag and drop or click to browse</p>
//       <button className="bg-cyan-600 text-white px-12 py-4 rounded-lg text-xl mt-5"> <CgAdd />Select PDF</button>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';
import { CgAdd } from 'react-icons/cg';
import { useFile } from '../context/FileContext';

export default function FileUpload({ productId }: { productId: string }) {
  const { setFile, file } = useFile();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      console.log('File selected:', selectedFile);

      try {
        setLoading(true);
        const response = await getDefaultSummary(productId, selectedFile);
        if ('summary_text' in response) {
          setSummary(response.summary_text);
        } else {
          console.error(response.detail);
        }
      } catch (error) {
        console.error('Error while uploading:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
      <FaFileUpload className="text-cyan-500 text-4xl mx-auto" />
      <h2 className="text-2xl font-semibold my-4">Upload your PDF</h2>
      <p className="text-gray-500 text-xl mb-2">Drag and drop or click to browse</p>

      <label htmlFor="file-upload" className="bg-cyan-600 text-white px-10 py-4 rounded-lg text-xl mt-5 w-60 mx-auto flex items-center justify-center gap-2 cursor-pointer">
        <CgAdd className="text-2xl" />
        Select PDF
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {loading && <p className="text-cyan-600 mt-4">Uploading and summarizing...</p>}
      {summary && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-bold text-cyan-700">Summary:</h3>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  );
}
