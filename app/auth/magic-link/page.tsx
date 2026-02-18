"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function MagicLinkHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Construct the verification URL with all existing search parameters from Firebase
        // This includes oobCode, apiKey, mode, etc.
        const params = new URLSearchParams(searchParams.toString())
        const targetUrl = `/login/verify?${params.toString()}`
        console.log("MagicLinkHandler: Redirecting to", targetUrl)
        router.push(targetUrl)
    }, [router, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirecting to verification...</p>
        </div>
    )
}

export default function MagicLinkPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        }>
            <MagicLinkHandler />
        </Suspense>
    )
}
