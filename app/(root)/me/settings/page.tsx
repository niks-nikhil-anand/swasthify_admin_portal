"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Mail, Lock, KeyRound, Smartphone, Shield, AtSign, Phone, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { UpdateEmailModal } from "@/components/settings/UpdateEmailModal";
import { UpdatePhoneModal } from "@/components/settings/UpdatePhoneModal";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

    useEffect(() => {
        fetchUser();
    }, []);

    const settingSections = [
        {
            title: "Account Security",
            description: "Manage your password, login methods, and account security.",
            items: [
                {
                    label: "Change Password",
                    icon: KeyRound,
                    action: "Update",
                    type: "link",
                    onClick: () => setIsPasswordModalOpen(true)
                },
                {
                    label: "Change Email",
                    icon: AtSign,
                    action: "Update",
                    type: "link",
                    onClick: () => setIsEmailModalOpen(true)
                },
                {
                    label: user?.phone ? "Change Mobile Number" : "Add Mobile Number",
                    icon: Phone,
                    action: user?.phone ? "Update" : "Add",
                    type: "link",
                    onClick: () => setIsPhoneModalOpen(true)
                },
                { label: "Active Sessions", icon: Shield, action: "Manage", type: "link" },
            ]
        },
        {
            title: "Notifications",
            description: "Configure how you want to receive updates and alerts.",
            items: [
                { label: "Email Notifications", icon: Mail, action: "Toggle", type: "toggle" },
            ]
        },
        {
            title: "Privacy",
            description: "Control your data visibility and sharing preferences.",
            items: [
                { label: "Medical Docs Privacy", icon: Lock, action: "Toggle", type: "toggle" },
            ]
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account preferences and security settings.</p>
            </div>

            <div className="space-y-8">
                {settingSections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <div className="px-2">
                            <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>

                        <div className="bg-background border border-border/50 rounded-3xl overflow-hidden shadow-sm shadow-black/5">
                            <div className="divide-y divide-border/40">
                                {section.items.map((item) => {
                                    const Component = item.type === "toggle" ? "div" : "button";
                                    return (
                                        <Component
                                            key={item.label}
                                            onClick={item.onClick}
                                            className={cn(
                                                "w-full flex items-center justify-between p-5 transition-all group text-left",
                                                item.type !== "toggle" && "hover:bg-muted/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[15px] font-bold text-foreground">{item.label}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {item.type === "link" && (
                                                    <>
                                                        <span className="text-xs font-bold text-muted-foreground opacity-60 group-hover:text-primary group-hover:opacity-100 transition-all uppercase tracking-widest">{item.action}</span>
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                                {item.type === "toggle" && (
                                                    <Switch onClick={(e) => e.stopPropagation()} />
                                                )}
                                            </div>
                                        </Component>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-border/50">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-bold text-red-600">Delete Account</h3>
                        <p className="text-sm text-red-600/70 leading-relaxed mt-1">
                            Once you delete your account, all your medical history and test reports will be permanently removed. This action cannot be undone.
                        </p>
                    </div>
                    <button className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                        Deactivate Account
                    </button>
                </div>
            </div>

            {/* Modals */}
            <UpdateEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                currentEmail={user?.email}
                onSuccess={fetchUser}
            />
            <UpdatePhoneModal
                isOpen={isPhoneModalOpen}
                onClose={() => setIsPhoneModalOpen(false)}
                currentPhone={user?.phone}
                onSuccess={fetchUser}
            />
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}
