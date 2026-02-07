"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Calendar, Settings, ChevronDown, FileText, ClipboardList } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            // Attempt to notify server about logout
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: user?.role })
            });

            // Regardless of response, clear local state and redirect
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
            // Even on error, we should probably clear local state to avoid being "stuck"
            setUser(null);
            router.push("/login");
            router.refresh();
            toast.success("Logged out");
        }
    };

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about-us" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
        { name: "Lab Tests", href: "/lab-test" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="Swasthify Logo" width={50} height={50} className="h-10 w-10 object-contain" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Swasthify
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${isActive(item.href)
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground hover:text-primary"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        <ModeToggle />
                        {!isLoading && (
                            user && user.role === "PATIENT" ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border/50 rounded-full hover:bg-muted/50 transition-all">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <span>Hello, {user.name.split(' ')[0]}</span>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 overflow-hidden p-0">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="p-1"
                                        >
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <Link href="/me">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/me/appointments">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    <span>Appointments</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/me/reports">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    <span>Lab Reports</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/me/health-records">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <ClipboardList className="mr-2 h-4 w-4" />
                                                    <span>Health Records</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator />
                                            <Link href="/me/settings">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Settings</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </motion.div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href={"/login"}>
                                    <button className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20">
                                        Log in
                                    </button>
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="sr-only">Open menu</span>
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer (Left Side) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background/95 backdrop-blur-xl border-r shadow-2xl p-6 md:hidden flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                                    <Image src="/logo.png" alt="Swasthify Logo" width={40} height={40} className="h-10 w-10 object-contain" />
                                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        Swasthify
                                    </span>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <ModeToggle />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/20"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 text-base font-medium rounded-xl transition-colors ${isActive(item.href)
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                {!isLoading && (
                                    user && user.role === "PATIENT" ? (
                                        <>
                                            <div className="px-4 py-3 flex items-center gap-3 bg-muted/30 rounded-xl">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                            <Link href="/me" onClick={() => setIsOpen(false)}>
                                                <button className="w-full px-4 py-3 text-base font-medium text-foreground flex items-center gap-3 hover:bg-muted/50 rounded-xl transition-colors">
                                                    <User className="h-5 w-5 text-muted-foreground" /> Profile
                                                </button>
                                            </Link>
                                            <Link href="/me/appointments" onClick={() => setIsOpen(false)}>
                                                <button className="w-full px-4 py-3 text-base font-medium text-foreground flex items-center gap-3 hover:bg-muted/50 rounded-xl transition-colors">
                                                    <Calendar className="h-5 w-5 text-muted-foreground" /> Appointments
                                                </button>
                                            </Link>
                                            <Link href="/me/reports" onClick={() => setIsOpen(false)}>
                                                <button className="w-full px-4 py-3 text-base font-medium text-foreground flex items-center gap-3 hover:bg-muted/50 rounded-xl transition-colors">
                                                    <FileText className="h-5 w-5 text-muted-foreground" /> Lab Reports
                                                </button>
                                            </Link>
                                            <Link href="/me/health-records" onClick={() => setIsOpen(false)}>
                                                <button className="w-full px-4 py-3 text-base font-medium text-foreground flex items-center gap-3 hover:bg-muted/50 rounded-xl transition-colors">
                                                    <ClipboardList className="h-5 w-5 text-muted-foreground" /> Health Records
                                                </button>
                                            </Link>
                                            <Link href="/me/settings" onClick={() => setIsOpen(false)}>
                                                <button className="w-full px-4 py-3 text-base font-medium text-foreground flex items-center gap-3 hover:bg-muted/50 rounded-xl transition-colors">
                                                    <Settings className="h-5 w-5 text-muted-foreground" /> Settings
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                                className="w-full px-4 py-3 text-base font-medium text-red-600 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                            >
                                                <LogOut className="h-5 w-5" /> Log out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <button className="w-full px-4 py-3 text-base font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                                                    Log in
                                                </button>
                                            </Link>
                                            <button className="w-full px-4 py-3 text-base font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                                Get Started
                                            </button>
                                        </>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
