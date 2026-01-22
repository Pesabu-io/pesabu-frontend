'use client'

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UploadArea, { FileState } from "./upload/UploadArea";
import VerificationDialogContent from "./upload/VerificationDialogContent";
import UploadHeader from "./upload/UploadHeader";
import InfoCards from "./upload/InfoCards";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { server } from "@/utils/util";
import ProtectedRoute from "@/components/ProtectedRoute";

const UploadStatement = () => {
  const [selectedFile, setSelectedFile] = useState<FileState>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload",
      });
      return;
    }
    setIsVerificationOpen(true);
  };

  const simulateProgress = () => {
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) {
        progress = 90;
        clearInterval(interval);
      }
      setUploadProgress(Math.min(progress, 90));
    }, 500);
    progressIntervalRef.current = interval;
  };

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a 6-digit verification code",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected. Please select a file again.",
      });
      setIsVerificationOpen(false);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStage("Uploading file...");

    const formData = new FormData();
    formData.append("file", selectedFile.file);
    formData.append("password", verificationCode);

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    try {
      console.log("Attempting to upload file...");
      simulateProgress();
      setProcessingStage("Processing your statement...");

      const uploadResponse = await fetch(`${server}/file/uploadfileandclean/`, {
        method: "POST",
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log("Upload response received:", uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const responseData = await uploadResponse.json();
      console.log("Upload response data:", responseData);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setUploadProgress(100);
      setProcessingStage("Processing complete!");

      await new Promise(resolve => setTimeout(resolve, 1200));

      toast({
        title: "Success",
        description: "Statement uploaded and processed successfully",
      });

      const { client_name, mobile_number, dataframe } = responseData;

      if (client_name) localStorage.setItem('statementClientName', client_name);
      if (mobile_number) localStorage.setItem('statementMobileNumber', mobile_number);
      if (dataframe) localStorage.setItem('statementData', JSON.stringify(dataframe));

      setIsVerificationOpen(false);
      setIsUploading(false);
      router.push("/insights");

    } catch (error) {
      console.error("Upload error:", error);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });

      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStage("");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto relative">
          {/* Premium Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 z-0"></div>
          
          {/* Animated background elements */}
          <div className="absolute w-full h-full overflow-hidden pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -right-20 w-96 h-96 bg-pesabu-gold/10 rounded-full blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 10, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 -left-20 w-96 h-96 bg-pesabu-teal/10 rounded-full blur-3xl"
            />
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] [background-size:40px_40px]" />
            </div>
          </div>

          <Header />
          <main className="relative z-10 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <UploadHeader />

              {/* Main upload card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pesabu-teal/20 to-pesabu-teal/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/60 overflow-hidden">
                  {/* Premium gradient top banner */}
                  <div className="relative h-2 bg-gradient-to-r from-pesabu-teal via-pesabu-teal/90 to-pesabu-teal/80">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  <div className="p-8 md:p-12">
                    <UploadArea
                      selectedFile={selectedFile}
                      setSelectedFile={setSelectedFile}
                      dragActive={dragActive}
                      setDragActive={setDragActive}
                    />

                    {/* Security note */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 flex items-center justify-center gap-2 text-gray-600 text-sm"
                    >
                      <div className="p-1.5 rounded-lg bg-green-100">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">Your data is encrypted and secure</span>
                    </motion.div>

                    {/* Upload button */}
                    <div className="mt-10 text-center">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={isUploading || !selectedFile}
                          className="relative group overflow-hidden bg-gradient-to-r from-pesabu-teal via-pesabu-teal/95 to-pesabu-teal hover:from-pesabu-teal/90 hover:via-pesabu-teal hover:to-pesabu-teal/90 text-white text-lg px-10 py-6 h-auto rounded-2xl font-semibold shadow-xl shadow-pesabu-teal/30 hover:shadow-2xl hover:shadow-pesabu-teal/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-pesabu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative z-10 flex items-center gap-2">
                            {isUploading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5" />
                                Upload & Process Statement
                              </>
                            )}
                          </span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <InfoCards />
            </motion.div>
          </main>
        </div>

        {/* Verification Dialog */}
        <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/60 shadow-2xl">
            <VerificationDialogContent
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              processingStage={processingStage}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              handleVerification={handleVerification}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default UploadStatement;
