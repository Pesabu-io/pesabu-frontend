'use client'

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
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
    console.log("Banks Data:", banksData); // Debugging: Check the fetched data
      // Store the processed data or handle navigation
      setIsVerificationOpen(false);
      router.push("/insights"); // Or wherever you want to redirect after success

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
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-teal-600 text-white p-8 rounded-2xl">
              <h2 className="text-3xl font-bold text-center mb-8">
                Upload Mpesa Statement
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive
                    ? "border-white bg-teal-500"
                    : "border-teal-300 bg-teal-500/50"
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
                <FileIcon className="mx-auto mb-4 h-12 w-12" />
                <p className="text-lg mb-2">
                  {selectedFile ? selectedFile.name : "Drag & Drop file here.."}
                </p>
                <p className="text-sm text-teal-100">
                  or click to select a PDF file
                </p>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleSubmit}
                  className="bg-white text-teal-600 hover:bg-teal-50"
                  size="lg"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Statement Password</DialogTitle>
            <DialogDescription>
              Enter the 6-digit password for your M-PESA statement
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              onClick={handleVerification}
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Verify & Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadStatement;