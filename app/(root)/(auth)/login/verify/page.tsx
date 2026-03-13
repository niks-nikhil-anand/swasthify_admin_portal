"use client"

import * as React from "react"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { auth } from "@/lib/firebase"
import { AuthWrapper } from "@/components/auth/AuthWrapper"

export default function VerifyEmailLinkPage() {
    const router = useRouter()
    const [status, setStatus] = React.useState<"verifying" | "error" | "success">("verifying")

    React.useEffect(() => {
        const verify = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn')

                if (!email) {
                    // Fallback if email is missing from storage (e.g. user opened link on different device)
                    console.log("Email not found in localStorage, prompting user...");
                    email = window.prompt('Please provide your email for confirmation')
                }

                if (email) {
                    try {
                        console.log("Attempting Firebase sign-in with email link...", {
                            email,
                            href: window.location.href,
                            isSignInLink: isSignInWithEmailLink(auth, window.location.href)
                        });

                        await signInWithEmailLink(auth, email, window.location.href)
                        window.localStorage.removeItem('emailForSignIn')
                        console.log("Firebase sign-in successful for:", email);

                        // Sync with our backend session to set cookies
                        const url = new URL(window.location.href)
                        const roleFromUrl = url.searchParams.get('role') || "patient"
                        const redirectTo = url.searchParams.get('redirectTo') || "/me"

                        console.log("Syncing session with backend...", { email, roleFromUrl });
                        const syncResponse = await fetch("/api/auth/sync-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, role: roleFromUrl }),
                        })

                        const syncData = await syncResponse.json();

                        if (!syncResponse.ok) {
                            console.error("Session sync failed:", syncData);
                            throw new Error(syncData.error || "Failed to sync session cookies")
                        }

                        console.log("Session sync successful", syncData);
                        setStatus("success")
                        toast.success("Signed in successfully!")

                        // Determine final redirect based on user role from backend
                        const userRole = syncData.user?.role?.toUpperCase();
                        let finalRedirect = redirectTo;

                        // If user is admin/doctor/lab but on patient profile, redirect to their dashboard
                        if (userRole === "SUPER_ADMIN" && !redirectTo.startsWith("/superAdmin")) {
                            finalRedirect = "/superAdmin/dashboard";
                        } else if (userRole === "DOCTOR" && !redirectTo.startsWith("/doctor-panel")) {
                            finalRedirect = "/doctor-panel/dashboard";
                        } else if (userRole === "LAB" && !redirectTo.startsWith("/lab-panel")) {
                            finalRedirect = "/lab-panel/dashboard";
                        } else if (userRole === "PATIENT" && !redirectTo.startsWith("/me")) {
                            finalRedirect = "/me";
                        }

                        console.log("Redirecting to:", finalRedirect);

                        // Wait a bit before redirecting
                        setTimeout(() => {
                            router.push(finalRedirect)
                        }, 1500)
                    } catch (error: unknown) {
                        const errorMessage = error instanceof Error ? error.message : "Failed to sign in"
                        console.error("Error signing in with email link:", error)
                        setStatus("error")
                        toast.error(errorMessage)
                    }
                } else {
                    setStatus("error")
                    toast.error("Email is required to sign in")
                }
            } else {
                router.push("/login")
            }
        }

        verify()
    }, [router])

    return (
        <AuthWrapper
            title="Verifying Sign-in"
            description="Please wait while we verify your secure sign-in link"
        >
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                {status === "verifying" && (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Checking credentials...</p>
                    </>
                )}
                {status === "error" && (
                    <div className="text-center space-y-4">
                        <div className="text-destructive font-medium">Verification failed</div>
                        <button
                            onClick={() => router.push("/login")}
                            className="text-primary hover:underline text-sm"
                        >
                            Retry Login
                        </button>
                    </div>
                )}
                {status === "success" && (
                    <div className="text-center space-y-4">
                        <div className="text-green-600 font-medium">Successfully verified!</div>
                        <p className="text-sm text-muted-foreground">Redirecting you to dashboard...</p>
                    </div>
                )}
            </div>
        </AuthWrapper>
    )
}
