"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

export function NotificationSettings() {
    return (
        <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Choose what you want to be notified about.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary/30 transition-all">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-semibold">
                            <Bell className="h-4 w-4 text-primary" />
                            Appointment Reminders
                        </div>
                        <p className="text-sm text-muted-foreground">Receive alerts for upcoming appointments.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary/30 transition-all">
                    <div className="space-y-0.5">
                        <div className="font-semibold">New Patient Registrations</div>
                        <p className="text-sm text-muted-foreground">Get notified when a new patient registers.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary/30 transition-all">
                    <div className="space-y-0.5">
                        <div className="font-semibold">Campaign Updates</div>
                        <p className="text-sm text-muted-foreground">Receive performance reports for your campaigns.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
    );
}
