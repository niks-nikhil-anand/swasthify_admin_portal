"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Bell,
    CreditCard,
    Database,
    Globe,
    Lock,
    Palette,
    Save,
    Shield,
    Smartphone,
    User
} from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">Manage platform configurations and preferences.</p>
                </div>
                <Button>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="backups">Backups</TabsTrigger>
                </TabsList>

                {/* 1. General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                General Configuration
                            </CardTitle>
                            <CardDescription>
                                Basic details and localization settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input id="siteName" defaultValue="Swasthify" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input id="supportEmail" defaultValue="support@swasthify.in" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select defaultValue="ist">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                            <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                                            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Default Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="hi">Hindi</SelectItem>
                                            <SelectItem value="bn">Bengali</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Branding & Appearance */}
                <TabsContent value="branding" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of the admin portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode Default</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable dark mode for new users by default.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600 cursor-pointer" />
                                    <div className="h-8 w-8 rounded-full bg-green-600 cursor-pointer" />
                                    <div className="h-8 w-8 rounded-full bg-purple-600 cursor-pointer" />
                                    <div className="h-8 w-8 rounded-full bg-orange-600 cursor-pointer" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Logo Upload</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                    <p>Drag and drop logo here</p>
                                    <p className="text-xs mt-1">PNG, JPG up to 2MB</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Notifications */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Channels
                            </CardTitle>
                            <CardDescription>
                                Configure how the system sends alerts used.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Receive system emails</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label>SMS Gateway API Key</Label>
                                <Input type="password" placeholder="Enter API Key from provider" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Send browser notifications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. Security */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security & Access
                            </CardTitle>
                            <CardDescription>
                                Manage authentication and session policies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enforce 2FA</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require Two-Factor Authentication for all admins.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeout">Session Timeout (Minutes)</Label>
                                <Input id="timeout" type="number" defaultValue="30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                                <Input id="ip-whitelist" placeholder="192.168.1.1, 10.0.0.1" />
                                <p className="text-xs text-muted-foreground">Comma separated list of allowed IPs.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 5. Payments */}
                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Gateway
                            </CardTitle>
                            <CardDescription>
                                Configure transaction settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Default Currency</Label>
                                    <Select defaultValue="inr">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                                            <SelectItem value="usd">US Dollar (USD)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gateway Provider</Label>
                                    <Select defaultValue="razorpay">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="razorpay">Razorpay</SelectItem>
                                            <SelectItem value="stripe">Stripe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input type="number" defaultValue="18" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 6. Backups */}
                <TabsContent value="backups" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Data Management
                            </CardTitle>
                            <CardDescription>
                                Backup and maintenance controls.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Automatic Backups</Label>
                                    <p className="text-sm text-muted-foreground">Daily database snapshots</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label>Retention Period</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 Days</SelectItem>
                                        <SelectItem value="30">30 Days</SelectItem>
                                        <SelectItem value="90">90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/10">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-red-600">Maintenance Mode</Label>
                                    <p className="text-sm text-red-600/80">
                                        Take the site offline for users.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
