"use client"

import * as React from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"
import { PasswordlessLoginForm } from "@/components/auth/PasswordlessLoginForm"

export default function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
    const params = React.use(searchParams);
    const redirectTo = params.redirect || "/me";
    const [authMode, setAuthMode] = React.useState<"standard" | "passwordless">("standard")

    return (
        <AuthWrapper
            title={authMode === "standard" ? "Welcome back" : "Passwordless Sign-in"}
            description={authMode === "standard"
                ? "Enter your email to sign in to your account"
                : "Enter your email to receive a secure sign-in link"
            }
            backButtonLabel="Don't have an account? Sign Up"
            backButtonHref="/register"
            showSocial
            role="patient"
            redirectTo={redirectTo}
            onEmailLinkClick={() => setAuthMode("passwordless")}
        >
            {authMode === "standard" ? (
                <LoginForm
                    role="patient"
                    redirectTo={redirectTo}
                    onPasswordlessToggle={() => setAuthMode("passwordless")}
                />
            ) : (
                <PasswordlessLoginForm
                    onBackToLogin={() => setAuthMode("standard")}
                    role="patient"
                />
            )}
        </AuthWrapper>
    )
}

