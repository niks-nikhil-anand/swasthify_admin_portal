import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { AuthWrapper } from "@/components/auth/AuthWrapper"

export default function ForgotPasswordPage() {
    return (
        <AuthWrapper
            title="Forgot Password"
            description="Enter your email to receive password reset instructions"
        >
            <ForgotPasswordForm />
        </AuthWrapper>
    )
}
