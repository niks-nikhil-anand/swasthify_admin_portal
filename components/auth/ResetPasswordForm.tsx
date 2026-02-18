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
    const [userRole, setUserRole] = React.useState<string | null>(null)
    const [email, setEmail] = React.useState<string | null>(null)
    const [isVerifying, setIsVerifying] = React.useState(true)
    const [isValidCode, setIsValidCode] = React.useState(false)

    // Password strength logic
    const getStrength = (pass: string) => {
        if (!pass) return 0
        let strength = 0
        if (pass.length >= 6) strength += 25
        if (pass.length >= 10) strength += 25
        if (/[A-Z]/.test(pass)) strength += 25
        if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) strength += 25
        return strength
    }

    const strength = getStrength(password)
    const strengthColor = strength <= 25 ? "bg-red-500" : strength <= 50 ? "bg-orange-500" : strength <= 75 ? "bg-yellow-500" : "bg-green-500"
    const strengthText = strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"

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

            // 1. Update in Firebase
            await confirmPasswordReset(auth, oobCode, password)

            // 2. Sync to our database
            if (email) {
                const response = await fetch('/api/auth/reset-password-sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })

                if (response.ok) {
                    const data = await response.json()
                    setUserRole(data.role)
                } else {
                    console.error("Failed to sync password to database")
                }
            }

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
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-50" />
                    <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-muted-foreground animate-pulse font-medium">Verifying secure link...</p>
            </div>
        )
    }

    if (!isValidCode) {
        return (
            <div className="text-center space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">Invalid Reset Link</h3>
                    <p className="text-sm text-muted-foreground px-6">
                        This password reset link is invalid or has expired for security reasons.
                    </p>
                </div>
                <Link href="/forgot-password" title="Forgot Password">
                    <Button variant="outline" className="mt-2 px-8">
                        Request New Link
                    </Button>
                </Link>
            </div>
        )
    }

    if (isSuccess) {
        // Map roles to login routes
        let loginUrl = "/login"
        if (userRole === "SUPER_ADMIN") loginUrl = "/auth/superAdmin"
        else if (userRole === "DOCTOR") loginUrl = "/auth/doctor"
        else if (userRole === "LAB") loginUrl = "/auth/lab"

        return (
            <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-500">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Securely Updated!</h3>
                    <p className="text-sm text-muted-foreground px-4">
                        Your password has been successfully updated in our system. You can now use your new credentials to sign in.
                    </p>
                </div>
                <Link href={loginUrl}>
                    <Button className="w-full mt-4 h-11 text-base font-medium transition-all hover:translate-y-[-2px] hover:shadow-lg">
                        Proceed to Login
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className={cn("grid gap-8", className)} {...props}>
            <div className="relative">
                <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                <div className="pt-2 text-center">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Account Security</span>
                    <p className="mt-1 text-sm text-foreground/80">
                        Resetting for <span className="font-bold text-primary">{email}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative group">
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                disabled={isLoading}
                                className="h-11 border-muted-foreground/20 focus:border-primary transition-all pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {password && (
                            <div className="mt-2 space-y-1.5 animate-in slide-in-from-top-1">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Strength: {strengthText}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground">{strength}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-500", strengthColor)}
                                        style={{ width: `${strength}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="h-11 border-muted-foreground/20 focus:border-primary transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <Button
                    disabled={isLoading || !password || !confirmPassword || strength < 25}
                    className="w-full h-11 text-base font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <ShieldCheck className="mr-2 h-5 w-5" />
                    )}
                    Update Password Securely
                </Button>
            </form>

            <div className="text-center pt-2">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    By updating your password, you ensure your account remains protected.
                    Choose a strong password with letters, numbers, and symbols.
                </p>
            </div>
        </div>
    )
}
