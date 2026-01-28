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
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        type: string;
        startDate: string; // ISO string format for input type="datetime-local" is YYYY-MM-DDTHH:mm
        endDate: string;
        address: string;
        city: string;
        latitude: string;
        longitude: string;
        selectedDays: string[];
        scheduleStartTime: string;
        scheduleEndTime: string;
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
        latitude: "",
        longitude: "",
        selectedDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], // Default week days
        scheduleStartTime: "09:00",
        scheduleEndTime: "17:00",
        price: "",
        discountPercentage: "",
    });

    // Calculate progress based on step (1 to 4)
    const progress = (step / 4) * 100;

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

    const validateStep = (currentStep: number) => {
        switch (currentStep) {
            case 1:
                if (!formData.name) { toast.error("Campaign Name is required"); return false; }
                if (!formData.startDate) { toast.error("Start Date is required"); return false; }
                if (!formData.endDate) { toast.error("End Date is required"); return false; }
                return true;
            case 2:
                // Location is optional but let's encourage at least city
                if (!formData.city) { toast.error("City is required"); return false; }
                return true;
            case 3:
                if (formData.selectedDays.length === 0) { toast.error("Select at least one day"); return false; }
                if (!formData.scheduleStartTime || !formData.scheduleEndTime) { toast.error("Time range is required"); return false; }
                return true;
            case 4:
                if (!formData.price) { toast.error("Price is required"); return false; }
                return true;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(4)) return;

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
                    latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                },
                schedule: {
                    days: formData.selectedDays,
                    startTime: formData.scheduleStartTime,
                    endTime: formData.scheduleEndTime,
                },
                // Defaults
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

            // Reset form after successful submission (optional, but good UX)
            setStep(1);
            setFormData({
                name: "",
                description: "",
                type: "OPD",
                startDate: "",
                endDate: "",
                address: "",
                city: "",
                latitude: "",
                longitude: "",
                selectedDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
                scheduleStartTime: "09:00",
                scheduleEndTime: "17:00",
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
                        Step {step} of 4: {
                            step === 1 ? "Campaign Details" :
                                step === 2 ? "Location & Address" :
                                    step === 3 ? "Availability Schedule" : "Pricing & Review"
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
                                    <Label htmlFor="name">Campaign Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g. Free Dental Checkup"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Campaign Type</Label>
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
                                <Label htmlFor="description">Description</Label>
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
                                    <Label htmlFor="startDate">Start Date <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date <span className="text-destructive">*</span></Label>
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
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground bg-muted/50 p-2 rounded text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>Ideally, this would use a map picker. For now, enter details manually.</span>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="e.g. 123 Health Cross, Medical District"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="latitude">Latitude</Label>
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
                                    <Label htmlFor="longitude">Longitude</Label>
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

                            <div className="space-y-3">
                                <Label className="text-base font-semibold flex items-center gap-2">
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

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="scheduleStartTime">Opening Time</Label>
                                    <Input
                                        id="scheduleStartTime"
                                        name="scheduleStartTime"
                                        type="time"
                                        value={formData.scheduleStartTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="scheduleEndTime">Closing Time</Label>
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

                    {/* STEP 4: PRICING & REVIEW */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="flex items-center gap-1">
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
                                    <Label htmlFor="discountPercentage">Discount (%)</Label>
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

                            {/* Brief Review */}
                            <div className="space-y-2 pt-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Verify Details
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    <strong>Campaign:</strong> {formData.name} ({formData.type})<br />
                                    <strong>Location:</strong> {formData.city} <br />
                                    <strong>Schedule:</strong> {formData.selectedDays.length} days selected, {formData.scheduleStartTime} - {formData.scheduleEndTime}
                                </p>
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
                            {step < 4 ? (
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
