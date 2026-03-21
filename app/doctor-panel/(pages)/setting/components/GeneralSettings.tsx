"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Pencil, AlertTriangle, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface Speciality {
    id: string;
    name: string;
}

interface GeneralSettingsProps {
    specialities?: Speciality[];
    updateSpecialities?: (ids: string[]) => Promise<void>;
    saving?: boolean;
}

interface PublicSpeciality {
    id: string;
    title: string;
    type: string;
}

export function GeneralSettings({ specialities = [], updateSpecialities, saving }: GeneralSettingsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [allSpecialities, setAllSpecialities] = useState<PublicSpeciality[]>([]);
    const [loadingSpecs, setLoadingSpecs] = useState(false);
    
    // Internal state for selected IDs during edit in the Dialog
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isDialogOpen) {
            // Populate initial selection when dialog opens
            setSelectedIds(new Set(specialities.map(s => s.id)));
            fetchPublicSpecialities();
        }
    }, [isDialogOpen, specialities]);

    const fetchPublicSpecialities = async () => {
        if (allSpecialities.length > 0) return; // already fetched
        try {
            setLoadingSpecs(true);
            const res = await fetch("/api/public/specializations?type=DOCTOR&limit=100");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAllSpecialities(data);
            }
        } catch (error) {
            console.error("Failed to fetch specializations:", error);
            toast.error("Failed to load specialities lists.");
        } finally {
            setLoadingSpecs(false);
        }
    };

    const toggleSpeciality = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleSave = async () => {
        if (!updateSpecialities) return;
        await updateSpecialities(Array.from(selectedIds));
        setIsDialogOpen(false);
    };

    return (
        <Card className="border-none shadow-sm bg-muted/30 overflow-hidden relative">
            <div className="h-2 bg-linear-to-r from-primary to-blue-400 absolute top-0 left-0 right-0 w-full" />
            <CardHeader className="pt-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-1.5 flex-1">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <User className="h-6 w-6 text-primary" />
                            Account Preferences
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground w-full">
                            Manage your basic account settings and medical proficiencies.
                        </CardDescription>
                        <div className="mt-5 flex items-start gap-3 text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 max-w-3xl">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                                <strong>Important Disclaimer:</strong> Your listed medical specialities help patients find you. Only list specialities for which you hold valid qualifications. Falsified medical credentials violate our terms of service and can lead to permanent account suspension.
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 pb-8">
                
                {/* Specialities Section */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-primary" />
                            Medical Specialities
                        </h3>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2 relative group overflow-hidden border-primary/20 hover:border-primary/50 transition-all rounded-xl h-9 px-4 bg-background shadow-xs">
                                    <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <Pencil className="h-3.5 w-3.5 relative z-10 text-primary" />
                                    <span className="relative z-10 font-semibold text-sm">Edit Specialities</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-6 rounded-2xl max-h-[85vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle className="text-xl flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5 text-primary" />
                                        Update Specialities
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Select the medical specialities you are qualified to practice. This will be visible on your public doctor profile.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-4 flex-1 overflow-hidden flex flex-col">
                                    {loadingSpecs ? (
                                        <div className="flex-1 flex items-center justify-center min-h-[200px]">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border rounded-xl bg-muted/20 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[300px] max-h-[400px]">
                                            {allSpecialities.map(spec => {
                                                const isSelected = selectedIds.has(spec.id);
                                                return (
                                                    <div 
                                                        key={spec.id}
                                                        onClick={() => toggleSpeciality(spec.id)}
                                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${isSelected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border/50 bg-background hover:border-primary/30 hover:bg-muted/50'}`}
                                                    >
                                                        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                            {spec.title}
                                                        </span>
                                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-input bg-background'}`}>
                                                            {isSelected && <Check className="h-3 w-3 text-primary-foreground stroke-3" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {allSpecialities.length === 0 && !loadingSpecs && (
                                                <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                                                    <AlertTriangle className="h-8 w-8 opacity-50" />
                                                    <p>No specialities are currently available in the database.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="pt-2 flex justify-end gap-3 border-t">
                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={saving} className="rounded-xl h-11 px-5">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving || loadingSpecs}
                                            className="h-11 px-8 rounded-xl shadow-lg shadow-primary/25 bg-linear-to-r from-primary to-primary/90 hover:to-primary transition-all font-semibold"
                                        >
                                            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Specialities"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="p-5 bg-background rounded-2xl border border-border/50 shadow-xs">
                        {specialities.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {specialities.map((spec) => (
                                    <Badge key={spec.id} variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                        {spec.name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-muted-foreground/60 flex flex-col items-center gap-2">
                                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-1">
                                    <Stethoscope className="h-6 w-6 opacity-30" />
                                </div>
                                <p className="font-medium text-foreground/80">No Specialities Added</p>
                                <p className="text-sm">You haven't added any medical specialities yet.</p>
                                <Button variant="link" onClick={() => setIsDialogOpen(true)} className="text-primary mt-1 px-0 h-auto">
                                    Add Specialities
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
