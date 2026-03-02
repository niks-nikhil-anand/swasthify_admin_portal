"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const specializationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    image: z.string().optional(),
    type: z.enum(["DOCTOR", "LAB", "ALL"]),
})

type SpecializationFormValues = z.infer<typeof specializationSchema>

interface AddSpecializationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    initialData?: {
        id?: string
        name: string
        description?: string | null
        image?: string | null
        type?: string
    }
}

export function AddSpecializationModal({
    isOpen,
    onClose,
    onSuccess,
    initialData
}: AddSpecializationModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SpecializationFormValues>({
        resolver: zodResolver(specializationSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            image: initialData?.image || "",
            type: (initialData?.type as any) || "DOCTOR",
        },
    })

    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: initialData?.name || "",
                description: initialData?.description || "",
                image: initialData?.image || "",
                type: (initialData?.type as any) || "DOCTOR",
            })
        }
    }, [initialData, isOpen, form])

    const onSubmit = async (values: SpecializationFormValues) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("type", values.type)
            if (values.description) formData.append("description", values.description)

            // Handle image file
            const fileInput = document.getElementById('image-upload') as HTMLInputElement
            if (fileInput?.files?.[0]) {
                formData.append("image", fileInput.files[0])
            }

            const url = initialData?.id
                ? `/api/admin/specializations/${initialData.id}`
                : "/api/admin/specializations"

            const method = initialData?.id ? "PATCH" : "POST"

            const response = await fetch(url, {
                method,
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            toast.success(initialData?.id ? "Specialization updated" : "Specialization added")
            form.reset()
            if (fileInput) fileInput.value = ""
            onSuccess()
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData?.id ? "Edit Specialization" : "Add Specialization"}</DialogTitle>
                    <DialogDescription>
                        {initialData?.id
                            ? "Update the specialization details below."
                            : "Enter the details for the new specialization."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entity Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select entity type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DOCTOR">Doctor</SelectItem>
                                            <SelectItem value="LAB">Lab</SelectItem>
                                            <SelectItem value="ALL">All (Both)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Cardiology" {...field} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of the specialization..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>Specialization Image</FormLabel>
                            <FormControl>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer"
                                />
                            </FormControl>
                            {initialData?.image && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Current image exists. Uploading new one will replace it.
                                </p>
                            )}
                        </FormItem>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData?.id ? "Update" : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
