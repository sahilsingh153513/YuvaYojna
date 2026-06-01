"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, BookOpen, Briefcase, Trophy, Star } from "lucide-react";

export default function YuvaYojnaLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("error");

    if (authError === "database") {
      setError("Login is temporarily unavailable because the database connection failed. Please try again after MongoDB Atlas network access is fixed.");
    } else if (authError) {
      setError("Login failed. Please try again.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate form data
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Simulated API call for Yuva Yojna login
      const response = await fetch("/api/auth/yuva-yojna-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          platform: "yuva_yojna",
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Store token with different key for Yuva Yojna
      const userToken = data.data.userToken;
      const userData = {
        token: userToken,
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.fullName,
        platform: "yuva_yojna",
        loginTime: new Date().toISOString(),
        userType: "youth_beneficiary"
      };
      
      localStorage.setItem("yuvaToken", userToken);
      localStorage.setItem("yuvaUser", JSON.stringify(userData));
      window.yuvayojnaUser = userData;
      
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "An error occurred during login to Yuva Yojna portal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Section - Clean Yuva Yojna Design */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-600 to-emerald-700 relative">
        {/* Simple geometric pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          {/* Logo Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
              <GraduationCap size={40} className="text-green-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Yuva Yojna</h1>
            <p className="text-xl text-green-100">Empowering India's Youth</p>
            <div className="w-24 h-1 bg-white rounded-full mx-auto mt-4"></div>
          </div>

          {/* Clean Illustration */}
          <div className="mb-16 w-80 h-48 relative">
            <div className="absolute inset-0 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm border border-white border-opacity-20"></div>
            
            {/* Success Path */}
            <div className="absolute bottom-8 left-8 right-8 h-2 bg-gradient-to-r from-yellow-400 to-green-300 rounded-full"></div>
            
            {/* Achievement Icons */}
            <div className="absolute top-6 left-12 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <div className="absolute top-6 right-12 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            
            {/* Connecting Line */}
            <div className="absolute top-12 left-18 right-18 h-0.5 bg-white opacity-50"></div>
            
            {/* Labels */}
            <div className="absolute bottom-16 left-12 text-xs text-center">
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">Education</div>
            </div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs text-center">
              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">Skills</div>
            </div>
            <div className="absolute bottom-16 right-12 text-xs text-center">
              <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">Career</div>
            </div>
          </div>

         

          {/* Mission Statement */}
          <div className="mt-12 text-center max-w-md">
            <p className="text-green-100 text-lg italic">
              "Building a skilled and empowered youth for New India"
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-green-600 p-3 rounded-xl">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">Yuva Yojna</h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to access your scheme dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="mr-2 text-green-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} className="mr-2 text-green-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button className="text-sm text-green-600 hover:underline font-medium">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing In...
                </div>
              ) : (
                "Sign In to Portal"
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Star size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">New User?</span>
            </div>
            <p className="text-sm text-green-700">
              Register to access government schemes for education, employment, and skill development
            </p>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => (window.location.href = "/register")}
              className="text-green-600 hover:underline font-semibold"
            >
              Create Account
            </button>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Secure government portal •{" "}
            <button className="hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
