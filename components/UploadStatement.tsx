'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { useState } from "react";


const UploadStatement = () => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Handle file upload logic here
    toast({
      title: "Upload started",
      description: "Your statement is being processed",
    });
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
                    {selectedFile
                      ? selectedFile.name
                      : "Drag & Drop file here.."}
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
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
   
  );
};

export default UploadStatement;
