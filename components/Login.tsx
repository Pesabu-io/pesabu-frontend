"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock } from "react-icons/fi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    router.push("/"); // Redirect after successful login
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")', // Replace with your URL
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Form container */}
      <div className="relative z-10 p-8 bg-white/95 backdrop-blur-md text-gray-800 shadow-2xl rounded-xl max-w-lg w-full animate-fadeIn">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Welcome Illustration"
            className="mx-auto mb-4 w-24 h-24 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="relative group">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-teal-600 transition-colors" />
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-white/50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm transition-all duration-200 hover:bg-white"
              placeholder="Email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-teal-600 transition-colors" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-white/50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm transition-all duration-200 hover:bg-white"
              placeholder="Password"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-teal-600 hover:text-teal-800 hover:underline transition-colors"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-600 text-white font-bold shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transform transition duration-200 hover:scale-102 active:scale-98"
          >
            Sign In
          </button>
        </form>

        {/* Need an Account */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need an account?{" "}
            <button
              type="button"
              className="text-teal-600 hover:text-teal-800 hover:underline transition-colors"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}