"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    purpose: z.string().optional(),
    image: z.string().optional(),
    price: z.coerce.number().min(0),
    originalPrice: z.coerce.number().min(0),
    discount: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    isActive: z.boolean().default(true),
});

interface HealthPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function HealthPackageModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}: HealthPackageModalProps) {
    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [newTest, setNewTest] = useState("");
    const [newKeyword, setNewKeyword] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            purpose: "",
            image: "",
            price: 0,
            originalPrice: 0,
            discount: "",
            category: "General",
            isActive: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title || "",
                description: initialData.description || "",
                purpose: initialData.purpose || "",
                image: initialData.image || "",
                price: initialData.price || 0,
                originalPrice: initialData.originalPrice || 0,
                discount: initialData.discount || "",
                category: initialData.category || "General",
                isActive: initialData.isActive ?? true,
            });
            setTests(initialData.tests || []);
            setKeywords(initialData.keywords || []);
        } else {
            form.reset({
                title: "",
                description: "",
                purpose: "",
                image: "",
                price: 0,
                originalPrice: 0,
                discount: "",
                category: "General",
                isActive: true,
            });
            setTests([]);
            setKeywords([]);
        }
    }, [initialData, form, isOpen]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const data = { ...values, tests, keywords };

            const url = initialData
                ? `/api/admin/health-packages/${initialData.id}`
                : "/api/admin/health-packages";
            const method = initialData ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            toast.success(initialData ? "Package updated" : "Package created");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to save health package");
        } finally {
            setLoading(false);
        }
    };

    const addTest = () => {
        if (newTest && !tests.includes(newTest)) {
            setTests([...tests, newTest]);
            setNewTest("");
        }
    };

    const removeTest = (test: string) => {
        setTests(tests.filter((t) => t !== test));
    };

    const addKeyword = () => {
        if (newKeyword && !keywords.includes(newKeyword)) {
            setKeywords([...keywords, newKeyword]);
            setNewKeyword("");
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter((k) => k !== keyword));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[60vw] max-w-[60vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit" : "Add"} Health Package</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the health package.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Package Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="General, Women, Men, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="originalPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Original Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Text</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="25% OFF" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purpose</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="e.g. For monitoring health" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} placeholder="Provide details about the package" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tests Management */}
                        <div className="space-y-2">
                            <FormLabel>Tests Included</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    value={newTest}
                                    onChange={(e) => setNewTest(e.target.value)}
                                    placeholder="Add a test name"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTest();
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" size="icon" onClick={addTest}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tests.map((test) => (
                                    <Badge key={test} variant="secondary" className="pl-2">
                                        {test}
                                        <button
                                            type="button"
                                            onClick={() => removeTest(test)}
                                            className="ml-1 hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Keywords Management */}
                        <div className="space-y-2">
                            <FormLabel>Keywords</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    placeholder="Add a keyword"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addKeyword();
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" size="icon" onClick={addKeyword}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {keywords.map((keyword) => (
                                    <Badge key={keyword} variant="outline" className="pl-2">
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => removeKeyword(keyword)}
                                            className="ml-1 hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Active Status</FormLabel>
                                        <div className="text-[0.8rem] text-muted-foreground">
                                            Whether this package is visible on the platform.
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button disabled={loading} variant="outline" onClick={onClose} type="button">
                                Cancel
                            </Button>
                            <Button disabled={loading} type="submit">
                                {initialData ? "Update" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
