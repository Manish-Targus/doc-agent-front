"use client";
import React, { useState } from 'react';
import { LayoutGrid, Loader2, LogIn } from 'lucide-react';
import styles from './LoginView.module.css';
import { api } from '../../utils/api';

export default function LoginView({ onLogin }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); onLogin(); }, 800);
    };
const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        try {
            await api.loginUser({ email, password });
            onLogin();
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <LayoutGrid size={32} />
                </div>
                <h2 className={styles.title}>Welcome back</h2>
                <p className={styles.subtitle}>Log in to your dashboard</p>

                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={styles.input} defaultValue="demo@docubot.ai" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input type="password" className={styles.input} defaultValue="password" />
                    </div>
                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}