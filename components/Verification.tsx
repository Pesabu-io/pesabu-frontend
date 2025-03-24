'use client'
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"


const Verification = () => {
  const [code, setCode] = useState("");
  const { toast } = useToast();

  const handleComplete = (value: string) => {
    setCode(value);
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a 6-digit verification code",
      });
      return;
    }
    // Handle verification logic here
    toast({
      title: "Verification in progress",
      description: "Please wait while we verify your code",
    });
  };

  return (
   
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-8">
            <div className="max-w-xl mx-auto">
              <div className="bg-teal-600 text-white p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-center mb-4">
                  Enter Verification Code
                </h2>
                <p className="text-center text-teal-100 mb-8">
                  Enter the 6-digit code sent to your phone.
                </p>

                <div className="flex justify-center mb-8">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    onComplete={handleComplete}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="bg-white/10" />
                      <InputOTPSlot index={1} className="bg-white/10" />
                      <InputOTPSlot index={2} className="bg-white/10" />
                      <InputOTPSlot index={3} className="bg-white/10" />
                      <InputOTPSlot index={4} className="bg-white/10" />
                      <InputOTPSlot index={5} className="bg-white/10" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleVerify}
                    className="bg-white text-teal-600 hover:bg-teal-50"
                    size="lg"
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  
  );
};

export default Verification;