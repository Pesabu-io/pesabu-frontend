'use client'

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FileIcon, Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";

const UploadStatement = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "application/pdf") {
      setSelectedFile(files[0]);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file",
      });
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files?.[0]?.type === "application/pdf") {
      setSelectedFile(files[0]);
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
    formData.append("file", selectedFile);
    formData.append("password", verificationCode);

    try {
      const response = await fetch("http://127.0.0.1:8000/file/uploadfileandclean/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
      }

      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Statement uploaded and processed successfully",
      });
      
      // Fetch financial institutions data
      const banksResponse = await fetch("http://127.0.0.1:8000/financial_institutions_module/client_banks/");
      if (!banksResponse.ok) {
        throw new Error("Failed to fetch financial institutions data");
      }

      const banksData = await banksResponse.json();

      // Navigate to insights or display the results
      console.log("Banks Data:", banksData);
      setIsVerificationOpen(false);
      router.push("/insights"); 

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
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
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white p-10 rounded-3xl shadow-xl">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-center mb-2"
              >
                Upload M-PESA Statement
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center text-teal-100 mb-8"
              >
                Upload your statement to gain financial insights
              </motion.p>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragActive
                    ? "border-white bg-teal-500/70"
                    : "border-teal-300/70 bg-teal-500/30"
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
                
                {selectedFile ? (
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-teal-400/30 rounded-full p-4 mb-4">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-xl font-medium mb-2">{selectedFile.name}</p>
                    <p className="text-sm text-teal-100">
                      File selected • Click to change
                    </p>
                  </motion.div>
                ) : (
                  <motion.div className="flex flex-col items-center">
                    <div className="bg-teal-400/30 rounded-full p-4 mb-4">
                      <Upload className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-xl font-medium mb-2">
                      Drag & Drop your M-PESA statement
                    </p>
                    <p className="text-sm text-teal-100">
                      or click to browse your files (PDF only)
                    </p>
                  </motion.div>
                )}
              </motion.div>

              <div className="mt-8 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSubmit}
                    className="bg-white text-teal-600 hover:bg-teal-50 text-lg px-12 py-6 h-auto rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    size="lg"
                    disabled={isUploading}
                  >
                    {isUploading ? "Processing..." : selectedFile ? "Upload Statement" : "Select File"}
                  </Button>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-center text-gray-500 text-sm"
            >
              Your data is encrypted and secure. We analyze your statement to provide personalized insights.
            </motion.div>
          </motion.div>
        </main>
      </div>

      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-teal-700">Statement Password</DialogTitle>
            <DialogDescription className="text-center mt-2">
              Enter the 6-digit password provided with your M-PESA statement
            </DialogDescription>
          </DialogHeader>
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
              className="w-full bg-teal-600 hover:bg-teal-700 py-6 h-auto text-lg rounded-xl font-medium"
              disabled={isUploading}
            >
              {isUploading ? "Processing Statement..." : "Verify & Process"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadStatement;