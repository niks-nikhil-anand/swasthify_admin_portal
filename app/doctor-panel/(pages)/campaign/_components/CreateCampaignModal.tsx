"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, ArrowLeft, MapPin, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { z } from "zod";

interface CreateCampaignModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = [
    { id: "MONDAY", label: "Mon" },
    { id: "TUESDAY", label: "Tue" },
    { id: "WEDNESDAY", label: "Wed" },
    { id: "THURSDAY", label: "Thu" },
    { id: "FRIDAY", label: "Fri" },
    { id: "SATURDAY", label: "Sat" },
    { id: "SUNDAY", label: "Sun" },
];

export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        type: string;
        startDate: string;
        endDate: string;
        address: string;
        city: string;
        state: string;
        district: string;
        pincode: string;
        latitude: string;
        longitude: string;
        selectedDays: string[];
        scheduleStartTime: string;
        scheduleEndTime: string;
        totalCampaignAppointments: string;
        dailyAppointmentLimit: string;
        hourlyAppointmentLimit: string;
        appointmentRequirements: string[];
        price: string;
        discountPercentage: string;
    }>({
        name: "",
        description: "",
        type: "OPD",
        startDate: "",
        endDate: "",
        address: "",
        city: "",
        state: "",
        district: "",
        pincode: "",
        latitude: "",
        longitude: "",
        selectedDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
        scheduleStartTime: "09:00",
        scheduleEndTime: "17:00",
        totalCampaignAppointments: "",
        dailyAppointmentLimit: "",
        hourlyAppointmentLimit: "",
        appointmentRequirements: ["Name", "Age", "Gender", "Phone Number"],
        price: "",
        discountPercentage: "",
    });

    const [detectingLocation, setDetectingLocation] = useState(false);

    // ... existing handlers

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData((prev) => ({
                    ...prev,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                }));
                toast.success("Location detected successfully");
                setDetectingLocation(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("Unable to retrieve your location. Please ensure location permissions are enabled.");
                setDetectingLocation(false);
            }
        );
    };

    // Calculate progress based on step (1 to 6)
    const progress = (step / 6) * 100;

    // Calculate discounted price
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discountPercentage) || 0;
    const discountedPrice = price - (price * (discount / 100));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDayToggle = (dayId: string) => {
        setFormData((prev) => {
            const currentDays = prev.selectedDays;
            if (currentDays.includes(dayId)) {
                return { ...prev, selectedDays: currentDays.filter((d) => d !== dayId) };
            } else {
                return { ...prev, selectedDays: [...currentDays, dayId] };
            }
        });
    };

    const handleRequirementToggle = (req: string) => {
        setFormData((prev) => {
            const currentReqs = prev.appointmentRequirements;
            if (currentReqs.includes(req)) {
                return { ...prev, appointmentRequirements: currentReqs.filter((r) => r !== req) };
            } else {
                return { ...prev, appointmentRequirements: [...currentReqs, req] };
            }
        });
    };

    // Zod Schemas for each step
    const step1Schema = z.object({
        name: z.string().min(1, "Campaign Name is required"),
        type: z.string(),
        description: z.string().optional(),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
    }).refine((data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.startDate) < new Date(data.endDate);
    }, {
        message: "End Date must be after Start Date",
        path: ["endDate"],
    });

    const step2Schema = z.object({
        address: z.string().min(5, "Address must be at least 5 characters"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        district: z.string().min(1, "District is required"),
        pincode: z.string().min(1, "Pin Code is required").regex(/^\d{6}$/, "Pin Code must be exactly 6 digits"),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
    });

    const step3Schema = z.object({
        selectedDays: z.array(z.string()).min(1, "Select at least one day"),
        scheduleStartTime: z.string().min(1, "Opening Time is required"),
        scheduleEndTime: z.string().min(1, "Closing Time is required"),
    });

    const step4Schema = z.object({
        totalCampaignAppointments: z.string().optional().refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0), "Total Capacity must be a positive number"),
        dailyAppointmentLimit: z.string().min(1, "Daily Limit is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Daily Limit must be a positive number"),
        hourlyAppointmentLimit: z.string().min(1, "Hourly Limit is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Hourly Limit must be a positive number"),
        appointmentRequirements: z.array(z.string()).min(1, "Select at least one required field"),
    });

    const step5Schema = z.object({
        price: z.string().min(1, "Base Price is required").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Price must be a positive number"),
        discountPercentage: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100), "Discount must be between 0 and 100"),
    });

    const validateStep = (currentStep: number) => {
        try {
            switch (currentStep) {
                case 1:
                    step1Schema.parse(formData);
                    return true;
                case 2:
                    step2Schema.parse(formData);
                    return true;
                case 3:
                    step3Schema.parse(formData);
                    return true;
                case 4:
                    step4Schema.parse(formData);
                    return true;
                case 5:
                    step5Schema.parse(formData);
                    return true;
                case 6:
                    return true; // No validation needed for review step
                default:
                    return true;
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.issues[0];
                toast.error(firstError?.message || "Validation failed");
            }
            return false;
        }
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 6));
        }
    };

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate all steps before submission
        if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
            toast.error("Please ensure all steps are correctly filled.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                price: parseFloat(formData.price),
                discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    district: formData.district,
                    pincode: formData.pincode,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                },
                schedule: {
                    days: formData.selectedDays,
                    startTime: formData.scheduleStartTime,
                    endTime: formData.scheduleEndTime,
                },
                appointmentConfig: {
                    totalCapacity: formData.totalCampaignAppointments ? parseInt(formData.totalCampaignAppointments) : null,
                    dailyLimit: parseInt(formData.dailyAppointmentLimit),
                    hourlyLimit: parseInt(formData.hourlyAppointmentLimit),
                    requiredDetails: formData.appointmentRequirements,
                },
                bookingRules: {},
                eligibility: {},
            };

            const response = await fetch("/api/doctor/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create campaign");
            }

            toast.success("Campaign created successfully!");
            onOpenChange(false);

            setStep(1);
            setFormData({
                name: "",
                description: "",
                type: "OPD",
                startDate: "",
                endDate: "",
                address: "",
                city: "",
                state: "",
                district: "",
                pincode: "",
                latitude: "",
                longitude: "",
                selectedDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
                scheduleStartTime: "09:00",
                scheduleEndTime: "17:00",
                totalCampaignAppointments: "",
                dailyAppointmentLimit: "",
                hourlyAppointmentLimit: "",
                appointmentRequirements: ["Name", "Age", "Gender", "Phone Number"],
                price: "",
                discountPercentage: "",
            });

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                        Step {step} of 6: {
                            step === 1 ? "Campaign Details" :
                                step === 2 ? "Location & Address" :
                                    step === 3 ? "Availability Schedule" :
                                        step === 4 ? "Appointment Configuration" :
                                            step === 5 ? "Pricing" : "Final Review"
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="w-full mb-6">
                    <Progress value={progress} className="h-2" />
                </div>

                <form onSubmit={handleSubmit}>

                    {/* STEP 1: CAMPAIGN DETAILS */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="mb-2 block">Campaign Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g. Free Dental Checkup"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="mb-2 block">Campaign Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val) => handleSelectChange("type", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPD">OPD Consultation</SelectItem>
                                            <SelectItem value="HEALTH_CAMP">Health Camp</SelectItem>
                                            <SelectItem value="FREE_CHECKUP">Free Checkup</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="mb-2 block">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe what this campaign offers..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="mb-2 block"> Campaign Start Date <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="mb-2 block"> Campaign End Date <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: LOCATION */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-2 rounded text-sm flex-1 mr-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Enter details manually or detect location.</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDetectLocation}
                                    disabled={detectingLocation}
                                >
                                    {detectingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                                    Detect Location
                                </Button>
                            </div>

                            <div className="space-y-2 pb-2">
                                <Label htmlFor="address" className="mb-2 block">Street Address <span className="text-destructive">*</span></Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="e.g. 123 Health Cross, Medical District"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 pb-2">
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="city" className="mb-2 block">City <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="district" className="mb-2 block">District <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="district"
                                        name="district"
                                        placeholder="District"
                                        value={formData.district}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="state" className="mb-2 block">State <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pb-2">
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="pincode" className="mb-2 block">Pin Code <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="pincode"
                                        name="pincode"
                                        placeholder="123456"
                                        value={formData.pincode}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val) && val.length <= 6) {
                                                setFormData((prev) => ({ ...prev, pincode: val }));
                                            }
                                        }}
                                        maxLength={6}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="latitude" className="mb-2 block">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        placeholder="12.9716"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="longitude" className="mb-2 block">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        placeholder="77.5946"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SCHEDULE */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                            <div className="space-y-3 pb-2">
                                <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4" /> Available Days
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <div key={day.id} className="flex items-center space-x-2 border p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                            <Checkbox
                                                id={day.id}
                                                checked={formData.selectedDays.includes(day.id)}
                                                onCheckedChange={() => handleDayToggle(day.id)}
                                            />
                                            <label
                                                htmlFor={day.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {day.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t pb-2">
                                <div className="space-y-2">
                                    <Label htmlFor="scheduleStartTime" className="mb-2 block">Opening Time</Label>
                                    <Input
                                        id="scheduleStartTime"
                                        name="scheduleStartTime"
                                        type="time"
                                        value={formData.scheduleStartTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="scheduleEndTime" className="mb-2 block">Closing Time</Label>
                                    <Input
                                        id="scheduleEndTime"
                                        name="scheduleEndTime"
                                        type="time"
                                        value={formData.scheduleEndTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                        </div>
                    )}

                    {/* STEP 4: APPOINTMENT CONFIGURATION */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Capacity Constraints</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="totalCampaignAppointments" className="mb-2 block">Total Appointments (Optional)</Label>
                                        <Input
                                            id="totalCampaignAppointments"
                                            name="totalCampaignAppointments"
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 500"
                                            value={formData.totalCampaignAppointments}
                                            onChange={handleChange}
                                        />
                                        <p className="text-xs text-muted-foreground">Limit total bookings for the entire campaign.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dailyAppointmentLimit" className="mb-2 block">Daily Limit <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="dailyAppointmentLimit"
                                            name="dailyAppointmentLimit"
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 50"
                                            value={formData.dailyAppointmentLimit}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hourlyAppointmentLimit" className="mb-2 block">Hourly Limit <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="hourlyAppointmentLimit"
                                            name="hourlyAppointmentLimit"
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 10"
                                            value={formData.hourlyAppointmentLimit}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 border-t">
                                <Label className="text-base font-semibold block mb-2">Required Patient Details <span className="text-destructive">*</span></Label>
                                <p className="text-sm text-muted-foreground mb-3">Select the information patients must provide when booking.</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Name", "Age", "Gender", "Phone Number", "Email Address", "Current Symptoms", "Medical History"].map((req) => (
                                        <div key={req} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`req-${req}`}
                                                checked={formData.appointmentRequirements.includes(req)}
                                                onCheckedChange={() => handleRequirementToggle(req)}
                                            />
                                            <label
                                                htmlFor={`req-${req}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {req}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* STEP 5: PRICING */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                            <div className="grid grid-cols-2 gap-4 pb-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="flex items-center gap-1 mb-2">
                                        <DollarSign className="w-3.5 h-3.5" /> Base Price ({'INR'}) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discountPercentage" className="mb-2 block">Discount (%)</Label>
                                    <Input
                                        id="discountPercentage"
                                        name="discountPercentage"
                                        type="number"
                                        min="0" // Allow 0
                                        max="100"
                                        placeholder="0"
                                        value={formData.discountPercentage}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Pricing Summary Card */}
                            <div className="bg-muted/30 p-4 rounded-lg border space-y-3">
                                <h4 className="font-semibold text-sm text-foreground">Pricing Summary</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Original Price:</span>
                                    <span>₹{price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount ({discount}%):</span>
                                    <span>- ₹{(price * (discount / 100)).toFixed(2)}</span>
                                </div>
                                <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg">
                                    <span>Final Price:</span>
                                    <span>₹{discountedPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: FINAL REVIEW */}
                    {step === 6 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-muted/30 p-4 rounded-lg border space-y-4 text-sm">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1">Campaign Details</h4>
                                    <p className="text-muted-foreground">{formData.name} ({formData.type})</p>
                                    <p className="text-muted-foreground text-xs">{format(new Date(formData.startDate), "PPP p")} - {format(new Date(formData.endDate), "PPP p")}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Location</h4>
                                        <p className="text-muted-foreground">{formData.address}</p>
                                        <p className="text-muted-foreground">{formData.city}, {formData.state} - {formData.pincode}</p>
                                        {formData.latitude && formData.longitude && <p className="text-xs text-muted-foreground mt-1">Lat: {formData.latitude}, Lng: {formData.longitude}</p>}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Schedule</h4>
                                        <p className="text-muted-foreground">{formData.selectedDays.map(d => d.slice(0, 3)).join(", ")}</p>
                                        <p className="text-muted-foreground">{formData.scheduleStartTime} - {formData.scheduleEndTime}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Capacity</h4>
                                        <p className="text-muted-foreground">{formData.dailyAppointmentLimit} / day</p>
                                        <p className="text-muted-foreground">{formData.hourlyAppointmentLimit} / hour</p>
                                        {formData.totalCampaignAppointments && <p className="text-muted-foreground">Total: {formData.totalCampaignAppointments}</p>}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Patient Info</h4>
                                        <p className="text-muted-foreground text-xs">{formData.appointmentRequirements.join(", ")}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t mt-2">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Final Price</span>
                                        <div className="text-right">
                                            <span className="text-muted-foreground line-through text-sm font-normal mr-2">₹{price.toFixed(2)}</span>
                                            <span>₹{discountedPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <p>Please review all details carefully before creating the campaign.</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-8 flex items-center justify-between sm:justify-between w-full">
                        {/* Back Button */}
                        <div className="flex-1">
                            {step > 1 ? (
                                <Button type="button" variant="ghost" onClick={handleBack} disabled={loading}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            ) : <div />}
                        </div>

                        {/* Next/Submit Button */}
                        <div>
                            {step < 6 ? (
                                <Button type="button" onClick={handleNext}>
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Campaign
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
