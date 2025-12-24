import { Metadata } from "next"

import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
    title: "Doctor Login | Swasthify",
    description: "Login to your doctor account",
}

export default function DoctorLoginPage() {
    return (
        <AuthWrapper
            title="Doctor Login"
            description="Enter your credentials to access the doctor dashboard"
            backButtonLabel="Don't have an account? Register"
            backButtonHref="/register/doctor"
            showSocial
        >
            <LoginForm redirectTo="/doctor-panel" role="doctor" />
        </AuthWrapper>
    )
}
