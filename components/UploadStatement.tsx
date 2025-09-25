'use client'

import React, { useState, useEffect, useRef } from "react"; // Added React import
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react"; // Removed Upload
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

const UploadStatement = () => {
  const [selectedFile, setSelectedFile] = useState<FileState>(null); // Use imported FileState type
  const [dragActive, setDragActive] = useState<boolean>(false); // Keep dragActive state here for UploadArea prop
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [ setTaskId] = useState<string>("");
  const [setUploadStatus] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null);


  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (statusPollingRef.current) clearInterval(statusPollingRef.current);
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

  // Function to poll status and update progress
  const pollStatus = async (taskId: string) => {
    try {
      console.log(`Polling status for task ID: ${taskId}`);
      const response = await fetch(`${server}/file/status/${taskId}`, {
        method: "GET",
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log(`Status response status: ${response.status}`);

      if (!response.ok) {
        console.warn(`Status check failed with status ${response.status}, continuing to poll...`);
        return; // Don't throw error, just continue polling
      }

      const statusData = await response.json();
      console.log("Status response data:", statusData);

      // Update progress and status
      if (statusData.progress !== undefined) {
        setUploadProgress(statusData.progress);
        console.log(`Progress updated to: ${statusData.progress}%`);
      }

      if (statusData.status) {
        setUploadStatus(statusData.status);
        
        // Use server message if available, otherwise use default messages
        if (statusData.message) {
          setProcessingStage(statusData.message);
          console.log(`Using server message: ${statusData.message}`);
        } else {
          // Update processing stage based on status
          switch (statusData.status) {
            case 'processing':
              setProcessingStage("Processing your statement...");
              break;
            case 'completed':
              setProcessingStage("Processing complete!");
              break;
            case 'failed':
              setProcessingStage("Processing failed");
              break;
            default:
              setProcessingStage("Processing...");
          }
        }
        console.log(`Status updated to: ${statusData.status}`);
      }

      // Handle completion
      if (statusData.status === 'completed' && statusData.result) {
        console.log("Processing completed successfully");
        // Clear polling interval
        if (statusPollingRef.current) {
          clearInterval(statusPollingRef.current);
          statusPollingRef.current = null;
        }

        // Wait a moment for the user to see the 100% completion
        await new Promise(resolve => setTimeout(resolve, 1200));

        toast({
          title: "Success",
          description: "Statement uploaded and processed successfully",
        });

        // Store the data and redirect
        const { client_name, mobile_number, dataframe } = statusData.result;
        
        if (client_name) localStorage.setItem('statementClientName', client_name);
        if (mobile_number) localStorage.setItem('statementMobileNumber', mobile_number);
        if (dataframe) localStorage.setItem('statementData', JSON.stringify(dataframe));

        setIsVerificationOpen(false);
        setIsUploading(false);
        router.push("/insights");
        return;
      }

      // Handle failure
      if (statusData.status === 'failed') {
        console.error("Processing failed on the server");
        if (statusPollingRef.current) {
          clearInterval(statusPollingRef.current);
          statusPollingRef.current = null;
        }

        toast({
          variant: "destructive",
          title: "Processing failed",
          description: statusData.message || "The statement processing failed. Please try again.",
        });

        setIsUploading(false);
        setUploadProgress(0);
        setProcessingStage("");
        return;
      }

    } catch (error) {
      console.error("Error polling status:", error);
      // Don't clear the polling interval on network errors
      // Just log the error and continue polling
      console.log("Continuing to poll despite error...");
    }
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
    if (statusPollingRef.current) clearInterval(statusPollingRef.current);

    try {
      console.log("Attempting to upload file...");
  
      // Step 1: Upload file and get task ID
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

      const uploadData = await uploadResponse.json();
      console.log("Upload response data:", uploadData);

      // Extract task ID from response
      if (!uploadData.task_id) {
        console.error("No task_id in response:", uploadData);
        throw new Error("No task ID received from server");
      }

      console.log("Task ID received:", uploadData.task_id);
      setTaskId(uploadData.task_id);
      setUploadStatus(uploadData.status);
      setProcessingStage("File uploaded, processing started...");
      setUploadProgress(10); // Initial progress after upload

      // Step 2: Start polling for status updates
      // Poll immediately first
      console.log("Starting immediate status poll...");
      await pollStatus(uploadData.task_id);
      
      // Then set up polling interval (every 2 seconds)
      console.log("Setting up polling interval...");
      statusPollingRef.current = setInterval(async () => {
        console.log("Polling interval triggered...");
        await pollStatus(uploadData.task_id);
      }, 2000);

      // Set a timeout to stop polling after 5 minutes (300 seconds)
      setTimeout(() => {
        if (statusPollingRef.current) {
          clearInterval(statusPollingRef.current);
          statusPollingRef.current = null;
          
          if (isUploading) {
      toast({
              variant: "destructive",
              title: "Processing timeout",
              description: "Processing is taking longer than expected. Please try again.",
            });
            setIsUploading(false);
            setUploadProgress(0);
            setProcessingStage("");
          }
        }
      }, 300000); // 5 minutes timeout
  
    } catch (error) {
      console.error("Upload error:", error);
      
      // Clear intervals on error
      if (statusPollingRef.current) clearInterval(statusPollingRef.current);
      statusPollingRef.current = null;

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      
      // Reset the loading state but keep the dialog open for retry
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStage("");
      setTaskId("");
      setUploadStatus("");
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