"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Loader2,
    Stethoscope,
    Building2,
    User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
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

export default function DoctorRegistrationForm() {
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
        <section id="registration-form" className="w-full">
            <Card className="shadow-2xl border-primary/20 bg-card overflow-hidden w-full">
                <CardHeader className="bg-primary/5 border-b border-primary/10 space-y-4 p-6 md:p-8">
                    <CardTitle className="text-2xl md:text-3xl text-center font-bold text-primary">Doctor Registration Application</CardTitle>
                    <CardDescription className="text-center text-base md:text-lg">
                        Please provide accurate details. Verification documents will be requested in the next step.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-10 lg:p-12">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:space-y-10">

                            {/* Personal Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-3 text-primary border-b pb-2">
                                    <User className="h-6 w-6" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dr. John" className="h-12 text-base" {...field} />
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
                                                <FormLabel className="text-base">Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" className="h-12 text-base" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="doctor@example.com" type="email" className="h-12 text-base" {...field} />
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
                                                <FormLabel className="text-base">Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+91 9876543210" className="h-12 text-base" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-3 text-primary border-b pb-2">
                                    <Stethoscope className="h-6 w-6" /> Professional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <FormField
                                        control={form.control}
                                        name="specialization"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Specialization</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 text-base">
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
                                                <FormLabel className="text-base">Experience (Years)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" placeholder="e.g. 5" className="h-12 text-base" {...field} />
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
                                            <FormLabel className="text-base">Medical License Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MCI/State Council Registration Number" className="h-12 text-base" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Clinic Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-3 text-primary border-b pb-2">
                                    <Building2 className="h-6 w-6" /> Clinic / Hospital (Optional)
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="clinicName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Clinic / Hospital Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Healthy Life Clinic" className="h-12 text-base" {...field} />
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
                                            <FormLabel className="text-base">Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="123, Healthcare Street, Medical City..." className="resize-none min-h-[120px] text-base" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="pt-6">
                                <Button type="submit" className="w-full h-14 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                                <p className="text-center text-sm md:text-base text-muted-foreground mt-6">
                                    By submitting, you agree to our <a href="#" className="underline hover:text-primary font-medium">Terms of Service</a> and <a href="#" className="underline hover:text-primary font-medium">Privacy Policy</a>.
                                </p>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    )
}
