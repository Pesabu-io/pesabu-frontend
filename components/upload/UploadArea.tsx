'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';

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

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <motion.div
      whileHover={!selectedFile ? { scale: 1.01 } : {}}
      className={cn(
        "relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden",
        dragActive
          ? 'border-pesabu-teal bg-gradient-to-br from-pesabu-teal/10 to-pesabu-teal/5 shadow-lg shadow-pesabu-teal/20'
          : selectedFile
          ? 'border-pesabu-teal/30 bg-gradient-to-br from-green-50/50 to-white'
          : 'border-gray-300 bg-gradient-to-br from-gray-50/50 to-white hover:border-gray-400 hover:bg-gray-50/80'
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Animated background pattern when dragging */}
      {dragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(14,121,125,0.1)_1px,transparent_0)] [background-size:20px_20px]"
        />
      )}

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      <div className="py-16 px-6 relative">
        {selectedFile ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-2xl blur-xl" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-400/10 border border-green-200 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            
            <div className="text-center space-y-2 mb-4">
              <p className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                {selectedFile.name}
                <button
                  onClick={handleRemoveFile}
                  className="p-1 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {formatFileSize(selectedFile.size)} • PDF Document
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm font-semibold text-green-700">
                File ready to upload
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal/20 to-pesabu-teal/10 rounded-2xl blur-xl" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-pesabu-teal/10 to-pesabu-teal/5 border border-pesabu-teal/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10 text-pesabu-teal" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Drag & Drop your M-PESA statement
            </p>
            <p className="text-gray-600 text-sm font-medium">
              or <span className="text-pesabu-teal font-semibold">click to browse</span> your files
            </p>
            <p className="text-xs text-gray-500 mt-2">PDF files only</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadArea;
