"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Building2, User2, Briefcase, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Personal Information",
    icon: User2,
    fields: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First Name"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
          />
        </div>
        <Input
          type="email"
          placeholder="Email Address"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
        />
      </div>
    ),
  },
  {
    id: 2,
    title: "Business Details",
    icon: Building2,
    fields: (
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Business Name"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
        />
        <Input
          type="text"
          placeholder="Business Registration Number"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
        />
        <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20">
          <option value="" className="bg-slate-800">Business Type</option>
          <option value="sole" className="bg-slate-800">Sole Proprietorship</option>
          <option value="partnership" className="bg-slate-800">Partnership</option>
          <option value="corporation" className="bg-slate-800">Corporation</option>
          <option value="llc" className="bg-slate-800">LLC</option>
        </select>
      </div>
    ),
  },
  {
    id: 3,
    title: "Financial Information",
    icon: Briefcase,
    fields: (
      <div className="space-y-4">
        <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20">
          <option value="" className="bg-slate-800">Annual Revenue Range</option>
          <option value="0-50k" className="bg-slate-800">$0 - $50,000</option>
          <option value="50k-200k" className="bg-slate-800">$50,000 - $200,000</option>
          <option value="200k-1m" className="bg-slate-800">$200,000 - $1,000,000</option>
          <option value="1m+" className="bg-slate-800">$1,000,000+</option>
        </select>
        <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20">
          <option value="" className="bg-slate-800">Industry</option>
          <option value="tech" className="bg-slate-800">Technology</option>
          <option value="retail" className="bg-slate-800">Retail</option>
          <option value="healthcare" className="bg-slate-800">Healthcare</option>
          <option value="finance" className="bg-slate-800">Finance</option>
          <option value="other" className="bg-slate-800">Other</option>
        </select>
        <Input
          type="number"
          placeholder="Number of Employees"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal-400"
        />
      </div>
    ),
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  
  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps.find((step) => step.id === currentStep);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d9488,#0891b2)] opacity-30" />
        <div className="absolute top-0 -left-4 w-3/4 h-full bg-gradient-to-br from-transparent via-teal-500/10 to-cyan-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-3/4 h-full bg-gradient-to-tl from-transparent via-teal-500/10 to-cyan-500/10 blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="mb-8">
          <Progress 
            value={progress} 
            className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-teal-400 [&>div]:to-cyan-400"
          />
        </div>
        
        <Card className="w-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] shadow-2xl animate-fadeIn">
          <CardHeader>
            <div className="flex items-center gap-3">
              {currentStepData && (
                <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400/20 to-cyan-400/20">
                  <currentStepData.icon className="w-8 h-8 text-teal-400" />
                </div>
              )}
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {currentStepData?.title}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="animate-fadeIn">
              {currentStepData?.fields}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <Button 
              onClick={handleNext} 
              className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:opacity-90 transition-all duration-200 hover:scale-102"
            >
              {currentStep === steps.length ? (
                <>
                  Complete <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}