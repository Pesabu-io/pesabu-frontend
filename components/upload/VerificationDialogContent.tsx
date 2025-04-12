'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface VerificationDialogContentProps {
  isUploading: boolean;
  uploadProgress: number;
  processingStage: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  handleVerification: () => void;
}

const VerificationDialogContent: React.FC<VerificationDialogContentProps> = ({
  isUploading,
  uploadProgress,
  processingStage,
  verificationCode,
  setVerificationCode,
  handleVerification,
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center text-pesabu-teal">Statement Password</DialogTitle>
        <DialogDescription className="text-center mt-2">
          Enter the 6-digit password provided with your M-PESA statement
        </DialogDescription>
      </DialogHeader>
      {isUploading ? (
        <div className="py-8 flex flex-col items-center space-y-6">
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <motion.div
              className="bg-pesabu-teal h-2.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-pesabu-teal font-medium text-center mt-4">{processingStage || "Processing..."}</p>
          <div className="flex justify-center items-center mt-4">
             <Loader2 className="h-8 w-8 text-pesabu-teal animate-spin" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 py-4">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={setVerificationCode}
            className="gap-3"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="rounded-xl h-14 w-14 text-xl" />
              <InputOTPSlot index={1} className="rounded-xl h-14 w-14 text-xl" />
              <InputOTPSlot index={2} className="rounded-xl h-14 w-14 text-xl" />
              <InputOTPSlot index={3} className="rounded-xl h-14 w-14 text-xl" />
              <InputOTPSlot index={4} className="rounded-xl h-14 w-14 text-xl" />
              <InputOTPSlot index={5} className="rounded-xl h-14 w-14 text-xl" />
            </InputOTPGroup>
          </InputOTP>
          <Button
            onClick={handleVerification}
            className="w-full bg-pesabu-teal hover:bg-pesabu-teal/90 py-6 h-auto text-lg rounded-xl font-medium shadow transition-all"
            disabled={verificationCode.length !== 6}
          >
            Verify & Process
          </Button>
        </div>
      )}
      <DialogFooter className="sm:justify-center mt-2">
        <p className="text-xs text-gray-500 text-center flex items-center justify-center">
          <Lock className="h-3 w-3 mr-1" />
          This password is provided in your statement PDF
        </p>
      </DialogFooter>
    </>
  );
};

export default VerificationDialogContent;
