"use client";

import React, { useEffect, useState } from "react";
import { CampaignCard } from "./CampaignCard";
import { Campaign } from "@/app/(root)/doctors/types";
import { CampaignCardSkeleton } from "./CampaignCardSkeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, LocateFixed, MapPin, Stethoscope } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const LOCATION_STORAGE_KEY = "swasthify_home_location";
const PATNA_LOCATION: SavedLocation = {
    latitude: 25.5941,
    longitude: 85.1376,
    label: "Patna",
    source: "fallback",
};

interface SavedLocation {
    latitude: number;
    longitude: number;
    label: string;
    source: "browser" | "fallback";
}

export function DoctorSection() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationPromptOpen, setLocationPromptOpen] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);

    const requestDoctors = React.useCallback(async (location?: SavedLocation | null) => {
        const params = new URLSearchParams({
            source: "doctor",
            limit: "3",
        });

        if (location) {
            params.set("lat", String(location.latitude));
            params.set("lng", String(location.longitude));
            params.set("radiusKm", "25");
        }

        const response = await fetch(`/api/public/campaigns?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const result = await response.json();
        return (Array.isArray(result) ? result : result.data) as Campaign[];
    }, []);

    const loadPatnaFallback = React.useCallback(async () => {
        setSavedLocation(PATNA_LOCATION);
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(PATNA_LOCATION));
        const patnaDoctors = await requestDoctors(PATNA_LOCATION);
        setCampaigns(patnaDoctors);
    }, [requestDoctors]);

    const fetchDoctors = React.useCallback(async (location?: SavedLocation | null, fallbackToPatna = true) => {
        setLoading(true);
        try {
            const doctors = await requestDoctors(location);
            if (fallbackToPatna && location?.source === "browser" && doctors.length === 0) {
                await loadPatnaFallback();
                return;
            }

            setCampaigns(doctors);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            if (fallbackToPatna && location?.source === "browser") {
                try {
                    await loadPatnaFallback();
                } catch (fallbackError) {
                    console.error("Error fetching Patna doctors:", fallbackError);
                    setCampaigns([]);
                }
            }
        } finally {
            setLoading(false);
        }
    }, [requestDoctors, loadPatnaFallback]);

    useEffect(() => {
        const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (storedLocation) {
            try {
                const parsedLocation = JSON.parse(storedLocation) as SavedLocation;
                setSavedLocation(parsedLocation);
                void fetchDoctors(parsedLocation);
                return;
            } catch {
                localStorage.removeItem(LOCATION_STORAGE_KEY);
            }
        }

        setSavedLocation(PATNA_LOCATION);
        setLocationPromptOpen(true);
        void fetchDoctors(PATNA_LOCATION, false);
    }, [fetchDoctors]);

    const useCurrentLocation = () => {
        setLocationError(null);
        if (!navigator.geolocation) {
            setLocationError("Location is not supported by this browser.");
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location: SavedLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    label: "your current location",
                    source: "browser",
                };
                localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
                setSavedLocation(location);
                setLocationPromptOpen(false);
                setLocationLoading(false);
                void fetchDoctors(location);
            },
            () => {
                setLocationError("Location permission was denied. Showing doctors in Patna.");
                setSavedLocation(PATNA_LOCATION);
                localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(PATNA_LOCATION));
                setLocationPromptOpen(false);
                setLocationLoading(false);
                void fetchDoctors(PATNA_LOCATION, false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
        );
    };

    const skipLocation = () => {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(PATNA_LOCATION));
        setLocationPromptOpen(false);
        setLocationError(null);
        setSavedLocation(PATNA_LOCATION);
        void fetchDoctors(PATNA_LOCATION, false);
    };

    const changeLocation = () => {
        setLocationError(null);
        setLocationPromptOpen(true);
    };

    return (
        <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-4">
                <Dialog open={locationPromptOpen} onOpenChange={setLocationPromptOpen}>
                    <DialogContent className="border-primary/20 bg-background/95 p-0 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:max-w-md">
                        <div className="p-6 sm:p-7">
                            <DialogHeader className="gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <LocateFixed className="h-6 w-6" />
                                </div>
                                <DialogTitle className="text-2xl">Find doctors near you</DialogTitle>
                                <DialogDescription className="text-base leading-7">
                                    Allow location access to show nearby in-clinic doctors first. If you skip, we&apos;ll show doctors in Patna.
                                </DialogDescription>
                            </DialogHeader>

                            {locationError && (
                                <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                                    {locationError}
                                </p>
                            )}

                            <DialogFooter className="mt-6 gap-3 sm:flex-col sm:justify-start">
                                <Button type="button" onClick={useCurrentLocation} disabled={locationLoading} className="w-full gap-2 rounded-full">
                                    <LocateFixed className="h-4 w-4" />
                                    {locationLoading ? "Detecting..." : "Use current location"}
                                </Button>
                                <Button type="button" variant="outline" onClick={skipLocation} className="w-full rounded-full">
                                    Show Patna doctors
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3 text-center md:text-left"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                            Book an Appointment for <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 rounded-md">In-Clinic Consultation</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Find experienced doctors across all specialties for personalized in-person care.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-muted-foreground md:justify-start">
                            <MapPin className="h-4 w-4 text-primary" />
                            {savedLocation?.source === "browser" ? (
                                <>
                                    <span>Showing doctors near your current location</span>
                                    <button type="button" onClick={changeLocation} className="text-primary underline-offset-4 hover:underline">
                                        Change
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>Showing doctors in Patna</span>
                                    <button type="button" onClick={changeLocation} className="text-primary underline-offset-4 hover:underline">
                                        Use my location
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                    <Link href="/doctors">
                        <Button variant="ghost" className="group gap-2 text-primary font-semibold hover:bg-primary/5 shadow-sm">
                            See All Doctors
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {[1, 2, 3].map((i) => (
                            <CampaignCardSkeleton key={i} />
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                            {campaigns.slice(0, 3).map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Link href="/doctors">
                                <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                                    Show more doctors
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-emerald-500/20 max-w-2xl mx-auto">
                        <Stethoscope className="w-16 h-16 text-emerald-500/20 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-foreground">No featured doctors available</h3>
                        <p className="text-muted-foreground mt-2 px-8">
                            We&apos;re currently updating our doctor listings. Check back later or browse all doctors.
                        </p>
                        <Link href="/doctors" className="mt-8 inline-block">
                            <Button variant="outline" className="rounded-full px-8 shadow-lg shadow-emerald-500/5">Browse All Doctors</Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
