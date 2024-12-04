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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-900">
      <div className="p-8 bg-white text-gray-800 shadow-2xl rounded-xl max-w-lg w-full">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <img
            src="https://i.postimg.cc/bvnYCBVg/Whats-App-Image-2024-11-21-at-12-26-59.jpg"
            alt="Welcome Illustration"
            className="mx-auto mb-4 w-24 h-24 rounded-full shadow-md"
          />
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm"
              placeholder="Email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm"
              placeholder="Password"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              className="text-sm text-teal-600 hover:underline"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-600 text-white font-bold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transform transition duration-200 hover:scale-105"
          >
            Sign In
          </button>
        </form>

        {/* Need an Account */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need an account?{" "}
            <button
              className="text-teal-600 hover:underline"
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
