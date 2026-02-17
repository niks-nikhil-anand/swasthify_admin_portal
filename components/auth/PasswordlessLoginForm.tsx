"use client"

import * as React from "react"
import { sendSignInLinkToEmail } from "firebase/auth"
import { Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PasswordlessLoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onBackToLogin: () => void
    redirectTo?: string
    role?: string
}

export function PasswordlessLoginForm({ className, onBackToLogin, redirectTo = "/me", role = "patient", ...props }: PasswordlessLoginFormProps) {
    const [email, setEmail] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSent, setIsSent] = React.useState(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        const actionCodeSettings = {
            url: `${window.location.origin}/login/verify?redirectTo=${encodeURIComponent(redirectTo)}&role=${role}`,
            handleCodeInApp: true,
        }

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings)
            window.localStorage.setItem('emailForSignIn', email)
            setIsSent(true)
            toast.success("Sign-in link sent to your email!")
        } catch (error) {
            console.error("Error sending email link:", error)
            toast.error("Failed to send sign-in link. Please try again.")
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
                    We've sent a sign-in link to <span className="font-medium text-foreground">{email}</span>.
                    Click the link in the email to sign in instantly.
                </p>
                <Button variant="ghost" onClick={onBackToLogin} className="mt-4">
                    Back to login
                </Button>
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
                        Send Sign-in Link
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        Or
                    </span>
                </div>
            </div>
            <Button variant="outline" onClick={onBackToLogin} disabled={isLoading}>
                Back to standard login
            </Button>
        </div>
    )
}
