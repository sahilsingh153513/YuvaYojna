'use client'

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

import { useDaisyTheme } from '@/context/DaisyThemeContext';

function FormContent() {
  const { theme } = useDaisyTheme();
  const [selectedGender, setSelectedGender] = useState('female');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedDisability, setSelectedDisability] = useState('');
  const [selectedDisabilityPercentage, setSelectedDisabilityPercentage] = useState('');
  const [selectedMinority, setSelectedMinority] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedEmployment, setSelectedEmployment] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const genderOptions = [
    { id: 'male', label: 'Male', symbol: '♂', htmlEntity: '&#9794;', altSymbol: 'M', textSymbol: '♂' },
    { id: 'female', label: 'Female', symbol: '♀', htmlEntity: '&#9792;', altSymbol: 'F', textSymbol: '♀' }
  ];

  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18); // Ages 18-100

  const maritalStatusOptions = [
    { id: 'single', label: 'Single' },
    { id: 'married', label: 'Married' },
    { id: 'divorced', label: 'Divorced' },
    { id: 'widowed', label: 'Widowed' }
  ];

  const stateOptions = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const areaOptions = [
    { id: 'urban', label: 'Urban' },
    { id: 'rural', label: 'Rural' }
  ];

  const communityOptions = [
    { id: 'general', label: 'General' },
    { id: 'obc', label: 'Other Backward Class (OBC)', hasInfo: true },
    { id: 'pvtg', label: 'Particularly Vulnerable Tribal Group (PVTG)', hasInfo: true },
    { id: 'sc', label: 'Scheduled Caste (SC)', hasInfo: true },
    { id: 'st', label: 'Scheduled Tribe (ST)', hasInfo: true },
    { id: 'dnt', label: 'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities' }
  ];

  const disabilityPercentageOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const employmentOptions = [
    { id: 'employed', label: 'Employed' },
    { id: 'unemployed', label: 'Unemployed' },
    { id: 'self-employed', label: 'Self-Employed/ Entrepreneur' }
  ];

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleAgeSelect = (age) => {
    setSelectedAge(age);
  };

  const handleMaritalStatusSelect = (status) => {
    setSelectedMaritalStatus(status);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
  };

  const handleDisabilitySelect = (disability) => {
    setSelectedDisability(disability);
    if (disability === 'yes') {
      setSelectedMinority('');
    } else if (disability === 'no') {
      setSelectedDisabilityPercentage('');
    }
  };

  const handleDisabilityPercentageSelect = (percentage) => {
    setSelectedDisabilityPercentage(percentage);
  };

  const handleMinoritySelect = (minority) => {
    setSelectedMinority(minority);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    if (student === 'yes') {
      setSelectedEmployment('');
    }
  };

  const handleEmploymentSelect = (employment) => {
    setSelectedEmployment(employment);
  };

  const handleSubmit = () => {
    const formData = {
      gender: selectedGender,
      age: selectedAge,
      maritalStatus: selectedMaritalStatus,
      state: selectedState,
      area: selectedArea,
      community: selectedCommunity,
      disability: selectedDisability,
      disabilityPercentage: selectedDisabilityPercentage,
      minority: selectedMinority,
      student: selectedStudent,
      employment: selectedEmployment
    };

    console.log('Form submitted with data:', formData);
    alert('Form submitted successfully! Check the console for the collected data.');
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedGender && selectedAge && selectedMaritalStatus) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && selectedState && selectedArea) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && selectedCommunity) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4 && selectedDisability && 
               ((selectedDisability === 'yes' && selectedDisabilityPercentage) || 
                (selectedDisability === 'no' && selectedMinority))) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5 && selectedStudent && 
               (selectedStudent === 'yes' || selectedEmployment)) {
      setCurrentStep(currentStep + 1);
      console.log('Form data:', { 
        gender: selectedGender, 
        age: selectedAge, 
        maritalStatus: selectedMaritalStatus,
        state: selectedState,
        area: selectedArea,
        community: selectedCommunity,
        disability: selectedDisability,
        disabilityPercentage: selectedDisabilityPercentage,
        minority: selectedMinority,
        student: selectedStudent,
        employment: selectedEmployment
      });
    }
  };

  const handleReset = () => {
    setSelectedGender('female');
    setSelectedAge('');
    setSelectedMaritalStatus('');
    setSelectedState('');
    setSelectedArea('');
    setSelectedCommunity('');
    setSelectedDisability('');
    setSelectedDisabilityPercentage('');
    setSelectedMinority('');
    setSelectedStudent('');
    setSelectedEmployment('');
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-base-100" data-theme={theme}>
      {/* Hero Background Section */}
      <div className="py-8 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-base-content">
              Find Your Perfect{' '}
              <span className="text-primary">Internship</span>
            </h1>
            <p className="text-lg mb-2 text-base-content/70">
              Help us understand you better to recommend the best opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-12 px-4">
        <div className="container mx-auto flex justify-center">
          <div className="card bg-base-200 shadow-2xl w-full max-w-2xl">
            <div className="card-body p-8">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-12">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-primary text-primary-content shadow-lg scale-110'
                          : 'bg-base-300 text-base-content/50'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                          step < currentStep ? 'bg-primary' : 'bg-base-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <div className="space-y-8">
                {currentStep === 1 && (
                  <>
                    {/* Gender Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> Tell us about yourself, you are a...
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {genderOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleGenderSelect(option.id)}
                            className={`btn btn-outline h-auto p-6 transition-all duration-300 hover:scale-105 ${
                              selectedGender === option.id
                                ? 'btn-primary shadow-xl'
                                : ''
                            }`}
                          >
                            <div className="text-center">
                              <div className="unicode-symbol mb-2 text-2xl">
                                {option.textSymbol}
                              </div>
                              <div className="font-medium">{option.label}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> and your age is
                        </span>
                      </label>
                      <div className="flex items-center space-x-3">
                        <select
                          value={selectedAge}
                          onChange={(e) => handleAgeSelect(e.target.value)}
                          className="select select-bordered w-full max-w-xs"
                        >
                          <option value="">--</option>
                          {ageOptions.map((age) => (
                            <option key={age} value={age}>
                              {age}
                            </option>
                          ))}
                        </select>
                        <span className="text-lg font-medium">years</span>
                      </div>
                    </div>

                    {/* Marital Status Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> What is your marital status?
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {maritalStatusOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleMaritalStatusSelect(option.id)}
                            className={`btn btn-outline h-auto p-4 transition-all duration-300 hover:scale-105 ${
                              selectedMaritalStatus === option.id
                                ? 'btn-primary shadow-xl'
                                : ''
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium">{option.label}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* State Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> Please select your state
                        </span>
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleStateSelect(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="">-- Select State --</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Area of Residence Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> Please select your area of residence
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {areaOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleAreaSelect(option.id)}
                            className={`btn btn-outline h-auto p-4 transition-all duration-300 hover:scale-105 ${
                              selectedArea === option.id
                                ? 'btn-primary shadow-xl'
                                : ''
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium">{option.label}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    {/* Community Category Selection */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> You belong to...
                        </span>
                      </label>
                      <div className="space-y-3">
                        {communityOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleCommunitySelect(option.id)}
                            className={`btn btn-outline w-full h-auto p-4 transition-all duration-300 flex justify-between items-center hover:scale-102 ${
                              selectedCommunity === option.id
                                ? 'btn-primary shadow-xl'
                                : ''
                            }`}
                          >
                            <span className="font-medium">{option.label}</span>
                            {option.hasInfo && (
                              <div className="badge badge-info">
                                i
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    {/* Disability Question */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> Do you identify as a person with a disability?
                          <div className="badge badge-info ml-2">i</div>
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {['no', 'yes'].map((option) => (
                          <button
                            key={option}
                            onClick={() => handleDisabilitySelect(option)}
                            className={`btn btn-outline h-auto p-4 transition-all duration-300 hover:scale-105 ${
                              selectedDisability === option
                                ? 'btn-primary shadow-xl'
                                : ''
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium capitalize">{option}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Disability Percentage Question */}
                    {selectedDisability === 'yes' && (
                      <div>
                        <label className="label">
                          <span className="label-text text-lg font-medium">
                            <span className="text-error">*</span> What is your differently abled percentage?
                          </span>
                        </label>
                        <select
                          value={selectedDisabilityPercentage}
                          onChange={(e) => handleDisabilityPercentageSelect(e.target.value)}
                          className="select select-bordered w-full"
                        >
                          <option value="">-- Select One --</option>
                          {disabilityPercentageOptions.map((percentage) => (
                            <option key={percentage} value={percentage}>
                              {percentage}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Minority Question */}
                    {selectedDisability === 'no' && (
                      <div>
                        <label className="label">
                          <span className="label-text text-lg font-medium">
                            <span className="text-error">*</span> Do you belong to minority?
                            <div className="badge badge-info ml-2">i</div>
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {['no', 'yes'].map((option) => (
                            <button
                              key={option}
                              onClick={() => handleMinoritySelect(option)}
                              className={`btn btn-outline h-auto p-4 transition-all duration-300 hover:scale-105 ${
                                selectedMinority === option
                                  ? 'btn-primary shadow-xl'
                                  : ''
                              }`}
                            >
                              <div className="text-center">
                                <div className="font-medium capitalize">{option}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    {/* Student Question */}
                    <div>
                      <label className="label">
                        <span className="label-text text-lg font-medium">
                          <span className="text-error">*</span> Are you a student?
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {['no', 'yes'].map((option) => (
                          <button
                            key={option}
                            onClick={() => handleStudentSelect(option)}
                            className={`btn btn-outline h-auto p-4 transition-all duration-300 hover:scale-105 ${
                              selectedStudent === option
                                ? 'btn-primary shadow-xl'
                                : ''
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium capitalize">{option}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Employment Status Question */}
                    {selectedStudent === 'no' && (
                      <div>
                        <label className="label">
                          <span className="label-text text-lg font-medium">
                            <span className="text-error">*</span> What is your current employment status?
                          </span>
                        </label>
                        <div className="space-y-3">
                          {employmentOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleEmploymentSelect(option.id)}
                              className={`btn btn-outline w-full h-auto p-4 transition-all duration-300 hover:scale-102 ${
                                selectedEmployment === option.id
                                  ? 'btn-primary shadow-xl'
                                  : ''
                              }`}
                            >
                              <div className="font-medium text-left">{option.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-12 space-y-4">
                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="btn btn-outline flex-1"
                    >
                      <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={currentStep === 5 ? handleSubmit : handleNext}
                    disabled={
                      (currentStep === 1 && (!selectedGender || !selectedAge || !selectedMaritalStatus)) ||
                      (currentStep === 2 && (!selectedState || !selectedArea)) ||
                      (currentStep === 3 && !selectedCommunity) ||
                      (currentStep === 4 && (!selectedDisability || 
                        (selectedDisability === 'yes' && !selectedDisabilityPercentage) ||
                        (selectedDisability === 'no' && !selectedMinority))) ||
                      (currentStep === 5 && (!selectedStudent || 
                        (selectedStudent === 'no' && !selectedEmployment)))
                    }
                    className="btn btn-primary flex-1"
                  >
                    {currentStep === 5 ? 'Submit' : 'Next'}
                    {currentStep === 5 ? (
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <ArrowRight className="ml-2 w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Reset Form */}
                <button
                  onClick={handleReset}
                  className="btn btn-sm btn-ghost w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  const { theme } = useDaisyTheme();
  return (
    <div data-theme={theme}>
      <FormContent />
    </div>
  );
}