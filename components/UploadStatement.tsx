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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROVIDER_OPTIONS = [
  { value: "mpesa", label: "Safaricom" },
  { value: "airtel_money", label: "Airtel Money" },
  { value: "tkash", label: "T-Kash" },
];

const isPasswordError = (message: string) => {
  const normalized = message.toLowerCase();
  return normalized.includes("failed to decrypt pdf") || normalized.includes("password");
};

const UploadStatement = () => {
  const [selectedFile, setSelectedFile] = useState<FileState>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("mpesa");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const uploadStatement = async (password: string) => {
    if (!selectedFile) {
      throw new Error("No file selected. Please select a file again.");
    }

    const formData = new FormData();
    formData.append("file", selectedFile.file);
    formData.append("password", password);
    formData.append("provider", selectedProvider);

    console.log("Attempting to upload file...");
    const uploadResponse = await fetch(`${server}/file/uploadfileandclean/`, {
      method: "POST",
      body: formData,
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("Upload response received:", uploadResponse.status);

    if (!uploadResponse.ok) {
      let errorMessage = "Upload failed";
      try {
        const errorData = await uploadResponse.json();
        if (typeof errorData?.detail === "string") {
          errorMessage = errorData.detail;
        } else if (typeof errorData?.detail?.error === "string") {
          errorMessage = errorData.detail.error;
        }
      } catch {
        // fall back to default message
      }
      throw new Error(errorMessage);
    }

    const responseData = await uploadResponse.json();
    console.log("Upload response data:", responseData);

    return responseData;
  };

  const finalizeSuccessfulUpload = async (responseData: {
    client_name?: string;
    mobile_number?: string;
    dataframe?: unknown[];
    provider?: string;
    provider_id?: string;
  }) => {
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

    const { client_name, mobile_number, dataframe, provider, provider_id } = responseData;

    if (client_name) localStorage.setItem("statementClientName", client_name);
    if (mobile_number) localStorage.setItem("statementMobileNumber", mobile_number);
    if (dataframe) localStorage.setItem("statementData", JSON.stringify(dataframe));
    if (provider) localStorage.setItem("statementProviderName", provider);
    if (provider_id) localStorage.setItem("statementProviderId", provider_id);

    setIsVerificationOpen(false);
    setVerificationCode("");
    setIsUploading(false);
    router.push("/insights");
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStage("Uploading file...");

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    try {
      simulateProgress();
      setProcessingStage("Checking file security...");
      const responseData = await uploadStatement("");
      await finalizeSuccessfulUpload(responseData);
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      const message = error instanceof Error ? error.message : "An unknown error occurred";
      if (isPasswordError(message)) {
        setIsUploading(false);
        setUploadProgress(0);
        setProcessingStage("");
        setIsVerificationOpen(true);
        toast({
          title: "Password Required",
          description: "This statement is password-protected. Enter the PDF password to continue.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: message,
      });
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStage("");
    }
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
    if (verificationCode.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Missing password",
        description: "Please enter your statement PDF password",
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

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    try {
      simulateProgress();
      setProcessingStage("Processing your statement...");
      const responseData = await uploadStatement(verificationCode);
      await finalizeSuccessfulUpload(responseData);

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
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
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

          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <UploadHeader
                providerLabel={
                  PROVIDER_OPTIONS.find((option) => option.value === selectedProvider)?.label || "Safaricom"
                }
              />

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

                  <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="mb-5 sm:mb-6 md:mb-8">
                      <p className="mb-2 text-sm font-semibold text-gray-700">Mobile Money Provider</p>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger className="h-11 rounded-xl border-gray-300 bg-white">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-2 text-xs text-gray-500">
                        Choose the provider that matches your uploaded statement.
                      </p>
                    </div>

                    <UploadArea
                      selectedFile={selectedFile}
                      setSelectedFile={setSelectedFile}
                      dragActive={dragActive}
                      setDragActive={setDragActive}
                      providerLabel={
                        PROVIDER_OPTIONS.find((option) => option.value === selectedProvider)?.label || "Safaricom"
                      }
                    />

                    {/* Security note */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-gray-600 text-xs sm:text-sm"
                    >
                      <div className="p-1.5 rounded-lg bg-green-100">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <span className="font-medium">Your data is encrypted and secure</span>
                    </motion.div>

                    {/* Upload button */}
                    <div className="mt-6 sm:mt-8 md:mt-10 text-center">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={isUploading || !selectedFile}
                          className="relative group overflow-hidden bg-gradient-to-r from-pesabu-teal via-pesabu-teal/95 to-pesabu-teal hover:from-pesabu-teal/90 hover:via-pesabu-teal hover:to-pesabu-teal/90 text-white text-base sm:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 h-auto rounded-xl sm:rounded-2xl font-semibold shadow-xl shadow-pesabu-teal/30 hover:shadow-2xl hover:shadow-pesabu-teal/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-pesabu-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative z-10 flex items-center gap-2">
                            {isUploading ? (
                              <>
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="text-sm sm:text-base">Processing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">Upload & Process Statement</span>
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
              providerLabel={
                PROVIDER_OPTIONS.find((option) => option.value === selectedProvider)?.label || "Safaricom"
              }
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
