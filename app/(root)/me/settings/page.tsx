"use client";

import { Settings, Bell, Shield, CreditCard, LogOut, ChevronRight, Smartphone, EyeOff, KeyRound, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const settingSections = [
    {
        title: "Account Security",
        description: "Manage your password, login methods, and account security.",
        items: [
            { label: "Change Password", icon: KeyRound, action: "Update" },
            { label: "Two-Factor Authentication", icon: Smartphone, action: "Enable", badge: "Recommended" },
            { label: "Active Sessions", icon: Shield, action: "Manage" },
        ]
    },
    {
        title: "Notifications",
        description: "Configure how you want to receive updates and alerts.",
        items: [
            { label: "Email Notifications", icon: Mail, action: "Configure" },
            { label: "Push Notifications", icon: Bell, action: "Configure" },
        ]
    },
    {
        title: "Privacy",
        description: "Control your data visibility and sharing preferences.",
        items: [
            { label: "Profile Visibility", icon: Lock, action: "Public" },
            { label: "Data Sharing", icon: EyeOff, action: "Manage" },
        ]
    }
];

export default function SettingsPage() {
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
                                {section.items.map((item) => (
                                    <button
                                        key={item.label}
                                        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[15px] font-bold text-foreground">{item.label}</span>
                                                    {item.badge && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter bg-green-100 text-green-600 dark:bg-green-900/30">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-muted-foreground opacity-60 group-hover:text-primary group-hover:opacity-100 transition-all uppercase tracking-widest">{item.action}</span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ))}
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
        </div>
    );
}
