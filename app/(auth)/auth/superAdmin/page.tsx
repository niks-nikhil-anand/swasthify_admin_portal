import { Metadata } from "next"

import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
    title: "Super Admin Login | Swasthify",
    description: "Login to your admin account",
}

export default function SuperAdminLoginPage() {
    return (
        <AuthWrapper
            title="Super Admin Login"
            description="Secure area for administrators only"
            showSocial={false}
        >
            <LoginForm redirectTo="/superAdmin/dashboard" role="superAdmin" />
        </AuthWrapper>
    )
}
