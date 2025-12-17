import Link from "next/link"
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
                        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6 text-primary"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                                />
                            </svg>
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

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Placeholder social buttons */}
                                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                            <path d="M12.0003 20.45c-4.6667 0-8.4503-3.7836-8.4503-8.4503 0-4.6667 3.7836-8.45 8.4503-8.45 4.6667 0 8.45 3.7833 8.45 8.45 0 4.6667-3.7833 8.4503-8.45 8.4503zm0-1.69c3.7336 0 6.7603-3.0267 6.7603-6.7603 0-3.7336-3.0267-6.76-6.7603-6.76-3.7336 0-6.7603 3.0264-6.7603 6.76 0 3.7336 3.0267 6.7603 6.7603 6.7603zm0-3.38c-1.8665 0-3.3802-1.5136-3.3802-3.3802 0-1.8666 1.5137-3.38 3.3802-3.38 1.8666 0 3.3802 1.5134 3.3802 3.38 0 1.8666-1.5136 3.3803-3.3802 3.3803z" fill="currentColor" />
                                        </svg>
                                        Google
                                    </button>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M13.444 12h5.778c.272 0 .528.083.736.223l.112.086a.916.916 0 01.372.748c0 .285-.118.543-.306.732l-.08.07-5.834 4.376 2.228 7.025c.092.291.025.61-.177.832l-.086.083a.902.902 0 01-.734.22h-.056c-.282 0-.542-.119-.73-.31l-.076-.088-5.872-7.554-5.874 7.554c-.179.231-.448.375-.742.396l-.088.002a.903.903 0 01-.736-.22l-.086-.083a.907.907 0 01-.177-.832l2.228-7.025-5.834-4.376a1.025 1.025 0 01-.306-.732c0-.285.118-.543.306-.732l.08-.07h.062c.208-.14.464-.223.736-.223h5.778L8.134 4.22a.915.915 0 01.294-.748.915.915 0 01.782-.13l.096.035L12 4.41l2.694-1.033a.915.915 0 01.878.095.915.915 0 01.294.748L13.444 12z" />
                                        </svg>
                                        Facebook
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
