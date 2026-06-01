"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Users } from 'lucide-react';
import { signIn } from "next-auth/react";
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        const registeredEmail = formData.email;
        setMessage('Registration successful! Enter the code sent to your email.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          gender: '',
          password: ''
        });
        window.location.href = `/verify-email?email=${encodeURIComponent(registeredEmail)}`;
      } else {
        setMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Image */}
      <div className="w-3/6 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0  bg-opacity-20"></div>
        <div className="relative h-full flex flex-col justify-center items-center p-8 text-white" style={{ marginTop: '-50px' }}>
          <div className="w-80 h-80 mb-8">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Background Circle */}
              <circle cx="200" cy="200" r="180" fill="white" fillOpacity="0.1"/>
              
              {/* Students Group */}
              {/* Student 1 */}
              <circle cx="150" cy="180" r="25" fill="white" fillOpacity="0.9"/>
              <rect x="135" y="200" width="30" height="40" rx="15" fill="white" fillOpacity="0.8"/>
              <rect x="140" y="210" width="20" height="2" fill="#22C55E"/>
              
              {/* Student 2 */}
              <circle cx="200" cy="160" r="25" fill="white" fillOpacity="0.9"/>
              <rect x="185" y="180" width="30" height="40" rx="15" fill="white" fillOpacity="0.8"/>
              <rect x="190" y="190" width="20" height="2" fill="#22C55E"/>
              
              {/* Student 3 */}
              <circle cx="250" cy="180" r="25" fill="white" fillOpacity="0.9"/>
              <rect x="235" y="200" width="30" height="40" rx="15" fill="white" fillOpacity="0.8"/>
              <rect x="240" y="210" width="20" height="2" fill="#22C55E"/>
              
              {/* Education Elements */}
              {/* Books */}
              <rect x="120" y="260" width="20" height="3" fill="white" fillOpacity="0.8"/>
              <rect x="122" y="255" width="16" height="3" fill="white" fillOpacity="0.7"/>
              <rect x="124" y="250" width="12" height="3" fill="white" fillOpacity="0.6"/>
              
              <rect x="260" y="260" width="20" height="3" fill="white" fillOpacity="0.8"/>
              <rect x="262" y="255" width="16" height="3" fill="white" fillOpacity="0.7"/>
              <rect x="264" y="250" width="12" height="3" fill="white" fillOpacity="0.6"/>
              
              {/* Graduation Cap */}
              <rect x="185" y="120" width="30" height="8" fill="white" fillOpacity="0.9"/>
              <polygon points="190,120 210,120 200,110" fill="white" fillOpacity="0.8"/>
              <circle cx="215" cy="124" r="2" fill="white" fillOpacity="0.7"/>
              <line x1="215" y1="126" x2="218" y2="135" stroke="white" strokeWidth="1" opacity="0.7"/>
              
              {/* Government Emblem */}
              <circle cx="200" cy="300" r="30" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" opacity="0.8"/>
              <circle cx="200" cy="300" r="20" fill="white" fillOpacity="0.3"/>
              
              {/* Ashoka Chakra representation */}
              <circle cx="200" cy="300" r="15" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
              <g transform="translate(200,300)">
                <line x1="0" y1="-12" x2="0" y2="12" stroke="white" strokeWidth="1" opacity="0.8"/>
                <line x1="-12" y1="0" x2="12" y2="0" stroke="white" strokeWidth="1" opacity="0.8"/>
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="white" strokeWidth="1" opacity="0.8"/>
                <line x1="-8" y1="8" x2="8" y2="-8" stroke="white" strokeWidth="1" opacity="0.8"/>
              </g>
              
              {/* Digital Elements */}
              <rect x="80" y="120" width="25" height="18" rx="2" fill="white" fillOpacity="0.8"/>
              <rect x="82" y="122" width="21" height="10" fill="#22C55E" fillOpacity="0.6"/>
              <circle cx="85" cy="133" r="1" fill="white"/>
              <circle cx="88" cy="133" r="1" fill="white"/>
              
              <rect x="295" y="120" width="25" height="18" rx="2" fill="white" fillOpacity="0.8"/>
              <rect x="297" y="122" width="21" height="10" fill="#22C55E" fillOpacity="0.6"/>
              <circle cx="300" cy="133" r="1" fill="white"/>
              <circle cx="303" cy="133" r="1" fill="white"/>
              
              {/* Connection Lines */}
              <line x1="150" y1="240" x2="200" y2="270" stroke="white" strokeWidth="2" opacity="0.4"/>
              <line x1="200" y1="220" x2="200" y2="270" stroke="white" strokeWidth="2" opacity="0.4"/>
              <line x1="250" y1="240" x2="200" y2="270" stroke="white" strokeWidth="2" opacity="0.4"/>
              
              {/* Success/Growth Arrows */}
              <polygon points="320,80 330,85 325,90 335,95 325,100 330,105 320,100 325,95 315,90 325,85" fill="white" fillOpacity="0.7"/>
              <polygon points="70,320 80,325 75,330 85,335 75,340 80,345 70,340 75,335 65,330 75,325" fill="white" fillOpacity="0.7"/>
              
              {/* Stars for Achievement */}
              <polygon points="350,150 352,156 358,156 353,160 355,166 350,162 345,166 347,160 342,156 348,156" fill="white" fillOpacity="0.8"/>
              <polygon points="50,250 52,256 58,256 53,260 55,266 50,262 45,266 47,260 42,256 48,256" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">yuvaYojna</h1>
            <p className="text-xl opacity-90 mb-2">Government of India</p>
            <p className="text-lg opacity-80">Empowering Youth for a Better Tomorrow</p>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join yuvaYojna and unlock opportunities</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 text-center ${
              message.includes('successful') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Age and Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="13"
                    max="100"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                    placeholder="Age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

          <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
