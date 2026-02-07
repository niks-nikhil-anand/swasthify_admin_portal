import { Metadata } from "next"

import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { RegisterForm } from "@/components/auth/RegisterForm"

export const metadata: Metadata = {
    title: "Create an account | Swasthify",
    description: "Create an account to get started",
}

export default function RegisterPage() {
    return (
        <AuthWrapper
            title="Create an account"
            description="Enter your email below to create your account"
            backButtonLabel="Already have an account? Login"
            backButtonHref="/login"
            showSocial
        >
            <RegisterForm />
        </AuthWrapper>
    )
}
