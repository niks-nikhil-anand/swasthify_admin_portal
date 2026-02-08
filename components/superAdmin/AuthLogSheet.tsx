"use client"

import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    MapPin,
    ShieldCheck,
    UserPlus,
    LogIn,
    Info,
    ChevronRight,
    Loader2
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"

interface AuthLog {
    id: string
    type: "SIGN_IN" | "SIGN_UP"
    deviceType: string | null
    os: string | null
    osVersion: string | null
    browser: string | null
    browserVersion: string | null
    country: string | null
    region: string | null
    city: string | null
    timezone: string | null
    ipAddress: string | null
    createdAt: string
}

interface AuthLogSheetProps {
    userId: string
    userName: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AuthLogSheet({ userId, userName, open, onOpenChange }: AuthLogSheetProps) {
    const [logs, setLogs] = useState<AuthLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (open) {
            const fetchLogs = async () => {
                setLoading(true)
                try {
                    const response = await fetch(`/api/user/${userId}/auth-logs`)
                    if (response.ok) {
                        const data = await response.json()
                        setLogs(data.authLogs)
                    }
                } catch (error) {
                    console.error("Failed to fetch auth logs", error)
                } finally {
                    setLoading(false)
                }
            }
            fetchLogs()
        }
    }, [open, userId])

    const getDeviceIcon = (deviceType: string | null) => {
        switch (deviceType?.toLowerCase()) {
            case "mobile": return <Smartphone className="h-4 w-4" />
            case "tablet": return <Tablet className="h-4 w-4" />
            default: return <Monitor className="h-4 w-4" />
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md w-full p-0 flex flex-col">
                <SheetHeader className="p-6 border-b">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-xs font-bold tracking-widest uppercase">Security Audit</span>
                    </div>
                    <SheetTitle className="text-2xl">Authentication Logs</SheetTitle>
                    <SheetDescription>
                        Tracking access history for <span className="font-semibold text-foreground">{userName}</span>
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">Retrieving security events...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-8 relative">
                                {/* Timeline line */}
                                <div className="absolute left-9 top-10 bottom-10 w-px bg-border" />

                                {logs.map((log, index) => (
                                    <div key={log.id} className="relative pl-10 group">
                                        {/* Timeline dot */}
                                        <div className={cn(
                                            "absolute left-7 top-1.5 h-4 w-4 rounded-full border-2 bg-background z-10 transition-transform group-hover:scale-125",
                                            log.type === "SIGN_UP" ? "border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                        )} />

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {log.type === "SIGN_UP" ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50">
                                                            <UserPlus className="mr-1 h-3 w-3" />
                                                            Registration
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200/50">
                                                            <LogIn className="mr-1 h-3 w-3" />
                                                            Login
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border border-border/50">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                </div>
                                            </div>

                                            <div className="grid gap-3 p-4 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/40 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/20">
                                                {/* Device info row */}
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-xl bg-background border border-border/50 shadow-inner">
                                                        {getDeviceIcon(log.deviceType)}
                                                    </div>
                                                    <div className="flex-1 space-y-0.5">
                                                        <p className="text-sm font-semibold">{log.browser} {log.browserVersion?.split('.')[0]}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                            <span className="font-medium text-foreground/70">{log.os} {log.osVersion}</span>
                                                            <span className="block w-1 h-1 rounded-full bg-border" />
                                                            <span>{log.deviceType || "desktop"}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background/50 border border-border/30">
                                                        <Globe className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-mono text-muted-foreground truncate" title={log.ipAddress || ''}>
                                                            {log.ipAddress || "0.0.0.0"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background/50 border border-border/30">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-medium text-muted-foreground truncate">
                                                            {log.city ? `${log.city}, ${log.country}` : log.country || "Unknown Location"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[10px] pt-1 text-muted-foreground/60">
                                                    <span>{format(new Date(log.createdAt), "MMM d, yyyy • HH:mm:ss")}</span>
                                                    {log.timezone && <span>{log.timezone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                                <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-tr from-muted to-background border-2 border-dashed border-border flex items-center justify-center">
                                    <Info className="h-10 w-10 text-muted-foreground/40" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold italic tracking-tight">No Events Recorded</h3>
                                <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                                    We couldn't find any authentication events for this user in the audit logs.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-muted/20">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Pro Tip</span>
                            <span className="text-xs text-muted-foreground">Regularly check logs for suspicious activity patterns.</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <ChevronRight className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
