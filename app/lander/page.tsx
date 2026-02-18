"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function LanderHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const mode = params.get('mode')

        let targetUrl = `/login/verify?${params.toString()}`

        if (mode === 'resetPassword') {
            targetUrl = `/reset-password?${params.toString()}`
        } else if (mode === 'signIn') {
            // Forward to magic-link handler to be safe, or go direct
            targetUrl = `/auth/magic-link?${params.toString()}`
        }

        console.log(`LanderHandler (mode: ${mode}): Redirecting to`, targetUrl)
        router.push(targetUrl)
    }, [router, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Initializing...</p>
        </div>
    )
}

export default function LanderPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        }>
            <LanderHandler />
        </Suspense>
    )
}
