import { Metadata } from "next"

import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
    title: "Login | Swasthify",
    description: "Login to your account",
}

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
    const redirectTo = searchParams.redirect || "/me";

    return (
        <AuthWrapper
            title="Welcome back"
            description="Enter your email to sign in to your account"
            backButtonLabel="Don't have an account? Sign Up"
            backButtonHref="/register"
            showSocial
        >
            <LoginForm role="patient" redirectTo={redirectTo} />
        </AuthWrapper>
    )
}

