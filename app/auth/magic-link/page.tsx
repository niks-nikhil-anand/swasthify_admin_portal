"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function MagicLinkPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Construct the verification URL with all existing search parameters
        const params = new URLSearchParams(searchParams.toString())
        router.push(`/login/verify?${params.toString()}`)
    }, [router, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirecting to verification...</p>
        </div>
    )
}
