"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function LanderHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // This page handles redirects from the /lander path (often a legacy or default Firebase handler)
        // by forwarding all parameters to our main magic-link handler.
        const params = new URLSearchParams(searchParams.toString())
        const targetUrl = `/auth/magic-link?${params.toString()}`
        console.log("LanderHandler: Redirecting to", targetUrl)
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
