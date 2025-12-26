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
    X,
    Check,
    MapPin,
    GraduationCap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
import { DoctorValidation } from "@/lib/validators"

const SPECIALIZATIONS = [
    { id: "general_physician", label: "General Physician" },
    { id: "cardiologist", label: "Cardiologist" },
    { id: "dermatologist", label: "Dermatologist" },
    { id: "pediatrician", label: "Pediatrician" },
    { id: "neurologist", label: "Neurologist" },
    { id: "orthopedist", label: "Orthopedist" },
    { id: "gynecologist", label: "Gynecologist" },
    { id: "dentist", label: "Dentist" },
    { id: "ent", label: "ENT Specialist" },
    { id: "psychiatrist", label: "Psychiatrist" },
]



export default function DoctorRegistrationForm() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(DoctorValidation),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            specialization: [],
            qualification: "",
            licenseNumber: "",
            experience: "",
            clinicName: "",
            hospitalName: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
            bio: "",
        },
    })

    const toggleSpecialization = (id: string, currentValues: string[], onChange: (value: string[]) => void) => {
        const newValues = currentValues.includes(id)
            ? currentValues.filter(v => v !== id)
            : [...currentValues, id]
        onChange(newValues)
    }

    async function onSubmit(values: z.infer<typeof DoctorValidation>) {
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
            <Card className="border-primary/20 bg-card overflow-hidden w-full">
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
                                                    <Input placeholder="doctor@example.com" type="email" className="h-12 text-base" {...field} value={field.value ?? ""} />
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
                                                    <Input placeholder="+91 9876543210" className="h-12 text-base" {...field} value={field.value ?? ""} />
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
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel className="text-base">Specializations</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {SPECIALIZATIONS.map((spec) => {
                                                                const isSelected = field.value?.includes(spec.id)
                                                                return (
                                                                    <Badge
                                                                        key={spec.id}
                                                                        variant={isSelected ? "default" : "outline"}
                                                                        className={`cursor-pointer text-sm py-2 px-4 rounded-full transition-all ${isSelected ? "hover:bg-primary/90" : "hover:bg-primary/10"}`}
                                                                        onClick={() => toggleSpecialization(spec.id, field.value || [], field.onChange)}
                                                                    >
                                                                        {isSelected && <Check className="w-3 h-3 mr-2" />}
                                                                        {spec.label}
                                                                    </Badge>
                                                                )
                                                            })}
                                                        </div>
                                                        <FormMessage />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="qualification"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Qualification</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                        <Input placeholder="MBBS, MD, etc." className="pl-10 h-12 text-base" {...field} value={field.value ?? ""} />
                                                    </div>
                                                </FormControl>
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
                                                    <Input type="number" min="0" placeholder="e.g. 5" className="h-12 text-base" {...field} value={field.value ?? ""} />
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
                                                <Input placeholder="MCI/State Council Registration Number" className="h-12 text-base" {...field} value={field.value ?? ""} />
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <FormField
                                        control={form.control}
                                        name="clinicName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Clinic Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Healthy Life Clinic" className="h-12 text-base" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hospitalName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Hospital Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City General Hospital" className="h-12 text-base" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-3 text-primary border-b pb-2">
                                    <MapPin className="h-6 w-6" /> Address Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <FormField
                                        control={form.control}
                                        name="street"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel className="text-base">Street Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123, Healthcare Street" className="h-12 text-base" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City" className="h-12 text-base" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">State</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 text-base">
                                                            <SelectValue placeholder="Select State" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Bihar">Bihar</SelectItem>
                                                        <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="zipCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Zip Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="800001" className="h-12 text-base" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Country</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="India" disabled className="h-12 text-base bg-muted" {...field} value={field.value ?? "India"} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
