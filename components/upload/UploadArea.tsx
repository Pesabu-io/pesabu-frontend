'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatFileSize } from '@/lib/utils'; // Assuming formatFileSize is moved/will be moved

export type FileState = {
  file: File;
  name: string;
  size: number;
  type: string;
} | null;

interface UploadAreaProps {
  selectedFile: FileState;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileState>>;
  dragActive: boolean;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  selectedFile,
  setSelectedFile,
  dragActive,
  setDragActive,
}) => {
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === 'application/pdf') {
      setSelectedFile({
        file: files[0],
        name: files[0].name,
        size: files[0].size,
        type: files[0].type,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]?.type === 'application/pdf') {
      setSelectedFile({
        file: files[0],
        name: files[0].name,
        size: files[0].size,
        type: files[0].type,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative border-2 border-dashed rounded-2xl transition-all ${
        dragActive
          ? 'border-pesabu-teal bg-pesabu-teal/5'
          : 'border-gray-200 bg-gray-50/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="py-16 px-6">
        {selectedFile ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-pesabu-gold/10 rounded-full p-4 mb-4">
              <FileText className="h-12 w-12 text-pesabu-gold" />
            </div>
            <p className="text-xl font-medium mb-2 text-gray-800">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {formatFileSize(selectedFile.size)} • PDF Document
            </p>
            <p className="text-sm text-pesabu-teal">
              File selected • Click to change
            </p>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col items-center">
            <div className="bg-pesabu-teal/10 rounded-full p-4 mb-4">
              <Upload className="h-12 w-12 text-pesabu-teal" />
            </div>
            <p className="text-xl font-medium mb-2 text-gray-800">
              Drag & Drop your M-PESA statement
            </p>
            <p className="text-sm text-gray-500">
              or click to browse your files (PDF only)
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadArea;
