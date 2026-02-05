"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation helpers
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return { hasUppercase, hasLowercase, hasNumber, hasMinLength };
  };

  const handleBlur = (field: string) => {
    const newErrors = { ...errors };

    if (field === "email" && formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (field === "email") {
      delete newErrors.email;
    }

    if (field === "name" && formData.name && formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (field === "name") {
      delete newErrors.name;
    }

    if (field === "password" && formData.password) {
      const { hasUppercase, hasLowercase, hasNumber, hasMinLength } = validatePassword(formData.password);
      if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
        newErrors.password = "Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number";
      } else {
        delete newErrors.password;
      }
    }

    if (field === "confirmPassword" && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } else if (field === "confirmPassword") {
      delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }

    const { hasUppercase, hasLowercase, hasNumber, hasMinLength } = validatePassword(formData.password);
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const { data, error: apiError } = await authApi.signup(
      formData.name,
      formData.email,
      formData.password
    );

    if (apiError) {
      setError(apiError);
      setIsLoading(false);
      return;
    }

    if (data) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-obsidian-violet-primary rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-obsidian-violet-glow rounded-full blur-3xl opacity-10"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold gradient-text">
              ObsidianList
            </span>
          </Link>
          <p className="text-gray-400 mt-2">Create your account to get started.</p>
        </div>

        {/* Form Card */}
        <div className="bg-obsidian-gray-900 border border-obsidian-gray-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-obsidian-danger/10 border border-obsidian-danger/30 text-obsidian-danger text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onBlur={() => handleBlur("name")}
                placeholder="Enter your name"
                className={`w-full bg-surface border ${errors.name ? 'border-red-500' : 'border-surface-light'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 transition-all`}
                required
                minLength={2}
                maxLength={100}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email"
                className={`w-full bg-surface border ${errors.email ? 'border-red-500' : 'border-surface-light'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 transition-all`}
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onBlur={() => handleBlur("password")}
                  placeholder="Create a password"
                  className={`w-full bg-surface border ${errors.password ? 'border-red-500' : 'border-surface-light'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 transition-all`}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  8+ chars, 1 uppercase, 1 lowercase, 1 number
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Confirm your password"
                className={`w-full bg-surface border ${errors.confirmPassword ? 'border-red-500' : 'border-surface-light'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 transition-all`}
                required
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-obsidian-violet-primary text-white font-medium hover:bg-obsidian-violet-dark glow-violet transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-obsidian-gray-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-obsidian-gray-700"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-obsidian-violet-light hover:text-obsidian-violet-primary transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-obsidian-violet-light hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-obsidian-violet-light hover:underline">
            Privacy Policy
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
