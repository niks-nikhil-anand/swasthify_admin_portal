"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { User, Calendar, FileText, ClipboardList, Settings, CreditCard, Bell, Shield, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
    { label: "Profile", href: "/me", icon: User },
    { label: "Appointments", href: "/me/appointments", icon: Calendar },
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
        <aside className="w-full lg:w-64 flex flex-col gap-2">
            <div className="bg-background border border-border/50 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
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
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-4 border-t border-border/40 pt-4"
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
            <div className="bg-muted/20 border border-border/50 rounded-2xl p-6 mt-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 opacity-50">Need Help?</h4>
                <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Our health experts are available 24/7 to assist you with any queries.
                    </p>
                    <button className="w-full py-2.5 px-4 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
                        Contact Support
                    </button>
                </div>
            </div>
        </aside>
    );
}
