'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface VerificationDialogContentProps {
  isUploading: boolean;
  uploadProgress: number;
  processingStage: string;
  verificationCode: string;
  providerLabel: string;
  setVerificationCode: (code: string) => void;
  handleVerification: () => void;
}

const VerificationDialogContent: React.FC<VerificationDialogContentProps> = ({
  isUploading,
  uploadProgress,
  processingStage,
  verificationCode,
  providerLabel,
  setVerificationCode,
  handleVerification,
}) => {
  return (
    <>
      <DialogHeader className="space-y-3">
        <div className="flex items-center justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal/20 to-pesabu-teal/10 rounded-2xl blur-xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pesabu-teal/10 to-pesabu-teal/5 border border-pesabu-teal/20 flex items-center justify-center">
              <Lock className="h-8 w-8 text-pesabu-teal" />
            </div>
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold text-center text-gray-900">
          Statement Password
        </DialogTitle>
        <DialogDescription className="text-center text-gray-600">
          This file appears to be password-protected. Enter the password for your {providerLabel} statement PDF.
        </DialogDescription>
      </DialogHeader>
      
      {isUploading ? (
        <div className="py-8 flex flex-col items-center space-y-6">
          {/* Progress Bar */}
          <div className="w-full space-y-3">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-pesabu-teal via-pesabu-teal/90 to-pesabu-teal h-3 rounded-full relative overflow-hidden"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">{processingStage || "Processing..."}</span>
              <span className="text-pesabu-teal font-bold">{uploadProgress}%</span>
            </div>
          </div>
          
          {/* Loading Spinner */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-pesabu-teal/20 rounded-full blur-xl" />
              <Loader2 className="relative h-10 w-10 text-pesabu-teal animate-spin" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Please wait while we process your statement...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8 py-4">
          <Input
            type="password"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter statement PDF password"
            className="h-12 rounded-xl border-2 border-gray-200 px-4 text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleVerification();
              }
            }}
          />
          
          <Button
            onClick={handleVerification}
            disabled={verificationCode.trim().length === 0}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-pesabu-teal via-pesabu-teal/95 to-pesabu-teal hover:from-pesabu-teal/90 hover:via-pesabu-teal hover:to-pesabu-teal/90 text-white py-6 h-auto text-lg rounded-2xl font-semibold shadow-xl shadow-pesabu-teal/30 hover:shadow-2xl hover:shadow-pesabu-teal/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pesabu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Verify & Process
            </span>
          </Button>
        </div>
      )}
      
      <DialogFooter className="sm:justify-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="p-1 rounded-lg bg-gray-100">
            <Lock className="h-3 w-3" />
          </div>
          <span>This password is provided in your statement PDF</span>
        </div>
      </DialogFooter>
    </>
  );
};

export default VerificationDialogContent;
