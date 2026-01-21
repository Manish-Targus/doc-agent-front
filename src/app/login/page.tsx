"use client";
import React, { useState } from 'react';
import { Loader2, LayoutGrid, LogIn } from 'lucide-react';
import { api } from '../../utils/api';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await api.loginUser({
                email,
                password
            });
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 h-screen flex flex-col">

            <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">

                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300 transform -rotate-3">
                            <LayoutGrid className="w-10 h-10 text-amber-300" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-2 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="text-center text-slate-500 mb-8 font-medium">
                        Log in to your dashboard
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all outline-none text-slate-800 font-medium"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all outline-none text-slate-800 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 text-center font-medium">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-slate-300 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                        <a href="/register" className='flex justify-center'>
                            <p className='text-black m-2'>
                                Dont have an Account? <span className='text-black  cursor-pointer hover:text-amber-500'>Sign up here</span>
                            </p>
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
