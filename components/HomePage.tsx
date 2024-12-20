import React from 'react';
import Header from './Header';


import { PlayCircle, ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8 text-white">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="lg:w-1/2">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-sm text-slate-300 backdrop-blur-xl mb-6">
                <span className="flex h-2 w-2 rounded-full bg-teal-400 mr-2"></span>
                AI-Powered Lending Platform
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                Transforming{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
                  Financial Lending
                </span>{" "}
                with AI
              </h1>

              {/* Description */}
              <p className="mb-8 text-lg text-slate-300 leading-relaxed max-w-xl">
                Leverage cutting-edge AI technology to revolutionize your lending operations. 
                Make smarter decisions, reduce risks, and unlock new opportunities with 
                data-driven insights.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {/* <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="text-slate-300 border-slate-700">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button> */}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { value: "$2.5B+", label: "Loans Processed" },
                  { value: "99.9%", label: "Accuracy Rate" },
                  { value: "150+", label: "Financial Partners" },
                ].map((stat, index) => (
                  <div key={index} className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative mt-12 lg:mt-0 lg:ml-12 lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 opacity-30 blur-xl"></div>
                <img
                  className="relative rounded-3xl shadow-2xl"
                  src="https://www.pesabu.co.ke/images/463/12160989/bg.png"
                  alt="AI Lending Platform Interface"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 opacity-50 blur-xl"></div>
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
