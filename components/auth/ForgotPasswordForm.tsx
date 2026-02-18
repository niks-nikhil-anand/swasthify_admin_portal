"use client"

import * as React from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onBackToLogin?: () => void
}

export function ForgotPasswordForm({ className, onBackToLogin, ...props }: ForgotPasswordFormProps) {
    const [email, setEmail] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSent, setIsSent] = React.useState(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Configuration for the password reset link
        const actionCodeSettings = {
            // This should be the URL where the user is redirected back to after setting the password
            url: `${window.location.origin}/login`,
            handleCodeInApp: true,
        }

        try {
            await sendPasswordResetEmail(auth, email)
            setIsSent(true)
            toast.success("Password reset email sent!")
        } catch (error: any) {
            console.error("Error sending password reset email:", error)
            const errorMessage = error.code === 'auth/user-not-found'
                ? "No account found with this email."
                : "Failed to send reset email. Please try again."
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSent) {
        return (
            <div className="text-center space-y-4 py-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>.
                </p>
                <Link href="/login" className="inline-block mt-4">
                    <Button variant="outline">
                        Back to login
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button disabled={isLoading || !email} className="w-full">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send Reset Link
                    </Button>
                </div>
            </form>
            <div className="text-center">
                <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to login
                </Link>
            </div>
        </div>
    )
}
