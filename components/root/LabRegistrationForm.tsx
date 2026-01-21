"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Loader2,
    FlaskConical,
    Building2,
    MapPin,
    Check,
    Globe,
    FileText,
    Mail,
    Phone,
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
import { LabValidation } from "@/lib/validators"
import { motion, AnimatePresence } from "framer-motion"

type LabFormValues = z.infer<typeof LabValidation>
type FieldName = keyof LabFormValues

export default function LabRegistrationForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [direction, setDirection] = useState(0)

    const form = useForm<LabFormValues>({
        resolver: zodResolver(LabValidation) as any,
        defaultValues: {
            labName: "",
            email: "",
            phone: "",
            licenseNumber: "",
            website: "",
            description: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
        } as LabFormValues,
    })

    const steps = [
        {
            id: 1,
            title: "Basic Info",
            fields: ["labName", "email", "phone"] as FieldName[]
        },
        {
            id: 2,
            title: "Professional",
            fields: ["licenseNumber", "website", "description"] as FieldName[]
        },
        {
            id: 3,
            title: "Address",
            fields: ["street", "city", "state", "zipCode", "country"] as FieldName[]
        }
    ]

    const nextStep = async (e?: React.MouseEvent) => {
        e?.preventDefault()
        const fields = steps[currentStep - 1].fields
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

    async function onSubmit(values: z.infer<typeof LabValidation>) {
        setIsLoading(true)

        try {
            // Note: Assuming /api/user/lab exists or using a placeholder
            // If it doesn't exist, this might fail 404, but UI behavior is what we are building.
            const response = await fetch("/api/user/lab", { // Target endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error && Array.isArray(data.error)) {
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
                        <CardTitle className="text-2xl md:text-3xl font-bold text-primary">Lab Partner Registration</CardTitle>
                        <CardDescription className="text-base">
                            Join our network of certified labs. Step {currentStep} of {steps.length}
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
                                                    <FlaskConical className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="labName"
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Lab Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Swasthify Diagnostics" className="h-11" {...field} />
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
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                                    <Input placeholder="lab@example.com" type="email" className="pl-10 h-11" {...field} value={field.value ?? ""} />
                                                                </div>
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
                                                    <Building2 className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground">Professional Details</h3>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="licenseNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>License / Registration Number (Optional)</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="LAB-REG-12345" className="h-11" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="website"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Website (Optional)</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                                    <Input placeholder="https://www.example.com" className="pl-10 h-11" {...field} value={field.value ?? ""} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>About Layout (Optional)</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                                    <Textarea
                                                                        placeholder="Brief description of your lab, services offered, equipment, etc."
                                                                        className="min-h-[100px] pl-10 pt-3"
                                                                        {...field}
                                                                        value={field.value ?? ""}
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

                                    {currentStep === 3 && (
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
                                                                <Input placeholder="123, Lab Street, Medical Park" className="h-11" {...field} value={field.value ?? ""} />
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
                                                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                                                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                                                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                                                                    <SelectItem value="West Bengal">West Bengal</SelectItem>
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

                                {currentStep < 3 ? (
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
