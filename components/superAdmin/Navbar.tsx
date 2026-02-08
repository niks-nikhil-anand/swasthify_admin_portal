"use client";

import { useRef, useEffect, useState } from "react";
import { Menu, Bell, Search, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "./Sidebar";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [adminEmail, setAdminEmail] = useState<string>("");
    const [adminName, setAdminName] = useState<string>("Super Admin");

    // Effect to handle mounting state
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);

        const fetchAdminProfile = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.email) {
                        setAdminEmail(data.user.email);
                    }
                    if (data.user?.name) {
                        setAdminName(data.user.name);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch admin profile", error);
            }
        };

        fetchAdminProfile();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="h-16 px-6 border-b bg-card/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
            {/* Mobile Sidebar Trigger */}
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                            <Menu className="h-5 w-5 text-muted-foreground" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r w-72">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <Sidebar className="border-none h-full" />
                    </SheetContent>
                </Sheet>

                {/* Global Search (Optional but good for generic admin layout) */}

            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Theme Toggle */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle Theme</span>
                    </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
                </Button>

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 rounded-full pl-2 pr-4 gap-2 hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all">
                            <Avatar className="h-7 w-7 border border-primary/20">
                                <AvatarImage src="/avatars/01.png" alt={adminName} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {adminName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start gap-0.5">
                                <span className="text-xs font-semibold leading-none">{adminName}</span>
                                <span className="text-[10px] text-muted-foreground leading-none">{adminEmail || "Loading..."}</span>
                            </div>
                            <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{adminName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {adminEmail || "Loading..."}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            onClick={async () => {
                                try {
                                    const res = await fetch("/api/auth/logout", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ role: "SUPER_ADMIN" }),
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
                                }
                            }}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
