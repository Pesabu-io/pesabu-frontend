"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiArrowRight, FiShield, FiTrendingUp, FiPieChart } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// ─── Branded left panel ────────────────────────────────────────────────────────

const BrandPanel = () => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 flex-col items-center justify-center p-12">
    {/* Decorative blobs */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-900/30 rounded-full translate-x-1/3 translate-y-1/3" />
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    <div className="relative z-10 text-white max-w-sm text-center">
      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl"
      >
        <span className="text-4xl font-black tracking-tight text-white">P</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-3xl font-bold mb-3 leading-tight"
      >
        Manage your money
        <br />
        <span className="text-teal-200">with confidence.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-teal-100/80 text-sm leading-relaxed mb-10"
      >
        Intelligent financial analytics powered by your financial transaction history.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="flex flex-col gap-3"
      >
        {[
          { icon: FiTrendingUp, label: "Credit Score Engine" },
          { icon: FiPieChart, label: "Spending Insights" },
          { icon: FiShield, label: "Bank-grade Security" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-teal-100" />
            </div>
            <span className="text-sm font-medium text-teal-50">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

// ─── Input component ───────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  rightSlot?: React.ReactNode;
  delay?: number;
}

const InputField = ({
  id, label, type, value, placeholder, icon, onChange,
  disabled, required, error, rightSlot, delay = 0,
}: InputFieldProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="space-y-1.5"
  >
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {rightSlot}
    </div>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`block w-full h-12 pl-11 pr-4 rounded-xl border bg-gray-50/60 text-gray-900 placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100
          hover:border-gray-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}`}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 flex items-center gap-1"
      >
        <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center">!</span>
        {error}
      </motion.p>
    )}
  </motion.div>
);

// ─── Main component ────────────────────────────────────────────────────────────

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!username.trim()) errs.username = "Username is required";
    if (!password) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ username, password });
      toast({
        title: "Login successful",
        description: "Welcome back! Redirecting to your dashboard...",
      });
      router.replace("/pinsights");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branded panel (desktop only) ── */}
      <BrandPanel />

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-teal-50/60 via-white to-emerald-50/40 px-6 py-10 sm:px-10">
        {/* Soft ambient orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile-only logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex lg:hidden items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Pesabu</span>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-8 sm:p-10"
          >
            {/* Heading */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              >
                Welcome back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-gray-500"
              >
                Sign in to continue to Pesabu
              </motion.p>
            </div>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
              >
                <span className="mt-0.5 w-4 h-4 rounded-full bg-red-100 border border-red-300 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-red-600">!</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <InputField
                id="username" label="Username" type="text"
                value={username} onChange={setUsername}
                placeholder="Enter your username"
                icon={<FiUser className="w-4 h-4" />}
                disabled={loading} required
                error={fieldErrors.username}
                delay={0.4}
              />
              <InputField
                id="password" label="Password" type="password"
                value={password} onChange={setPassword}
                placeholder="Enter your password"
                icon={<FiLock className="w-4 h-4" />}
                disabled={loading} required
                error={fieldErrors.password}
                delay={0.5}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                }
              />

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-1.5 text-xs text-gray-400"
              >
                <FiShield className="w-3.5 h-3.5 text-teal-500" />
                <span>Your data is encrypted end-to-end</span>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold
                  shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400">New to Pesabu?</span>
              </div>
            </div>

            {/* Sign up link */}
            <motion.button
              type="button"
              onClick={() => router.push("/register")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 hover:bg-teal-50 hover:border-teal-200 text-sm font-medium text-gray-700 hover:text-teal-700 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Create an account</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center text-xs text-gray-400"
          >
            By signing in, you agree to our{" "}
            <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
