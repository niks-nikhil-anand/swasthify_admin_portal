import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AuthWrapperProps {
    children: React.ReactNode
    title: string
    description?: string
    backButtonLabel?: string
    backButtonHref?: string
    showSocial?: boolean
    className?: string
}

export function AuthWrapper({
    children,
    title,
    description,
    backButtonLabel,
    backButtonHref,
    showSocial,
    className,
}: AuthWrapperProps) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 sm:px-6 lg:px-8 bg-page-bg">
            <div className={cn("w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
                <div className="bg-card px-10 py-12 shadow-xl sm:rounded-xl ring-1 ring-black/5 border border-border/50">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                        {/* Logo placeholder - replace with actual logo if available */}
                        {/* Logo */}
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
                                    {/* Placeholder social buttons */}
                                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                            <path d="M12.0003 20.45c-4.6667 0-8.4503-3.7836-8.4503-8.4503 0-4.6667 3.7836-8.45 8.4503-8.45 4.6667 0 8.45 3.7833 8.45 8.45 0 4.6667-3.7833 8.4503-8.45 8.4503zm0-1.69c3.7336 0 6.7603-3.0267 6.7603-6.7603 0-3.7336-3.0267-6.76-6.7603-6.76-3.7336 0-6.7603 3.0264-6.7603 6.76 0 3.7336 3.0267 6.7603 6.7603 6.7603zm0-3.38c-1.8665 0-3.3802-1.5136-3.3802-3.3802 0-1.8666 1.5137-3.38 3.3802-3.38 1.8666 0 3.3802 1.5134 3.3802 3.38 0 1.8666-1.5136 3.3803-3.3802 3.3803z" fill="currentColor" />
                                        </svg>
                                        Google
                                    </button>
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
