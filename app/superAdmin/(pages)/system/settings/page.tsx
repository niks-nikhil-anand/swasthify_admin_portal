"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Bell,
    CreditCard,
    Database,
    Globe,
    Lock,
    Palette,
    Save,
    Shield,
    Smartphone,
    User,
    Plus,
    Edit2,
    Loader2,
    Trash2
} from "lucide-react"

interface PlatformFee {
    id: string
    name: string
    description?: string
    feeType: "PERCENTAGE" | "FLAT"
    fee: number
    discount: number
    discountType: "PERCENTAGE" | "FLAT"
    entityType: "DOCTOR" | "LAB" | "ALL"
    minAmount?: number
    maxAmount?: number
    isActive: boolean
}

export default function SettingsPage() {
    const [fees, setFees] = useState<PlatformFee[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingFee, setEditingFee] = useState<Partial<PlatformFee> | null>(null)

    // Form states for real-time calculation
    const [formValues, setFormValues] = useState({
        fee: 0,
        feeType: "PERCENTAGE",
        discount: 0,
        discountType: "PERCENTAGE"
    })

    useEffect(() => {
        if (editingFee) {
            setFormValues({
                fee: editingFee.fee || 0,
                feeType: editingFee.feeType || "PERCENTAGE",
                discount: editingFee.discount || 0,
                discountType: editingFee.discountType || "PERCENTAGE"
            })
        } else {
            setFormValues({
                fee: 0,
                feeType: "PERCENTAGE",
                discount: 0,
                discountType: "PERCENTAGE"
            })
        }
    }, [editingFee, isDialogOpen])

    useEffect(() => {
        fetchFees()
    }, [])

    const calculateFinalFee = (fee: number, feeType: string, discount: number, discountType: string) => {
        // Amount (fee) is now always a flat rupee amount as per user request
        let platformFeeValue = fee;
        let platformDiscountValue = 0;

        if (discountType === "PERCENTAGE") {
            platformDiscountValue = (platformFeeValue * discount) / 100;
        } else {
            platformDiscountValue = discount;
        }

        const final = Math.max(0, platformFeeValue - platformDiscountValue);
        return `₹${final}`;
    }

    const fetchFees = async () => {
        try {
            const response = await fetch("/api/admin/system/platform-fee")
            if (response.ok) {
                const data = await response.json()
                setFees(data)
            }
        } catch (error) {
            console.error("Failed to fetch fees", error)
            toast.error("Failed to load platform fees")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveFee = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)

        const formData = new FormData(e.currentTarget)
        const data: any = {
            name: formData.get("name"),
            description: formData.get("description"),
            feeType: "FLAT", // Amount is always flat rupee amount now
            fee: formData.get("fee"),
            discount: formData.get("discount"),
            discountType: formData.get("discountType"),
            entityType: formData.get("entityType"),
            minAmount: formData.get("minAmount"),
            maxAmount: formData.get("maxAmount"),
            isActive: formData.get("isActive") === "on",
        }

        if (editingFee?.id) {
            data.id = editingFee.id
        }

        try {
            const method = editingFee?.id ? "PUT" : "POST"
            const response = await fetch("/api/admin/system/platform-fee", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success("Platform fee updated successfully")
                setIsDialogOpen(false)
                fetchFees()
            } else {
                toast.error("Failed to save platform fee")
            }
        } catch (error) {
            console.error("Error saving fee", error)
            toast.error("An error occurred while saving")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">Manage platform configurations and preferences.</p>
                </div>
                <Button>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="backups">Backups</TabsTrigger>
                </TabsList>

                {/* 1. General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                General Configuration
                            </CardTitle>
                            <CardDescription>
                                Basic details and localization settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input id="siteName" defaultValue="Swasthify" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input id="supportEmail" defaultValue="support@swasthify.in" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select defaultValue="ist">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                            <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                                            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Default Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="hi">Hindi</SelectItem>
                                            <SelectItem value="bn">Bengali</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Branding & Appearance */}
                <TabsContent value="branding" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of the admin portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode Default</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable dark mode for new users by default.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600 cursor-pointer" />
                                    <div className="h-8 w-8 rounded-full bg-green-600 cursor-pointer" />
                                    <div className="h-8 w-8 rounded-full bg-purple-600 cursor-pointer" />
                                    <div className="h-8 w-8 rounded-full bg-orange-600 cursor-pointer" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Logo Upload</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                    <p>Drag and drop logo here</p>
                                    <p className="text-xs mt-1">PNG, JPG up to 2MB</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Notifications */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Channels
                            </CardTitle>
                            <CardDescription>
                                Configure how the system sends alerts used.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Receive system emails</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label>SMS Gateway API Key</Label>
                                <Input type="password" placeholder="Enter API Key from provider" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Send browser notifications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. Security */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security & Access
                            </CardTitle>
                            <CardDescription>
                                Manage authentication and session policies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enforce 2FA</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require Two-Factor Authentication for all admins.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeout">Session Timeout (Minutes)</Label>
                                <Input id="timeout" type="number" defaultValue="30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                                <Input id="ip-whitelist" placeholder="192.168.1.1, 10.0.0.1" />
                                <p className="text-xs text-muted-foreground">Comma separated list of allowed IPs.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 5. Payments */}
                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Gateway
                            </CardTitle>
                            <CardDescription>
                                Configure transaction settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Default Currency</Label>
                                    <Select defaultValue="inr">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                                            <SelectItem value="usd">US Dollar (USD)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gateway Provider</Label>
                                    <Select defaultValue="razorpay">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="razorpay">Razorpay</SelectItem>
                                            <SelectItem value="stripe">Stripe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input type="number" defaultValue="18" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Platform Fee Management Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5" />
                                    Platform Fees
                                </CardTitle>
                                <CardDescription>
                                    Manage service fees for doctors and labs.
                                </CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setEditingFee(null)}>
                                        <Plus className="mr-2 h-4 w-4" /> Add/Update Fee
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <form onSubmit={handleSaveFee}>
                                        <DialogHeader>
                                            <DialogTitle>Manage Platform Fee</DialogTitle>
                                            <DialogDescription>
                                                Configure fee, discount, and targeting details.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="entityType" className="text-right">Target</Label>
                                                <Select name="entityType" defaultValue={editingFee?.entityType || "ALL"} required>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select target" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ALL">All Entities</SelectItem>
                                                        <SelectItem value="DOCTOR">Doctors Only</SelectItem>
                                                        <SelectItem value="LAB">Labs Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">Name</Label>
                                                <Input id="name" name="name" defaultValue={editingFee?.name || ""} className="col-span-3" placeholder="e.g. Doctor Consultation Fee" required />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="description" className="text-right">Description</Label>
                                                <Input id="description" name="description" defaultValue={editingFee?.description || ""} className="col-span-3" />
                                            </div>
                                            {/* Fee Type removed as per user request - Amount is always Rupees */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="fee" className="text-right">Amount</Label>
                                                <Input
                                                    id="fee"
                                                    name="fee"
                                                    type="number"
                                                    step="0.01"
                                                    defaultValue={formValues.fee}
                                                    onChange={(e) => setFormValues(prev => ({ ...prev, fee: parseFloat(e.target.value) || 0 }))}
                                                    className="col-span-3"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="discountType" className="text-right">Discount Type</Label>
                                                <Select
                                                    name="discountType"
                                                    defaultValue={formValues.discountType}
                                                    onValueChange={(v) => setFormValues(prev => ({ ...prev, discountType: v }))}
                                                    required
                                                >
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                                        <SelectItem value="FLAT">Flat Amount</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="discount" className="text-right">Discount</Label>
                                                <Input
                                                    id="discount"
                                                    name="discount"
                                                    type="number"
                                                    step="0.01"
                                                    defaultValue={formValues.discount}
                                                    onChange={(e) => setFormValues(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                                                    className="col-span-3"
                                                    required
                                                />
                                            </div>

                                            {/* Final Amount Preview */}
                                            <div className="grid grid-cols-4 items-center gap-4 border-t pt-2 mt-2">
                                                <Label className="text-right font-bold text-blue-600">Final Fee</Label>
                                                <div className="col-span-3 font-bold text-blue-600">
                                                    {calculateFinalFee(formValues.fee, formValues.feeType, formValues.discount, formValues.discountType)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="minAmount" className="text-right">Min Order</Label>
                                                <Input id="minAmount" name="minAmount" type="number" step="0.01" defaultValue={editingFee?.minAmount || ""} className="col-span-3" placeholder="Optional" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="maxAmount" className="text-right">Max Fee Cap</Label>
                                                <Input id="maxAmount" name="maxAmount" type="number" step="0.01" defaultValue={editingFee?.maxAmount || ""} className="col-span-3" placeholder="Optional" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="isActive" className="text-right">Active</Label>
                                                <div className="col-span-3 flex items-center">
                                                    <Switch name="isActive" defaultChecked={editingFee?.isActive ?? true} />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={isSaving}>
                                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Save Settings
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : fees.length > 0 ? (
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Target</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Discount</TableHead>
                                                <TableHead className="font-bold text-blue-600">Final Fee</TableHead>
                                                <TableHead>Min/Max</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fees.map((fee) => (
                                                <TableRow key={fee.id}>
                                                    <TableCell>
                                                        <Badge variant="outline">{fee.entityType}</Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{fee.name}</TableCell>
                                                    <TableCell>
                                                        ₹{fee.fee}
                                                    </TableCell>
                                                    <TableCell>
                                                        ₹{fee.discount}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-blue-600">
                                                        {calculateFinalFee(fee.fee, fee.feeType, fee.discount, fee.discountType)}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {fee.minAmount ? `Min: ${fee.minAmount}` : "-"} / {fee.maxAmount ? `Max: ${fee.maxAmount}` : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={fee.isActive ? "default" : "secondary"}>
                                                            {fee.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            setEditingFee(fee)
                                                            setIsDialogOpen(true)
                                                        }}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                                    <p className="text-muted-foreground">No platform fees configured yet.</p>
                                    <p className="text-xs mt-1">Add a fee to start collecting commissions on transactions.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 6. Backups */}
                <TabsContent value="backups" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Data Management
                            </CardTitle>
                            <CardDescription>
                                Backup and maintenance controls.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Automatic Backups</Label>
                                    <p className="text-sm text-muted-foreground">Daily database snapshots</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label>Retention Period</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 Days</SelectItem>
                                        <SelectItem value="30">30 Days</SelectItem>
                                        <SelectItem value="90">90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/10">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-red-600">Maintenance Mode</Label>
                                    <p className="text-sm text-red-600/80">
                                        Take the site offline for users.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
