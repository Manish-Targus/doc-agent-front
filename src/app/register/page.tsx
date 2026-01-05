"use client"
import React, { useState } from 'react';
import { api } from '../../utils/api';
// Type definitions matching your SQLModel User
interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  designation?: string;
  keywords: string[];
}

interface RegistrationFormProps {
  onSubmit: (formData: Omit<RegistrationFormData, 'confirmPassword'>) => Promise<void>;
  onLoginClick?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, onLoginClick }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    keywords: []
  });
  
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      console.log({submitData})
      await api.registerUser(submitData);
      // await onSubmit(submitData);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, currentKeyword.trim()]
      });
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keywordToRemove)
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Password strength indicator
  const getPasswordStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600'];
    return colors[passwordStrength];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join our professional platform to get started
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <div className="relative">
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 appearance-none text-gray-700"
                >
                  <option value="">Select your role</option>
                  <option value="Manager">Manager</option>
                  <option value="Assistant Manager">Assistant Manager</option>
                  <option value="Senior Executive">Senior Executive</option>
                  <option value="Executive">Executive</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Keywords Field */}
            <div className="text-black">
              <label className="block text-sm font-medium text-gray-700 mb-2">
               Keywords
                <span className="text-gray-400 text-xs font-normal ml-2">
                  Press Enter or click Add to include
                </span>
              </label>
              
              {/* Keyword Tags Display */}
              {formData.keywords.length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-100"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="ml-2 text-blue-500 hover:text-blue-700 text-sm leading-none"
                          aria-label={`Remove ${keyword}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  placeholder=" Enter a keyword & press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full px-4 py-3 bg-white border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300`}
                  placeholder="••••••••"
                />
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength >= 4 ? 'text-blue-600' :
                        passwordStrength >= 3 ? 'text-blue-500' :
                        passwordStrength >= 2 ? 'text-blue-400' :
                        'text-red-500'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-sm text-blue-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Passwords match
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border text-black border-blue-100 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${formData.password.length >= 8 ? 'text-blue-700' : 'text-gray-600'}`}>
                    8+ characters
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${/[A-Z]/.test(formData.password) ? 'text-blue-700' : 'text-gray-600'}`}>
                    Uppercase letter
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${/[0-9]/.test(formData.password) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${/[0-9]/.test(formData.password) ? 'text-blue-700' : 'text-gray-600'}`}>
                    Number
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-blue-700' : 'text-gray-600'}`}>
                    Special character
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 Professional Platform. All rights reserved.</p>
          <p className="mt-1">Your data is securely stored with enterprise-grade encryption</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;