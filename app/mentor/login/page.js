'use client'

import { useEffect, useState } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff, GraduationCap, UserPlus } from 'lucide-react';
import TranslatedText from '@/app/language/page';

export default function MentorLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    try {
      const mentorData = localStorage.getItem('mentorData');
      if (mentorData) {
        window.location.replace('/mentor/dashboard');
      }
    } catch (error) {
      console.error('Unable to check mentor login state:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/mentor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store mentor data in localStorage
        localStorage.setItem('mentorData', JSON.stringify(data.mentor));

        // Redirect to mentor dashboard
        window.location.replace('/mentor/dashboard');
      } else {
        alert(data.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Here you would implement forgot password functionality
    alert('Forgot password functionality would be implemented here. Please contact support for now.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F0FDF4' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md" style={{ boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.1), 0 4px 6px -2px rgba(22, 163, 74, 0.05)' }}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#16A34A' }}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937', fontWeight: '700' }}>
            <TranslatedText>Mentor Login</TranslatedText>
          </h1>
          <p style={{ color: '#6B7280' }}>
            <TranslatedText>Welcome back! Sign in to your mentor account</TranslatedText>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
              <TranslatedText>Email Address</TranslatedText> <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 pl-10 border-2 rounded-xl ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                style={{
                  backgroundColor: 'white',
                  borderColor: errors.email ? '#ef4444' : '#d1d5db',
                  outline: 'none',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  color: '#000000'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16A34A';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
              <TranslatedText>Password</TranslatedText> <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 pl-10 pr-10 border-2 rounded-xl ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                style={{
                  backgroundColor: 'white',
                  borderColor: errors.password ? '#ef4444' : '#d1d5db',
                  outline: 'none',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  color: '#000000'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16A34A';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                <TranslatedText>Remember me</TranslatedText>
              </span>
            </label>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              <TranslatedText>Forgot password?</TranslatedText>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            style={{ backgroundColor: '#16A34A' }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.target.style.backgroundColor = '#15803D';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.target.style.backgroundColor = '#16A34A';
            }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <TranslatedText>Signing In...</TranslatedText>
              </>
            ) : (
              <>
                <TranslatedText>Sign In</TranslatedText>
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                <TranslatedText>or</TranslatedText>
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              <TranslatedText>Don't have a mentor account yet?</TranslatedText>
            </p>
            <a
              href="/mentor/register"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-colors"
              style={{ 
                backgroundColor: 'white',
                border: '2px solid #16A34A',
                color: '#16A34A'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F0FDF4';
                e.target.style.color = '#15803D';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#16A34A';
              }}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              <TranslatedText>Create Mentor Account</TranslatedText>
            </a>
          </div>

          {/* Back to Main Site */}
          <div className="text-center pt-4 border-t border-gray-200">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <TranslatedText>← Back to main site</TranslatedText>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
