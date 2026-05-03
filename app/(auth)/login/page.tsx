"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/Button";
import Input from "@/components/forms/Input";
import AuthLayout from "@/components/layout/AuthLayout";
import Loader from "@/components/common/Loader";

function LoginForm() {
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login(formData);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {registered && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-2xl animate-in zoom-in duration-300">
                    <p className="text-sm text-accent text-center font-semibold">
                        ✅ Registration successful!
                    </p>
                    <p className="text-xs text-text-secondary text-center mt-1">
                        Your account is pending admin approval.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    autoComplete="email"
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    autoComplete="current-password"
                    showPasswordToggle
                />

                <div className="flex justify-end">
                    <Link 
                        href="/forgot-password" 
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20"
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border-theme text-center">
                <p className="text-text-secondary">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </>
    );
}

export default function LoginPage() {
    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to your account to continue"
        >
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader size="lg" />
                    <p className="text-text-secondary animate-pulse">Initializing login...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </AuthLayout>
    );
}
