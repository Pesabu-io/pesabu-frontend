"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiPhone, FiBriefcase } from "react-icons/fi";

export default function RegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ fullName, email, phone, company });
    router.push("/welcome"); // Redirect after successful registration
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-themeTeal">
      <div className="p-8 bg-white text-gray-800 shadow-2xl rounded-xl max-w-lg w-full">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <img
            src="https://i.postimg.cc/bvnYCBVg/Whats-App-Image-2024-11-21-at-12-26-59.jpg"
            alt="Welcome Illustration"
            className="mx-auto mb-4 w-24 h-24 rounded-full shadow-md"
          />
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-sm text-gray-500">Join us and get started!</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Field */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm"
              placeholder="Email"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm"
              placeholder="Phone Number"
              required
            />
          </div>

          {/* Company Field */}
          <div className="relative">
            <FiBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="block pl-12 pr-4 py-3 w-full rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-sm"
              placeholder="Company"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-600 text-white font-bold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transform transition duration-200 hover:scale-105"
          >
            Register
          </button>
        </form>

        {/* Already Have an Account */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <button
              className="text-teal-600 hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
