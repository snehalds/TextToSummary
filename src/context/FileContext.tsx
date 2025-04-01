import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}

// Create a context with default values
const FileContext = createContext<FileContextType | undefined>(undefined);

// Provider Component
export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};

// Custom Hook to use FileContext
export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
