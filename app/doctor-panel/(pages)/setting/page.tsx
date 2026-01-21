"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, User, Globe, Shield } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Preferences</CardTitle>
                            <CardDescription>
                                Manage your basic account settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Globe className="h-4 w-4" />
                                        Language
                                    </div>
                                    <p className="text-sm text-muted-foreground">Select your preferred language for the interface.</p>
                                </div>
                                <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-sm text-sm">
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Marathi</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 font-medium">
                                        <User className="h-4 w-4" />
                                        Timezone
                                    </div>
                                    <p className="text-sm text-muted-foreground">Set your local timezone.</p>
                                </div>
                                <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-sm text-sm">
                                    <option>IST (UTC+05:30)</option>
                                    <option>UTC</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what you want to be notified about.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Bell className="h-4 w-4" />
                                        Appointment Reminders
                                    </div>
                                    <p className="text-sm text-muted-foreground">Receive alerts for upcoming appointments.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <div className="font-medium">New Patient Registrations</div>
                                    <p className="text-sm text-muted-foreground">Get notified when a new patient registers.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Campaign Updates</div>
                                    <p className="text-sm text-muted-foreground">Receive performance reports for your campaigns.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security & Password</CardTitle>
                            <CardDescription>
                                To ensure your account is safe, update your password regularly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type="password" />
                            </div>
                            <div className="pt-2">
                                <Button>Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900/50">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible actions for your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">Deactivate Account</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}