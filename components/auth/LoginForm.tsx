"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Smartphone, Mail, KeyRound } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    redirectTo?: string
    role?: string
    onPasswordlessToggle?: () => void
}

export function LoginForm({ className, redirectTo = "/doctor-panel", role = "doctor", onPasswordlessToggle, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [loginMethod, setLoginMethod] = React.useState<"email" | "mobile">("email")
    const [showPassword, setShowPassword] = React.useState(false)

    // Form states
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [mobile, setMobile] = React.useState("")
    const [otp, setOtp] = React.useState("")
    const [isOtpSent, setIsOtpSent] = React.useState(false)

    // Email OTP states
    const [emailMode, setEmailMode] = React.useState<"password" | "otp">("password")
    const [emailOtp, setEmailOtp] = React.useState("")
    const [isEmailOtpSent, setIsEmailOtpSent] = React.useState(false)

    // Timer state
    const [timeLeft, setTimeLeft] = React.useState(30)

    React.useEffect(() => {
        let interval: NodeJS.Timeout

        if ((isOtpSent || isEmailOtpSent) && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isOtpSent, isEmailOtpSent, timeLeft])

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        try {
            if (loginMethod === "email") {
                const body: Record<string, string | undefined> = { email, password, role }

                if (emailMode === "otp") {
                    body.otp = emailOtp
                    delete body.password
                }

                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })

                const data = await response.json()

                if (!response.ok) {
                    toast.error(data.error || "Login failed")
                    setIsLoading(false)
                    return
                }

                console.log("Login successful", data)
                toast.success("Login successful")
                router.refresh()
                router.push(redirectTo)
            } else {
                // Mobile/OTP not implemented yet
                console.log("Mobile login not implemented")
                toast.info("Mobile login coming soon")
                setTimeout(() => {
                    setIsLoading(false)
                }, 2000)
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Authentication failed"
            console.error("Login Error:", error);
            toast.error(errorMessage);
            setIsLoading(false)
        }
    }

    const handleSendOtp = () => {
        if (!mobile) return
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsOtpSent(true)
            setTimeLeft(30) // Reset timer
            console.log("OTP Sent to", mobile)
        }, 1500)
    }

    const handleSendEmailOtp = async () => {
        if (!email) return
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to send OTP")
                return
            }

            setIsEmailOtpSent(true)
            setTimeLeft(30) // Reset timer
            toast.success("OTP sent to your email")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            {/* Method Toggles */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-lg">
                <button
                    type="button"
                    onClick={() => { setLoginMethod("email"); setIsOtpSent(false); }}
                    className={cn(
                        "flex items-center justify-center gap-2 p-2 text-sm font-medium rounded-md transition-all",
                        loginMethod === "email"
                            ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                >
                    <Mail className="w-4 h-4" />
                    Email
                </button>
                <button
                    type="button"
                    onClick={() => { setLoginMethod("mobile"); setIsOtpSent(false); }}
                    className={cn(
                        "flex items-center justify-center gap-2 p-2 text-sm font-medium rounded-md transition-all",
                        loginMethod === "mobile"
                            ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                >
                    <Smartphone className="w-4 h-4" />
                    Mobile
                </button>

            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-4">

                    {loginMethod === "email" ? (
                        <>
                            {/* Email Mode Toggle */}
                            <div className="flex justify-end mb-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmailMode(emailMode === "password" ? "otp" : "password")
                                        setIsEmailOtpSent(false)
                                    }}
                                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                >
                                    {emailMode === "password" ? (
                                        <>
                                            <KeyRound className="w-3 h-3" />
                                            Login via OTP
                                        </>
                                    ) : (
                                        <>
                                            <KeyRound className="w-3 h-3" />
                                            Login via Password
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading || (emailMode === "otp" && isEmailOtpSent)}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    {emailMode === "otp" && !isEmailOtpSent && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSendEmailOtp}
                                            disabled={isLoading || !email}
                                        >
                                            Get OTP
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {emailMode === "password" ? (
                                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            autoCapitalize="none"
                                            autoComplete="current-password"
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
                                    <div className="flex justify-end mt-1">
                                        <button
                                            type="button"
                                            onClick={onPasswordlessToggle}
                                            className="text-xs text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline font-medium"
                                        >
                                            Sign in without password
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                isEmailOtpSent && (
                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="emailOtp">Enter OTP</Label>
                                            <button
                                                type="button"
                                                className="text-xs text-primary hover:text-primary/80"
                                                onClick={() => setIsEmailOtpSent(false)}
                                            >
                                                Change email
                                            </button>
                                        </div>
                                        <Input
                                            id="emailOtp"
                                            placeholder="123456"
                                            type="text"
                                            maxLength={6}
                                            disabled={isLoading}
                                            value={emailOtp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setEmailOtp(val);
                                            }}
                                            required
                                        />
                                        <div className="flex justify-end">
                                            {timeLeft > 0 ? (
                                                <p className="text-xs text-muted-foreground">
                                                    Resend OTP in {timeLeft}s
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="text-xs text-primary hover:text-primary/80 font-medium"
                                                    onClick={handleSendEmailOtp}
                                                    disabled={isLoading}
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </>
                    ) : (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-sm text-muted-foreground border-r border-slate-300 pr-2 h-5 flex items-center">
                                            +91
                                        </span>
                                        <Input
                                            id="mobile"
                                            placeholder="9876543210"
                                            type="tel"
                                            maxLength={10}
                                            disabled={isLoading || isOtpSent}
                                            value={mobile}
                                            className="pl-16"
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setMobile(val);
                                            }}
                                            required
                                        />
                                    </div>
                                    {!isOtpSent && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSendOtp}
                                            disabled={isLoading || mobile.length < 10}
                                        >
                                            Get OTP
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {isOtpSent && (
                                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="otp">Enter OTP</Label>
                                        <button
                                            type="button"
                                            className="text-xs text-primary hover:text-primary/80"
                                            onClick={() => setIsOtpSent(false)}
                                        >
                                            Change number
                                        </button>
                                    </div>
                                    <Input
                                        id="otp"
                                        placeholder="123456"
                                        type="text"
                                        maxLength={6}
                                        disabled={isLoading}
                                        value={otp}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtp(val);
                                        }}
                                        required
                                    />
                                    <div className="flex justify-end">
                                        {timeLeft > 0 ? (
                                            <p className="text-xs text-muted-foreground">
                                                Resend OTP in {timeLeft}s
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                className="text-xs text-primary hover:text-primary/80 font-medium"
                                                onClick={handleSendOtp}
                                                disabled={isLoading}
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <Button disabled={isLoading} className="w-full mt-2">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {loginMethod === "email"
                            ? (emailMode === "otp" ? "Verify & Sign In" : "Sign In")
                            : "Verify & Sign In"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
