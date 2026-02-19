"use client"

import * as React from "react"
import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { auth, googleProvider } from "@/lib/firebase"

interface UseGoogleAuthProps {
    role?: string
    redirectTo?: string
}

export function useGoogleAuth({ role = "patient", redirectTo = "/me" }: UseGoogleAuthProps = {}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const signInWithGoogle = async () => {
        setIsLoading(true)
        try {
            console.log("Starting Google sign-in with role:", role)

            // 1. Sign in with Firebase
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            if (!user.email) {
                throw new Error("Could not retrieve email from Google account.")
            }

            // 2. Sync with our backend
            const response = await fetch("/api/auth/sync-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    name: user.displayName,
                    role: role
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to sync session with server")
            }

            console.log("Social login session synced:", data)
            toast.success("Successfully signed in with Google!")

            // 3. Determine final redirect
            const userRole = data.user?.role?.toUpperCase()
            let finalRedirect = redirectTo

            // Role-based safety redirects
            if (userRole === "SUPER_ADMIN" && !redirectTo.startsWith("/superAdmin")) {
                finalRedirect = "/superAdmin/dashboard"
            } else if (userRole === "DOCTOR" && !redirectTo.startsWith("/doctor-panel")) {
                finalRedirect = "/doctor-panel/profile"
            } else if (userRole === "LAB" && !redirectTo.startsWith("/lab-panel")) {
                finalRedirect = "/lab-panel/profile"
            }

            router.push(finalRedirect)
            // Force refresh to update navbar state
            router.refresh()

        } catch (error: any) {
            console.error("Google auth error:", error)
            if (error.code !== "auth/popup-closed-by-user") {
                toast.error(error.message || "An error occurred during Google sign-in")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        signInWithGoogle,
        isLoading
    }
}
