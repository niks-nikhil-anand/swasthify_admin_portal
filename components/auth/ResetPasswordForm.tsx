"use client"

import * as React from "react"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function ResetPasswordForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const oobCode = searchParams.get('oobCode')

    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSuccess, setIsSuccess] = React.useState(false)
    const [email, setEmail] = React.useState<string | null>(null)
    const [isVerifying, setIsVerifying] = React.useState(true)
    const [isValidCode, setIsValidCode] = React.useState(false)

    React.useEffect(() => {
        if (!oobCode) {
            setIsVerifying(false)
            setIsValidCode(false)
            return
        }

        const verifyCode = async () => {
            try {
                const userEmail = await verifyPasswordResetCode(auth, oobCode)
                setEmail(userEmail)
                setIsValidCode(true)
            } catch (error) {
                console.error("Error verifying reset code:", error)
                setIsValidCode(false)
                toast.error("The password reset link is invalid or has expired.")
            } finally {
                setIsVerifying(false)
            }
        }

        verifyCode()
    }, [oobCode])

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            if (!oobCode) throw new Error("Missing reset code")
            await confirmPasswordReset(auth, oobCode, password)
            setIsSuccess(true)
            toast.success("Password has been reset successfully!")
        } catch (error: any) {
            console.error("Error resetting password:", error)
            toast.error("Failed to reset password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying secure link...</p>
            </div>
        )
    }

    if (!isValidCode) {
        return (
            <div className="text-center space-y-4 py-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Invalid Link</h3>
                <p className="text-sm text-muted-foreground">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link href="/forgot-password" title="Forgot Password">
                    <Button variant="outline" className="mt-4">
                        Request New Link
                    </Button>
                </Link>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="text-center space-y-4 py-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Password Reset!</h3>
                <p className="text-sm text-muted-foreground">
                    Your password has been successfully updated. You can now log in with your new password.
                </p>
                <Link href="/login">
                    <Button className="w-full mt-4">
                        Login Now
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <div className="text-center mb-2">
                <p className="text-sm text-muted-foreground">
                    Resetting password for <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button disabled={isLoading || !password || !confirmPassword} className="w-full">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update Password
                    </Button>
                </div>
            </form>
        </div>
    )
}
