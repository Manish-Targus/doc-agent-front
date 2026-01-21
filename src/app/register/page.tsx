"use client";
import React, { useState } from "react";
import {
  Loader2,
  LayoutGrid,
  UserPlus,
  Check,
  X
} from "lucide-react";
import { api } from "../../utils/api";

interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  designation?: string;
  keywords: string[];
}

export default function Register() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    keywords: []
  });

  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name) e.name = "Name is required";
    if (!formData.email) e.email = "Email is required";
    if (formData.password.length < 8) e.password = "Min 8 characters";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await api.registerUser(payload);
      window.location.href = "/login";
    } catch {
      setErrors({ submit: "Registration failed. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addKeyword = () => {
    if (currentKeyword && !formData.keywords.includes(currentKeyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, currentKeyword]
      });
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (k: string) =>
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((x) => x !== k)
    });

  return (
    <div className="relative z-10 h-screen flex flex-col text-slate-500 ">
      <div className="flex items-center justify-center  p-4">
        <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">

          {/* Header */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300 -rotate-3">
              <LayoutGrid className="w-10 h-10 text-amber-300" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Create Account
          </h2>
          <p className="text-center text-slate-500 mb-8 font-medium">
            Register to access your dashboard
          </p>

          {errors.submit && (
            <p className="text-red-600 text-center mb-4 font-medium">
              {errors.submit}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input"
              />
            </div>

            {/* Designation */}
            <select
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              className="input text-slate-500"
            >
              <option value="">Select Designation</option>
              <option>Manager</option>
              <option>Assistant Manager</option>
              <option>Senior Executive</option>
              <option>Executive</option>
            </select>

            {/* Keywords */}
            <div>
              <div className="flex gap-2 mb-2 text-slate-500">
                <input
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                  placeholder="Add keyword & press Enter"
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-5 rounded-xl bg-slate-100 font-bold hover:bg-slate-200"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((k) => (
                  <span
                    key={k}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium flex items-center gap-1"
                  >
                    {k}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => removeKeyword(k)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="input"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value
                  })
                }
                className="input"
              />
            </div>

            {/* Password strength */}
            {formData.password && (
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
            )}
<div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
  <p className="text-sm font-bold text-slate-800 mb-3">
    Password Requirements
  </p>

  <div className="grid grid-cols-2 gap-3 text-sm">
    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${
          formData.password.length >= 8
            ? "bg-amber-400"
            : "bg-slate-300"
        }`}
      />
      <span
        className={
          formData.password.length >= 8
            ? "text-slate-900 font-medium"
            : "text-slate-500"
        }
      >
        8+ characters
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${
          /[A-Z]/.test(formData.password)
            ? "bg-amber-400"
            : "bg-slate-300"
        }`}
      />
      <span
        className={
          /[A-Z]/.test(formData.password)
            ? "text-slate-900 font-medium"
            : "text-slate-500"
        }
      >
        Uppercase letter
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${
          /[0-9]/.test(formData.password)
            ? "bg-amber-400"
            : "bg-slate-300"
        }`}
      />
      <span
        className={
          /[0-9]/.test(formData.password)
            ? "text-slate-900 font-medium"
            : "text-slate-500"
        }
      >
        Number
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${
          /[^A-Za-z0-9]/.test(formData.password)
            ? "bg-amber-400"
            : "bg-slate-300"
        }`}
      />
      <span
        className={
          /[^A-Za-z0-9]/.test(formData.password)
            ? "text-slate-900 font-medium"
            : "text-slate-500"
        }
      >
        Special character
      </span>
    </div>
  </div>
</div>
            {/* Submit */}
            <button
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-slate-300 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UserPlus />
              )}
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>

            {/* Login link */}
            <p className="text-center text-slate-600">
              Already have an account?{" "}
              <a href="/login" className="font-bold hover:text-amber-500">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Shared input style */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.9rem 1.25rem;
          border-radius: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          outline: none;
          font-weight: 500;
        }
        .input:focus {
          border-color: #94a3b8;
          box-shadow: 0 0 0 4px #f1f5f9;
        }
      `}</style>
    </div>
  );
}
