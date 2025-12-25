"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Stethoscope, Building2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const doctorSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    specialization: z.string().min(1, "Please select a specialization"),
    licenseNumber: z.string().min(5, "License number is required"),
    experience: z.string().min(1, "Please enter years of experience"),
    clinicName: z.string().optional(),
    clinicAddress: z.string().optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
})

export default function DoctorProfilePage() {

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof doctorSchema>>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            specialization: "",
            licenseNumber: "",
            experience: "",
            clinicName: "",
            clinicAddress: "",
            bio: "",
        },
    })

    async function onSubmit(values: z.infer<typeof doctorSchema>) {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Application Submitted", {
                description: "We have received your application. Our team will verify your details and get back to you shortly.",
            })
            console.log(values)
            form.reset()
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Hero Section */}
            <div className="bg-primary text-primary-foreground py-20 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Swasthify as a Doctor</h1>
                    <p className="text-xl opacity-90 mb-8">
                        Expand your practice, manage appointments efficiently, and connect with thousands of patients looking for quality healthcare.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Benefits Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Why Join Us?</CardTitle>
                                <CardDescription>Benefits of partnering with Swasthify</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Expand Your Reach</h4>
                                        <p className="text-sm text-muted-foreground">Connect with patients across the region who need your expertise.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Digital Clinic</h4>
                                        <p className="text-sm text-muted-foreground">Manage appointments, prescriptions, and records digitally.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Stethoscope className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Flexible Schedule</h4>
                                        <p className="text-sm text-muted-foreground">Set your own availability and consultation fees.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Onboarding Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-t-4 border-t-primary shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Doctor Registration</CardTitle>
                                <CardDescription>
                                    Fill in your details to get started. Verification documents will be requested in the next step.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                        {/* Personal Details */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <User className="h-4 w-4" /> Personal Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Dr. John" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Doe" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="doctor@example.com" type="email" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+91 9876543210" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="h-px bg-border" />

                                        {/* Professional Details */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4" /> Professional Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="specialization"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Specialization</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Specialization" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="general_physician">General Physician</SelectItem>
                                                                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                                                                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
                                                                    <SelectItem value="pediatrician">Pediatrician</SelectItem>
                                                                    <SelectItem value="neurologist">Neurologist</SelectItem>
                                                                    <SelectItem value="orthopedist">Orthopedist</SelectItem>
                                                                    <SelectItem value="gynecologist">Gynecologist</SelectItem>
                                                                    <SelectItem value="other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="experience"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Experience (Years)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min="0" placeholder="e.g. 5" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="licenseNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Medical License Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="MCI/State Council Registration Number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="h-px bg-border" />

                                        {/* Clinic Details */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Building2 className="h-4 w-4" /> Clinic / Hospital (Optional)
                                            </h3>
                                            <FormField
                                                control={form.control}
                                                name="clinicName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Clinic / Hospital Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Healthy Life Clinic" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="clinicAddress"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="123, Healthcare Street, Medical City..." className="resize-none" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full md:w-auto" disabled={isLoading} size="lg">
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                                    </>
                                                ) : (
                                                    "Submit Application"
                                                )}
                                            </Button>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                By submitting, you agree to our Terms of Service and Privacy Policy.
                                            </p>
                                        </div>

                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
