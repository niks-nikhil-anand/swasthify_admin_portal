"use client"

import * as React from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"
import { PasswordlessLoginForm } from "@/components/auth/PasswordlessLoginForm"

export default function SuperAdminLoginPage() {
    const [authMode, setAuthMode] = React.useState<"standard" | "passwordless">("standard")

    return (
        <AuthWrapper
            title={authMode === "standard" ? "Super Admin Login" : "Super Admin - Secure Sign-in"}
            description={authMode === "standard"
                ? "Secure area for administrators only"
                : "Enter your admin email to receive a secure sign-in link"
            }
            showSocial={true} // Enabled to show the Email Link button
            onEmailLinkClick={() => setAuthMode("passwordless")}
        >
            {authMode === "standard" ? (
                <LoginForm
                    redirectTo="/superAdmin/dashboard"
                    role="superAdmin"
                    onPasswordlessToggle={() => setAuthMode("passwordless")}
                />
            ) : (
                <PasswordlessLoginForm
                    onBackToLogin={() => setAuthMode("standard")}
                    redirectTo="/superAdmin/dashboard"
                    role="superAdmin"
                />
            )}
        </AuthWrapper>
    )
}
