'use client'

import { useEffect, useState } from 'react';
import { ArrowRight, User, Mail, Lock, Briefcase, GraduationCap, MapPin, Phone, Eye, EyeOff } from 'lucide-react';
import TranslatedText from '@/app/language/page';
import Image from 'next/image';
export default function MentorRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    position: '',
    experience: '',
    expertise: [],
    location: '',
    bio: '',
    linkedin: '',
    website: '',
    availability: 'part-time',
    languages: ['English'],
    hourlyRate: '',
    timezone: 'IST',
    age: '',
    gender: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const mentorData = localStorage.getItem('mentorData');
      if (mentorData) {
        window.location.replace('/mentor/dashboard');
      }
    } catch (error) {
      console.error('Unable to check mentor session:', error);
    }
  }, []);

  const expertiseOptions = [
    'Technology', 'Business', 'Marketing', 'Design', 'Finance', 'Healthcare',
    'Education', 'Engineering', 'Data Science', 'Product Management',
    'Sales', 'Human Resources', 'Operations', 'Strategy', 'Consulting'
  ];

  const experienceOptions = [
    '0-2 years', '3-5 years', '6-10 years', '11-15 years', '16-20 years', '20+ years'
  ];

  const availabilityOptions = [
    { id: 'part-time', label: 'Part-time (5-10 hours/week)' },
    { id: 'full-time', label: 'Full-time (20+ hours/week)' },
    { id: 'project-based', label: 'Project-based' },
    { id: 'on-demand', label: 'On-demand consultation' }
  ];

  const languageOptions = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'
  ];

  const timezoneOptions = [
    'IST (India Standard Time)', 'EST (Eastern Standard Time)', 'PST (Pacific Standard Time)',
    'GMT (Greenwich Mean Time)', 'CET (Central European Time)', 'JST (Japan Standard Time)'
  ];

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

  const handleExpertiseChange = (expertise) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const handleLanguageChange = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (formData.expertise.length === 0) newErrors.expertise = 'Please select at least one expertise area';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';

    // Validate LinkedIn URL if provided
    if (formData.linkedin.trim() && !isValidLinkedInUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)';
    }

    // Validate Website URL if provided
    if (formData.website.trim() && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://yourwebsite.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidLinkedInUrl = (url) => {
    // More flexible LinkedIn URL validation
    console.log('Validating LinkedIn URL:', url);
    
    // Handle URLs without protocol
    let urlToCheck = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToCheck = 'https://' + url;
    }
    
    try {
      const urlObj = new URL(urlToCheck);
      console.log('Parsed URL:', urlObj.href);
      console.log('Hostname:', urlObj.hostname);
      console.log('Pathname:', urlObj.pathname);
      
      // Check if it's a LinkedIn domain
      const isValidHostname = urlObj.hostname === 'linkedin.com' || 
                             urlObj.hostname === 'www.linkedin.com' ||
                             urlObj.hostname.endsWith('.linkedin.com');
      
      // Check if it has the /in/ path
      const hasInPath = urlObj.pathname.startsWith('/in/') && urlObj.pathname.length > 4;
      
      console.log('Is valid hostname:', isValidHostname);
      console.log('Has /in/ path:', hasInPath);
      
      const isValid = isValidHostname && hasInPath;
      console.log('Final validation result:', isValid);
      
      return isValid;
    } catch (error) {
      console.log('URL validation error:', error);
      return false;
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!validateForm()) {
    //   return;
    // }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/mentor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.mentor) {
          localStorage.setItem('mentorData', JSON.stringify(data.mentor));
        }
        window.location.replace('/mentor/dashboard');
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fbf7]">
      <div className="flex min-h-screen">
        <aside className="relative hidden min-h-screen overflow-hidden bg-[#0f2e25] lg:flex lg:w-[42%]">
          <Image
            src="/mentor-onboarding.png"
            alt="Mentor guiding students"
            fill
            className="object-cover"
            sizes="42vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f2e25]/15 via-[#0f2e25]/20 to-[#071914]/90" />
          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              <TranslatedText>Yuva Yojna Mentor Network</TranslatedText>
            </div>

            <div className="max-w-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">
                <TranslatedText>Share your experience</TranslatedText>
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                <TranslatedText>Help students choose their next step with confidence.</TranslatedText>
              </h2>
              <p className="mt-4 text-base leading-7 text-emerald-50/90">
                <TranslatedText>Create your mentor profile, show your expertise, and connect with students who need practical career guidance.</TranslatedText>
              </p>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {['Career calls', 'Skill advice', 'Project review'].map((item) => (
                  <div key={item} className="rounded-lg border border-white/20 bg-white/15 p-3 text-center shadow-lg backdrop-blur">
                    <p className="text-sm font-semibold"><TranslatedText>{item}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
        
        <main className="w-full overflow-y-auto lg:w-[58%]">
          <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-start px-5 py-8 sm:px-8 lg:px-12">
            <div className="relative mb-8 h-56 overflow-hidden rounded-2xl shadow-2xl lg:hidden">
              <Image
                src="/mentor-onboarding.png"
                alt="Mentor guiding students"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08251d]/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-sm font-semibold text-emerald-100"><TranslatedText>Yuva Yojna Mentor Network</TranslatedText></p>
                <h2 className="mt-1 text-2xl font-bold"><TranslatedText>Guide students with your experience.</TranslatedText></h2>
              </div>
            </div>
          
            <div className="w-full">
            {/* Header */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <TranslatedText>Mentor registration</TranslatedText>
              </p>
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#1F2937' }}>
                <TranslatedText>Create Mentor Account</TranslatedText>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7" style={{ color: '#6B7280' }}>
                <TranslatedText>Join as a mentor and help students discover careers, improve projects, and build confidence.</TranslatedText>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#1F2937', fontWeight: '600' }}>
                  <User className="w-4 h-4 mr-2" style={{ color: '#16A34A' }} />
                  <TranslatedText>Personal Information</TranslatedText>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>First Name</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.firstName ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.firstName ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Last Name</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.lastName ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.lastName ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

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
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Phone Number</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full p-3 pl-10 border-2 rounded-xl ${
                          errors.phone ? 'border-red-500' : 'border-gray-200'
                        }`}
                        style={{
                          backgroundColor: 'white',
                          borderColor: errors.phone ? '#ef4444' : '#d1d5db',
                          outline: 'none',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          color: '#000000'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#16A34A';
                          e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.phone ? '#ef4444' : '#d1d5db';
                          e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                        }}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

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
                        placeholder="Create a password"
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

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Confirm Password</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full p-3 pl-10 pr-10 border-2 rounded-xl ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                        style={{
                          backgroundColor: 'white',
                          borderColor: errors.confirmPassword ? '#ef4444' : '#d1d5db',
                          outline: 'none',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          color: '#000000'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#16A34A';
                          e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#d1d5db';
                          e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                        }}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#1F2937', fontWeight: '600' }}>
                  <Briefcase className="w-4 h-4 mr-2" style={{ color: '#16A34A' }} />
                  <TranslatedText>Professional Information</TranslatedText>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Current Company</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.company ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.company ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.company ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="Enter your company name"
                    />
                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Current Position</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.position ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.position ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.position ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="Enter your job title"
                    />
                    {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Years of Experience</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.experience ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.experience ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.experience ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      <option value="">Select experience level</option>
                      {experienceOptions.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Location</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full p-3 pl-10 border-2 rounded-xl ${
                          errors.location ? 'border-red-500' : 'border-gray-200'
                        }`}
                        style={{
                          backgroundColor: 'white',
                          borderColor: errors.location ? '#ef4444' : '#d1d5db',
                          outline: 'none',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          color: '#000000'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#16A34A';
                          e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.location ? '#ef4444' : '#d1d5db';
                          e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                        }}
                        placeholder="Enter your city, country"
                      />
                    </div>
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>

                {/* Expertise Areas */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <TranslatedText>Areas of Expertise</TranslatedText> <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {expertiseOptions.map(expertise => (
                      <button
                        key={expertise}
                        type="button"
                        onClick={() => handleExpertiseChange(expertise)}
                        className="p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium"
                        style={{
                          backgroundColor: formData.expertise.includes(expertise) ? '#16A34A' : 'white',
                          color: formData.expertise.includes(expertise) ? 'white' : '#1F2937',
                          borderColor: '#16A34A'
                        }}
                        onMouseEnter={(e) => {
                          if (!formData.expertise.includes(expertise)) {
                            e.target.style.backgroundColor = '#F0FDF4';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!formData.expertise.includes(expertise)) {
                            e.target.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                  {errors.expertise && <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>}
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                    <TranslatedText>Professional Bio</TranslatedText> <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full p-3 border-2 rounded-xl ${
                      errors.bio ? 'border-red-500' : 'border-gray-200'
                    }`}
                    style={{
                      backgroundColor: 'white',
                      borderColor: errors.bio ? '#ef4444' : '#d1d5db',
                      outline: 'none',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      color: '#000000'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#16A34A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.bio ? '#ef4444' : '#d1d5db';
                      e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                    placeholder="Tell us about your professional background, achievements, and what makes you a great mentor..."
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>
              </div>

              {/* Mentoring Preferences */}
              <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1F2937', fontWeight: '600' }}>
                  <TranslatedText>Mentoring Preferences</TranslatedText>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Availability</TranslatedText>
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl"
                      style={{
                        backgroundColor: 'white',
                        borderColor: '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      {availabilityOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Hourly Rate (USD)</TranslatedText> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      min="0"
                      step="5"
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.hourlyRate ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.hourlyRate ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.hourlyRate ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="Enter your hourly rate"
                    />
                    {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <TranslatedText>Languages</TranslatedText>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {languageOptions.map(language => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleLanguageChange(language)}
                          className="p-2 rounded-lg border text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: formData.languages.includes(language) ? '#16A34A' : 'white',
                            color: formData.languages.includes(language) ? 'white' : '#1F2937',
                            borderColor: '#16A34A'
                          }}
                          onMouseEnter={(e) => {
                            if (!formData.languages.includes(language)) {
                              e.target.style.backgroundColor = '#F0FDF4';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!formData.languages.includes(language)) {
                              e.target.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Timezone</TranslatedText>
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl"
                      style={{
                        backgroundColor: 'white',
                        borderColor: '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      {timezoneOptions.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Links */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>LinkedIn Profile (Optional)</TranslatedText>
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.linkedin ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.linkedin ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.linkedin ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1F2937' }}>
                      <TranslatedText>Personal Website (Optional)</TranslatedText>
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full p-3 border-2 rounded-xl ${
                        errors.website ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 'white',
                        borderColor: errors.website ? '#ef4444' : '#d1d5db',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        color: '#000000'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16A34A';
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.website ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                      }}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 text-white py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#16A34A',
                    ':hover': { backgroundColor: '#15803D' }
                  }}
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
                      <TranslatedText>Creating Account...</TranslatedText>
                    </>
                  ) : (
                    <>
                      <TranslatedText>Create Mentor Account</TranslatedText>
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
                
                <a
                  href="/mentor/login"
                  className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
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
                  <TranslatedText>Already have an account? Login</TranslatedText>
                </a>
              </div>
            </form>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
