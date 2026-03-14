"use client"

import * as React from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().refine((val) => /^\d{10}$/.test(val), {
        message: "Mobile number must be exactly 10 digits",
    }),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password must be at most 16 characters")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof RegisterSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function RegisterForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = React.useState(false)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: RegisterFormValues) {
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phone: values.mobile,
                    password: values.password,
                    role: "PATIENT"
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.details && data.details.fieldErrors) {
                    // Map Zod errors to form fields
                    Object.keys(data.details.fieldErrors).forEach((key) => {
                        const message = data.details.fieldErrors[key][0]
                        if (key === "name" || key === "email" || key === "password") {
                            form.setError(key as keyof RegisterFormValues, { message })
                        }
                    })
                } else if (data.error) {
                    toast.error(data.error)
                } else {
                    toast.error("Something went wrong. Please try again.")
                }
                return
            }

            toast.success("Account created successfully!")
            router.push("/login")

        } catch (err) {
            console.error(err)
            toast.error("Failed to create account. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" disabled={isLoading} {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" type="email" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-sm text-muted-foreground border-r border-slate-300 pr-2 h-5 flex items-center">
                                            +91
                                        </span>
                                        <Input 
                                            placeholder="9876543210" 
                                            type="tel"
                                            className="pl-16"
                                            maxLength={10}
                                            disabled={isLoading} 
                                            {...field}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                field.onChange(val);
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isLoading} className="w-full mt-2">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Account
                    </Button>
                </form>
            </Form>
        </div>
    )
}
