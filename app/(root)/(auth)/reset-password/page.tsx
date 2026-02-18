import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { Loader2 } from "lucide-react"

function ResetPasswordHandler() {
    return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
    return (
        <AuthWrapper
            title="Reset Password"
            description="Enter your new secure password below"
        >
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            }>
                <ResetPasswordHandler />
            </Suspense>
        </AuthWrapper>
    )
}
