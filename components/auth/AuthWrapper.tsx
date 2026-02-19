import Link from "next/link"
import Image from "next/image"
import { Smartphone, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"

interface AuthWrapperProps {
    children: React.ReactNode
    title: string
    description?: string
    backButtonLabel?: string
    backButtonHref?: string
    showSocial?: boolean
    onGoogleClick?: () => void
    onEmailLinkClick?: () => void
    className?: string
    role?: string
    redirectTo?: string
}

export function AuthWrapper({
    children,
    title,
    description,
    backButtonLabel,
    backButtonHref,
    showSocial,
    onGoogleClick,
    onEmailLinkClick,
    className,
    role = "patient",
    redirectTo = "/me"
}: AuthWrapperProps) {
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth({ role, redirectTo })

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 sm:px-6 lg:px-8 bg-page-bg">
            <div className={cn("w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
                <div className="bg-card px-10 py-12 shadow-xl sm:rounded-xl ring-1 ring-black/5 border border-border/50">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center mb-4">
                            <Image
                                src="/logo.png"
                                alt="Swasthify"
                                width={48}
                                height={48}
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {children}

                        {showSocial && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3" >
                                    <button
                                        onClick={onGoogleClick || signInWithGoogle}
                                        disabled={isGoogleLoading}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isGoogleLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                        )}
                                        {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                                            <Smartphone className="h-4 w-4" />
                                            Login via OTP
                                        </button>
                                        <button
                                            onClick={onEmailLinkClick}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                                        >
                                            <Mail className="h-4 w-4" />
                                            Email Link
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {backButtonLabel && backButtonHref && (
                            <div className="text-center text-sm">
                                <Link
                                    href={backButtonHref}
                                    className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                                >
                                    {backButtonLabel}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
