"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, User, Globe, Shield, ImagePlus, Camera, Building2, CreditCard, Landmark, UserCircle, BadgeCheck, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8  mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                    Settings
                </h1>
                <p className="text-muted-foreground text-lg">Manage your professional account, preferences, and payment details.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="general" className="px-6">General</TabsTrigger>
                    <TabsTrigger value="professional" className="px-6">Professional</TabsTrigger>
                    <TabsTrigger value="payments" className="px-6">Payments</TabsTrigger>
                    <TabsTrigger value="notifications" className="px-6">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="px-6">Security</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
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
                </TabsContent>

                {/* Professional Settings */}
                <TabsContent value="professional" className="space-y-4">
                    <Card className="border-none shadow-sm bg-muted/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5 text-primary" />
                                Hospital & Clinic Pictures
                            </CardTitle>
                            <CardDescription>
                                Upload high-quality images of your professional practice areas to build trust with patients.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3 text-muted-foreground hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group scale-100 hover:scale-[1.02] active:scale-[0.98]">
                                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        <ImagePlus className="h-8 w-8" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm font-bold block text-foreground">Add Clinic Photo</span>
                                        <span className="text-xs">JPG, PNG up to 5MB</span>
                                    </div>
                                </div>

                                <div className="aspect-video border rounded-2xl bg-background relative group overflow-hidden shadow-sm">
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                                        <span className="text-white text-xs font-medium">Entrance.jpg</span>
                                        <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-center h-full bg-accent/20">
                                        <Camera className="h-12 w-12 text-muted-foreground/20" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="px-8 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-primary/80 hover:to-primary">
                                    <Save className="mr-2 h-4 w-4" /> Save Gallery
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payments Settings */}
                <TabsContent value="payments" className="space-y-4">
                    <Card className="border-none shadow-sm bg-muted/30 overflow-hidden">
                        <div className="h-2 bg-linear-to-r from-primary to-blue-400" />
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Landmark className="h-5 w-5 text-primary" />
                                    Bank Account Details
                                </CardTitle>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold border border-green-500/20">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Secure Connection
                                </div>
                            </div>
                            <CardDescription>
                                Securely manage your bank information for direct appointment payouts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName" className="flex items-center gap-2 text-foreground/80">
                                        <Building2 className="h-3.5 w-3.5" /> Bank Name
                                    </Label>
                                    <Input id="bankName" placeholder="e.g. HDFC Bank" className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountHolder" className="flex items-center gap-2 text-foreground/80">
                                        <UserCircle className="h-3.5 w-3.5" /> Account Holder Name
                                    </Label>
                                    <Input id="accountHolder" placeholder="Enter name as per records" className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber" className="flex items-center gap-2 text-foreground/80">
                                        <CreditCard className="h-3.5 w-3.5" /> Account Number
                                    </Label>
                                    <Input id="accountNumber" placeholder="XXXX XXXX XXXX XXXX" className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifsc" className="flex items-center gap-2 text-foreground/80">
                                        <BadgeCheck className="h-3.5 w-3.5" /> IFSC Code
                                    </Label>
                                    <Input id="ifsc" placeholder="e.g. HDFC0001234" className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all uppercase" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button className="px-8 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-primary/80 hover:to-primary">
                                    Save Payment Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-4">
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
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card className="border-none shadow-sm bg-muted/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Security & Password
                            </CardTitle>
                            <CardDescription>
                                To ensure your account is safe, update your password regularly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" className="rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" className="rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type="password" className="rounded-xl h-11" />
                            </div>
                            <div className="pt-2">
                                <Button className="w-full md:w-auto px-8">Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200/50 dark:border-red-900/30 bg-red-500/5 shadow-none ring-1 ring-red-500/10">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible actions for your account. Please be careful.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="rounded-xl px-8 shadow-lg shadow-red-500/10 hover:bg-red-600">
                                Deactivate Account
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}