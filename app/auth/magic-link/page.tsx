"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function MagicLinkHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const queryString = window.location.search
        const params = new URLSearchParams(queryString)
        const mode = params.get('mode')
        const currentHost = window.location.hostname

        // 1. Normalize Domain
        if (currentHost === "swasthify.in") {
            const targetUrl = `https://www.swasthify.in${window.location.pathname}${queryString}`
            console.log("Normalization: Moving to www domain", targetUrl)
            window.location.href = targetUrl
            return
        }

        // 2. Direct Redirection
        let targetPath = "/login/verify"

        if (mode === 'resetPassword') {
            targetPath = "/reset-password"
        }

        const finalUrl = `${targetPath}${queryString}`
        console.log(`MagicLinkHandler (mode: ${mode}): Redirecting to`, finalUrl)
        router.push(finalUrl)
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
