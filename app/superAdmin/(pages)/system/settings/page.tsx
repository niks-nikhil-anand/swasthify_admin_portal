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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Bell, Lock, Save, User } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Settings</CardTitle>
                            <CardDescription>
                                Manage your global application preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input id="siteName" defaultValue="Swasthify" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input id="supportEmail" defaultValue="support@swasthify.com" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="maintenance" className="h-4 w-4 rounded border-gray-300" />
                                <Label htmlFor="maintenance">Maintenance Mode</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Account Settings */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>
                                Manage your personal account settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Super Admin" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="admin@swasthify.com" readOnly className="bg-muted" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="role">Role</Label>
                                <div className="flex items-center gap-2 border p-2 rounded-md bg-muted">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Super Administrator</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>
                                <Save className="mr-2 h-4 w-4" /> Update Profile
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>
                                Update your password and security references.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="destructive">
                                <Lock className="mr-2 h-4 w-4" /> Change Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
