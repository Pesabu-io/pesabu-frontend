'use client'

import React, { useState, useEffect, useRef } from "react"; // Added React import
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Lock, Shield, Loader2 } from "lucide-react"; // Removed Upload
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UploadArea, { FileState } from "./upload/UploadArea";
import VerificationDialogContent from "./upload/VerificationDialogContent";
import UploadHeader from "./upload/UploadHeader";
import InfoCards from "./upload/InfoCards"; // Import the new info cards component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { server } from "@/utils/util";
// Removed FileState type definition

const UploadStatement = () => {
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
  const stageIntervalRef = useRef<NodeJS.Timeout | null>(null);


  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
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
    const formData = new FormData();
    formData.append("file", selectedFile.file);
    formData.append("password", verificationCode);
  
    // Processing stages for better UX
    const stages = [
      "Uploading statement...",
      "Decrypting file...",
      "Extracting transactions...",
      "Analyzing financial data...",
      "Generating insights..."
    ];
    
    let currentStageIndex = 0;
    const totalStages = stages.length;
    const progressPerStage = 95 / totalStages; // Reserve last 5% for completion
    let currentProgress = 0;

    // Clear any existing intervals
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);

    // Function to update progress smoothly within a stage
    const updateProgress = () => {
      const targetProgressForStage = (currentStageIndex + 1) * progressPerStage;
      const increment = progressPerStage / (3000 / 100); // Simulate progress over 3 seconds per stage

      progressIntervalRef.current = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= targetProgressForStage) {
          currentProgress = targetProgressForStage; // Cap at stage target
          setUploadProgress(Math.min(95, currentProgress));
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); // Stop incrementing for this stage
        } else {
          setUploadProgress(Math.min(95, currentProgress));
        }
      }, 100); // Update progress frequently for smoothness
    };

    // Function to advance to the next stage
    const advanceStage = () => {
      if (currentStageIndex < totalStages) {
        setProcessingStage(stages[currentStageIndex]);
        updateProgress(); // Start progress animation for the new stage
        currentStageIndex++;
      } else {
         if (stageIntervalRef.current) clearInterval(stageIntervalRef.current); // Stop cycling stages
      }
    };

    // Start the process
    advanceStage(); // Show the first stage immediately
    stageIntervalRef.current = setInterval(advanceStage, 3000); // Advance stage every 3 seconds

    try {
      console.log("Attempting to connect to server...");
  
      const response = await fetch(`${server}/file/uploadfileandclean`, {
        method: "POST",
        body: formData,
        // Explicitly set mode to cors
        mode: 'cors',
        // Add these headers for better debugging
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log("Response received:", response.status);
  
      // Parse response early to detect errors in the JSON response
      const data = await response.json();
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }
  
      // Server processed successfully

      // Clear intervals immediately
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
      progressIntervalRef.current = null;
      stageIntervalRef.current = null;

      // Jump progress to 100% and show completion message
      setProcessingStage("Processing complete!");
      setUploadProgress(100);

      // Wait a moment for the user to see the 100% completion
      await new Promise(resolve => setTimeout(resolve, 1200));

      toast({
        title: "Success",
        description: "Statement uploaded and processed successfully",
      });
      
      // Verify we have data before redirecting
      if (data && data.dataframe) {
        // Store the data in context/state if needed
        // Example: setStatementData(data);
        
        // Close the dialog and redirect to insights page
        localStorage.setItem('statementClientName', data.client_name);
localStorage.setItem('statementMobileNumber', data.mobile_number);
localStorage.setItem('statementData', JSON.stringify(data.dataframe));
        setIsVerificationOpen(false);
        router.push("/insights");
      } else {
        throw new Error("Received invalid data format from server");
      }
  
    } catch (error) {
      // Clear intervals on error
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
      progressIntervalRef.current = null;
      stageIntervalRef.current = null;

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
