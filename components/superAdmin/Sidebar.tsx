"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    Activity,
    FileText,
    LifeBuoy,
    ChevronRight,
    Stethoscope,
    User,
    TestTube,
    Calendar,
    Ticket,
    MessageSquareWarning,
    BarChart,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarGroups = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/superAdmin/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Analytics",
                href: "/superAdmin/analytics",
                icon: BarChart,
            },
        ]
    },
    {
        label: "User Management",
        items: [
            {
                title: "Doctors",
                href: "/superAdmin/doctors",
                icon: Stethoscope,
            },
            {
                title: "Patients",
                href: "/superAdmin/patients",
                icon: User,
            },
            {
                title: "Labs",
                href: "/superAdmin/labs",
                icon: TestTube,
            },
            {
                title: "All Users",
                href: "/superAdmin/users",
                icon: Users,
            },
        ]
    },
    {
        label: "Operations",
        items: [
            {
                title: "Appointments",
                href: "/superAdmin/appointments",
                icon: Calendar,
            },
            {
                title: "Tickets",
                href: "/superAdmin/tickets",
                icon: Ticket,
            },
            {
                title: "Complaints",
                href: "/superAdmin/complaints",
                icon: MessageSquareWarning,
            },
        ]
    },
    {
        label: "System",
        items: [
            {
                title: "Reports",
                href: "/superAdmin/reports",
                icon: FileText,
            },
            {
                title: "Push Notifications",
                href: "/superAdmin/notifications",
                icon: Bell,
            },
            {
                title: "Settings",
                href: "/superAdmin/settings",
                icon: Settings,
            },
        ]
    }
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col h-screen border-r bg-card/50 backdrop-blur-xl", className)}>
            {/* Logo Section */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="bg-muted p-2.5 rounded-xl shadow-sm border border-border group-hover:scale-105 transition-transform duration-300">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Swasthify
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            Super Admin
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-6">
                    {sidebarGroups.map((group, index) => (
                        <div key={index} className="px-2">
                            <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 select-none">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Button
                                            key={link.href}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start gap-3 h-10 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                            )}
                                            asChild
                                        >
                                            <Link href={link.href}>
                                                <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary-foreground")} />
                                                <span className="flex-1 truncate">{link.title}</span>
                                                {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                                                {/* Active Indicator Glow */}
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                                                )}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Bottom Section */}
            <div className="p-4 mt-auto border-t bg-gradient-to-b from-transparent to-muted/20">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 rounded-xl border border-primary/10 mb-2 relative overflow-hidden group">
                    {/* Decorative circle */}
                    <div className="absolute -right-4 -top-4 h-16 w-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />

                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-background rounded-lg shadow-sm">
                            <LifeBuoy className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-primary text-sm">Support</h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                        Need help with the dashboard?
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8 bg-background/50 hover:bg-background border-primary/20 text-primary hover:text-primary transition-all">
                        Contact Tech Team
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-10 mt-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                </Button>
            </div>
        </div>
    );
}
