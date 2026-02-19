import { Metadata } from "next"

import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
    title: "Lab Login | Swasthify",
    description: "Login to your lab account",
}

export default function LabLoginPage() {
    return (
        <AuthWrapper
            title="Lab Login"
            description="Enter your credentials to access the lab dashboard"
            backButtonLabel="Don't have an account? Register"
            backButtonHref="/lab-partner"
            showSocial
            role="lab"
            redirectTo="/lab-panel/profile"
        >
            <LoginForm redirectTo="/lab-panel/profile" role="lab" />
        </AuthWrapper>
    )
}
