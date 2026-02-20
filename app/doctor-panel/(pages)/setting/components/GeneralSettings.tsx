"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, User } from "lucide-react";

export function GeneralSettings() {
    return (
        <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>
                    Manage your basic account settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background border rounded-xl transition-all hover:border-primary/50 group">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-semibold">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Globe className="h-4 w-4 text-primary" />
                            </div>
                            Language
                        </div>
                        <p className="text-sm text-muted-foreground">Select your preferred language for the interface.</p>
                    </div>
                    <select className="h-10 rounded-lg border border-input bg-background px-3 py-1 shadow-sm text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                    </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-background border rounded-xl transition-all hover:border-primary/50 group">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-semibold">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            Timezone
                        </div>
                        <p className="text-sm text-muted-foreground">Set your local timezone.</p>
                    </div>
                    <select className="h-10 rounded-lg border border-input bg-background px-3 py-1 shadow-sm text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                        <option>IST (UTC+05:30)</option>
                        <option>UTC</option>
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}
