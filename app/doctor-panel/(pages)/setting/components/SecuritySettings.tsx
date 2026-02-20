"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";

export function SecuritySettings() {
    return (
        <div className="space-y-4">
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
        </div>
    );
}
