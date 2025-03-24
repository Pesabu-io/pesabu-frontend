'use client'

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {  Upload, CheckCircle2, FileText, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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

type FileState = {
  file: File;
  name: string;
  size: number;
  type: string;
};

const UploadStatement = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileState | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "application/pdf") {
      setSelectedFile({
        file: files[0],
        name: files[0].name,
        size: files[0].size,
        type: files[0].type
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]?.type === "application/pdf") {
      setSelectedFile({
        file: files[0],
        name: files[0].name,
        size: files[0].size,
        type: files[0].type
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file",
      });
    }
  };

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
    
    let stageIndex = 0;
    let progressValue = 0;
    
  
    // Start with first stage
    setProcessingStage(stages[0]);
  
    // Create the progress bar animation
   const progressIntervalId = setInterval(() => {
      // Calculate progress based on stages
      const baseProgress = (stageIndex % stages.length) * (95 / stages.length);
      const stageProgress = Math.min(95 / stages.length, Math.random() * 3);
      
      progressValue = Math.min(95, baseProgress + stageProgress);
      setUploadProgress(progressValue);
    }, 300);
  
    // Create the stage cycling - slower than original to give impression of actual work
  const  stageIntervalId = setInterval(() => {
      if (stageIndex < stages.length) {
        setProcessingStage(stages[stageIndex]);
        stageIndex++;
      }
    }, 3000); // Longer interval to make processing feel more substantial
  
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
      
      // Ensure we've shown all processing stages before completion
      clearInterval(stageIntervalId);
      
      // Make sure we show the final stage
      setProcessingStage("Processing complete!");
      setUploadProgress(100);
      
      // Wait a moment for the user to see the 100% completion
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Clear intervals after the delay
      clearInterval(progressIntervalId);
      
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
      clearInterval(progressIntervalId);
      clearInterval(stageIntervalId);
      
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
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

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
            {/* Card header */}
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-pesabu-teal"
              >
                Statement Upload
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-gray-500 mt-2"
              >
                Upload your M-PESA statement to get personalized financial insights
              </motion.p>
            </div>

            {/* Main upload card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Gradient top banner */}
              <div className="bg-gradient-to-r from-pesabu-teal to-pesabu-teal/80 h-4"></div>
              
              <div className="p-8 md:p-10">
                {/* Upload area */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`relative border-2 border-dashed rounded-2xl transition-all ${
                    dragActive
                      ? "border-pesabu-teal bg-pesabu-teal/5"
                      : "border-gray-200 bg-gray-50/50"
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
                        <p className="text-xl font-medium mb-2 text-gray-800">{selectedFile.name}</p>
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
            
            {/* Info cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid md:grid-cols-3 gap-6 mt-8"
            >
              {[
                {
                  icon: <FileText className="h-5 w-5 text-pesabu-gold" />,
                  title: "Statement Analysis",
                  description: "We analyze your transactions to provide financial insights"
                },
                {
                  icon: <Lock className="h-5 w-5 text-pesabu-gold" />,
                  title: "Secure Processing",
                  description: "Your data is encrypted and processed securely"
                },
                {
                  icon: <CheckCircle2 className="h-5 w-5 text-pesabu-gold" />,
                  title: "Rich Insights",
                  description: "Get personalized recommendations based on your transactions"
                }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="bg-pesabu-gold/10 rounded-full p-2 inline-flex mb-3">
                    {card.icon}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </main>
      </div>

    {/* Verification Dialog */}
<Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
  <DialogContent className="sm:max-w-md bg-white rounded-2xl">
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
        <p className="text-pesabu-teal font-medium">{processingStage || "Processing..."}</p>
        <div className="animate-pulse flex space-x-2 justify-center">
          <div className="w-2 h-2 bg-pesabu-teal rounded-full"></div>
          <div className="w-2 h-2 bg-pesabu-teal rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-pesabu-teal rounded-full animation-delay-400"></div>
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
  </DialogContent>
</Dialog>
</div>
);
};

export default UploadStatement;