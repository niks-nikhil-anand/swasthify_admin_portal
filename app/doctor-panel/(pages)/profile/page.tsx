"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, MapPin, Phone, User, Stethoscope } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and clinic details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Profile Sidebar */}
                <Card className="md:col-span-4 lg:col-span-3 h-fit">
                    <CardContent className="pt-6 text-center">
                        <div className="relative mx-auto w-32 h-32 mb-4 group cursor-pointer">
                            <Avatar className="w-full h-full border-4 border-background shadow-xl">
                                <AvatarImage src="/avatars/doctor-profile.png" alt="Doctor" />
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary">NA</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">Dr. Nikhil Anand</h2>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                            <Stethoscope className="h-3.5 w-3.5" />
                            Cardiologist
                        </p>

                        <div className="mt-6 flex flex-col gap-2">
                            <Button className="w-full">Edit Profile</Button>
                            <Button variant="outline" className="w-full">Share Profile</Button>
                        </div>

                        <div className="mt-6 text-left space-y-4 text-sm">
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">dr.nikhil@swasthify.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>Mumbai, Maharashtra</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details Form */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details and contact information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Nikhil" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="Anand" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="dr.nikhil@swasthify.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Professional Bio</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[100px]"
                                    defaultValue="Experienced Cardiologist with over 10 years of practice. Dedicated to providing comprehensive heart care and promoting cardiovascular health."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Clinic Details</CardTitle>
                            <CardDescription>
                                Information about your primary clinic location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="clinicName">Clinic Name</Label>
                                <Input id="clinicName" defaultValue="Swasthify Heart Center" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" defaultValue="123, Health Avenue, Bandra West" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" defaultValue="Mumbai" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Pincode</Label>
                                    <Input id="zip" defaultValue="400050" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}