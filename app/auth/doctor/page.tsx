"use client"

import * as React from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"
import { PasswordlessLoginForm } from "@/components/auth/PasswordlessLoginForm"

export default function DoctorLoginPage() {
    const [authMode, setAuthMode] = React.useState<"standard" | "passwordless">("standard")

    return (
        <AuthWrapper
            title={authMode === "standard" ? "Doctor Login" : "Doctor - Secure Sign-in"}
            description={authMode === "standard"
                ? "Enter your credentials to access the doctor dashboard"
                : "Enter your doctor email to receive a secure sign-in link"
            }
            backButtonLabel="Don't have an account? Register"
            backButtonHref="/doctor-partner"
            showSocial
            role="doctor"
            redirectTo="/doctor-panel/profile"
            onEmailLinkClick={() => setAuthMode("passwordless")}
        >
            {authMode === "standard" ? (
                <LoginForm
                    redirectTo="/doctor-panel/profile"
                    role="doctor"
                    onPasswordlessToggle={() => setAuthMode("passwordless")}
                />
            ) : (
                <PasswordlessLoginForm
                    onBackToLogin={() => setAuthMode("standard")}
                    redirectTo="/doctor-panel/profile"
                    role="doctor"
                />
            )}
        </AuthWrapper>
    )
}
