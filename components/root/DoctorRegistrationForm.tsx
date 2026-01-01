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


type DoctorFormValues = z.infer<typeof DoctorValidation>
type FieldName = keyof DoctorFormValues

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
    { id: "ophthalmologist", label: "Ophthalmologist" },
    { id: "urologist", label: "Urologist" },
]



import { motion, AnimatePresence } from "framer-motion"

export default function DoctorRegistrationForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [direction, setDirection] = useState(0)

    const form = useForm<DoctorFormValues>({
        resolver: zodResolver(DoctorValidation) as any,
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
        } as DoctorFormValues,
    })


    const toggleSpecialization = (id: string, currentValues: string[], onChange: (value: string[]) => void) => {
        const newValues = currentValues.includes(id)
            ? currentValues.filter(v => v !== id)
            : [...currentValues, id]
        onChange(newValues)
    }


    const steps = [
        {
            id: 1,
            title: "Personal",
            fields: ["firstName", "lastName", "email", "phone"] as FieldName[]
        },
        {
            id: 2,
            title: "Professional",
            fields: ["specialization", "qualification", "experience", "licenseNumber"] as FieldName[]
        },
        {
            id: 3,
            title: "Clinic",
            fields: ["clinicName", "hospitalName"] as FieldName[]
        },
        {
            id: 4,
            title: "Address",
            fields: ["street", "city", "state", "zipCode", "country"] as FieldName[]
        }
    ]

    const nextStep = async (e?: React.MouseEvent) => {
        e?.preventDefault()
        const fields = steps[currentStep - 1].fields
        console.log("Validating fields:", fields)
        const output = await form.trigger(fields, { shouldFocus: true })

        if (!output) return

        if (currentStep < steps.length) {
            setDirection(1)
            setCurrentStep(step => step + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setDirection(-1)
            setCurrentStep(step => step - 1)
        }
    }

    async function onSubmit(values: z.infer<typeof DoctorValidation>) {
        setIsLoading(true)

        try {
            const response = await fetch("/api/user/doctor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error && Array.isArray(data.error)) {
                    // Handle Zod errors (simplified)
                    data.error.forEach((err: any) => {
                        toast.error(err.message || "Invalid input")
                    })
                } else {
                    toast.error(data.error || "Something went wrong")
                }
                return
            }

            toast.success("Application Submitted", {
                description: "We have received your application. Our team will verify your details and get back to you shortly.",
            })
            console.log(values)
            form.reset()
            setCurrentStep(1)

        } catch (error) {
            console.error("Submission error", error)
            toast.error("Failed to submit application. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    }

    return (
        <section id="registration-form" className="w-full max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-card overflow-hidden w-full shadow-xl">
                <CardHeader className="bg-primary/5 border-b border-primary/10 space-y-6 p-6 md:p-8">
                    <div className="space-y-2 text-center">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-primary">Doctor Registration</CardTitle>
                        <CardDescription className="text-base">
                            Join our network of healthcare professionals. Step {currentStep} of {steps.length}
                        </CardDescription>
                    </div>

                    {/* Stepper */}
                    <div className="relative flex justify-between items-center px-2 md:px-8 mt-4">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out -z-0"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>
                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background ${step.id <= currentStep
                                        ? "border-primary text-primary font-bold shadow-lg scale-110"
                                        : "border-muted text-muted-foreground"
                                        }`}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <span className={`text-xs md:text-sm font-medium hidden md:block transition-colors ${step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="p-6 md:p-10">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                }
                            }}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    custom={direction}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="min-h-[400px]"
                                >
                                    {currentStep === 1 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b pb-2 mb-6">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Dr. John" className="h-11" {...field} />
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
                                                                <Input placeholder="Doe" className="h-11" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="doctor@example.com" type="email" className="h-11" {...field} value={field.value ?? ""} />
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
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 bg-muted border border-r-0 border-input rounded-l-md h-11 px-3 flex items-center text-muted-foreground">
                                                                        +91
                                                                    </div>
                                                                    <Input
                                                                        placeholder="9876543210"
                                                                        className="h-11 rounded-l-none"
                                                                        {...field}
                                                                        value={field.value ?? ""}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                                                                            field.onChange(value)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b pb-2 mb-6">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Stethoscope className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground">Professional Details</h3>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="specialization"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Specializations</FormLabel>
                                                        <FormControl>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {SPECIALIZATIONS.map((spec) => {
                                                                    const isSelected = field.value?.includes(spec.id)
                                                                    return (
                                                                        <Badge
                                                                            key={spec.id}
                                                                            variant={isSelected ? "default" : "outline"}
                                                                            className={`cursor-pointer py-2 px-4 rounded-full transition-all ${isSelected ? "shadow-md scale-105" : "hover:bg-accent"
                                                                                }`}
                                                                            onClick={() => toggleSpecialization(spec.id, field.value || [], field.onChange)}
                                                                        >
                                                                            {isSelected && <Check className="w-3 h-3 mr-2" />}
                                                                            {spec.label}
                                                                        </Badge>
                                                                    )
                                                                })}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="qualification"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Qualification</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                                    <Input placeholder="MBBS, MD, etc." className="pl-10 h-11" {...field} value={field.value ?? ""} />
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
                                                            <FormLabel>Experience (Years)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min="0" placeholder="e.g. 5" className="h-11" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="licenseNumber"
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Medical License Number (Optional)</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="MCI/State Council Registration Number" className="h-11" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b pb-2 mb-6">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Building2 className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground">Clinic / Hospital Info</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="clinicName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Clinic Name (Optional)</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Healthy Life Clinic" className="h-11" {...field} value={field.value ?? ""} />
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
                                                            <FormLabel>Hospital Name (Optional)</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="City General Hospital" className="h-11" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b pb-2 mb-6">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <MapPin className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground">Address Details</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="street"
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Street Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="123, Healthcare Street" className="h-11" {...field} value={field.value ?? ""} />
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
                                                            <FormLabel>City</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="City" className="h-11" {...field} value={field.value ?? ""} />
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
                                                            <FormLabel>State</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11">
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
                                                            <FormLabel>Zip Code</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="800001" className="h-11" {...field} value={field.value ?? ""} />
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
                                                            <FormLabel>Country</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="India" disabled className="h-11 bg-muted" {...field} value={field.value ?? "India"} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between pt-6 border-t mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1 || isLoading}
                                    className={`w-[120px] ${currentStep === 1 ? "invisible" : ""}`}
                                >
                                    Back
                                </Button>

                                {currentStep < 4 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-[120px]"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="w-[150px]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                                            </>
                                        ) : (
                                            "Submit App"
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    )
}
