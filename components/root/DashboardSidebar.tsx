"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { User, Calendar, FileText, ClipboardList, Settings, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
    { label: "Profile", href: "/me", icon: User },
    { label: "Appointments", href: "/me/appointments", icon: Calendar },
    { label: "Lab Reports", href: "/me/reports", icon: FileText },
    { label: "Health Records", href: "/me/health-records", icon: ClipboardList },
    { label: "Settings", href: "/me/settings", icon: Settings },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "USER" }),
            });

            if (res.ok) {
                toast.success("Logout successful");
                window.location.href = "/";
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Logout error", error);
            toast.error("An error occurred during logout.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <aside className="order-2 flex w-full flex-col gap-4 lg:order-1 lg:sticky lg:top-24 lg:w-64 lg:self-start">
            <div className="order-1 hidden rounded-2xl border border-border/50 bg-background p-4 shadow-sm backdrop-blur-sm lg:block">
                <nav className="flex flex-col gap-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                                {link.label}
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 group hover:bg-destructive/10 hover:text-destructive"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <LogOut className="h-5 w-5 group-hover:text-destructive transition-colors" />
                        )}
                        Logout
                    </button>
                </nav>
            </div>

            {/* Support section */}
            <div className="order-2 rounded-2xl border border-border/50 bg-muted/20 p-6">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 opacity-50">Need Help?</h4>
                <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Our health experts are available 24/7 to assist you with any queries.
                    </p>
                    <Link href="/contact" className="block w-full rounded-xl bg-foreground px-4 py-2.5 text-center text-xs font-bold text-background transition-opacity hover:opacity-90">
                        Contact Support
                    </Link>
                </div>
            </div>
        </aside>
    );
}
