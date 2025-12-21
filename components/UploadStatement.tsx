'use client'

import React, { useState, useEffect, useRef } from "react"; // Added React import
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {  Shield, } from "lucide-react"; // Removed Upload
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UploadArea, { FileState } from "./upload/UploadArea";
import VerificationDialogContent from "./upload/VerificationDialogContent";
import UploadHeader from "./upload/UploadHeader";
import InfoCards from "./upload/InfoCards"; // Import the new info cards component
import {
  Dialog,
  DialogContent,
 
} from "@/components/ui/dialog";

import { motion } from "framer-motion";
import { server } from "@/utils/util";
// Removed FileState type definition

const UploadStatement =
 () => {
  const [selectedFile, setSelectedFile] = useState<FileState>(null); // Use imported FileState type
  const [dragActive, setDragActive] = useState<boolean>(false); // Keep dragActive state here for UploadArea prop
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);


  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Removed handleDrag, handleDrop, handleFileInput (moved to UploadArea)

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

  // Simulate progress updates during upload
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

    // Add null check for selectedFile to satisfy TypeScript
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected. Please select a file again.",
      });
      setIsVerificationOpen(false); // Close the dialog if no file somehow
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStage("Uploading file...");

    const formData = new FormData();
    formData.append("file", selectedFile.file);
    formData.append("password", verificationCode);

    // Clear any existing intervals
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    try {
      console.log("Attempting to upload file...");

      // Start simulating progress
      simulateProgress();
      setProcessingStage("Processing your statement...");

      // Upload file and process synchronously
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

      // Clear progress interval and set to 100%
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setUploadProgress(100);
      setProcessingStage("Processing complete!");

      // Wait a moment for the user to see the 100% completion
      await new Promise(resolve => setTimeout(resolve, 1200));

      toast({
        title: "Success",
        description: "Statement uploaded and processed successfully",
      });

      // Store the data and redirect
      const { client_name, mobile_number, dataframe } = responseData;

      if (client_name) localStorage.setItem('statementClientName', client_name);
      if (mobile_number) localStorage.setItem('statementMobileNumber', mobile_number);
      if (dataframe) localStorage.setItem('statementData', JSON.stringify(dataframe));

      setIsVerificationOpen(false);
      setIsUploading(false);
      router.push("/insights");

    } catch (error) {
      console.error("Upload error:", error);

      // Clear intervals on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });

      // Reset the loading state but keep the dialog open for retry
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStage("");
    }
  };
  // Removed formatFileSize function (moved to lib/utils)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {/* Use UploadHeader component */}
            <UploadHeader />

            {/* Main upload card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Gradient top banner */}
              <div className="bg-gradient-to-r from-pesabu-teal to-pesabu-teal/80 h-4"></div>

              <div className="p-8 md:p-10">
                {/* Use UploadArea component */}
                <UploadArea
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  dragActive={dragActive}
                  setDragActive={setDragActive}
                />

                {/* Security note */}
                <div className="mt-8 flex items-center justify-center text-gray-500 text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Your data is encrypted and secure</span>
                </div>

                {/* Upload button */}
                <div className="mt-8 text-center">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={handleSubmit}
                      className="bg-pesabu-teal hover:bg-pesabu-teal/90 text-white text-lg px-12 py-6 h-auto rounded-xl font-medium transition-all shadow"
                      size="lg"
                      disabled={isUploading || !selectedFile}
                    >
                      {isUploading ? "Processing..." : "Upload & Process Statement"}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Use InfoCards component */}
            <InfoCards />

          </motion.div>
        </main>
      </div>

      {/* Verification Dialog */}
      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          {/* Use VerificationDialogContent component */}
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
  );
};

export default UploadStatement;
