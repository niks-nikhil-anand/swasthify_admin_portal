"use client";

import React, { useEffect, useState } from "react";
import { CampaignCard } from "./CampaignCard";
import { Campaign } from "@/app/(root)/doctors/types";
import { CampaignCardSkeleton } from "./CampaignCardSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight, LocateFixed, MapPin, Stethoscope, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const LOCATION_STORAGE_KEY = "swasthify_home_location";
const LOCATION_SKIP_STORAGE_KEY = "swasthify_home_location_skipped";

interface SavedLocation {
    latitude: number;
    longitude: number;
    label: string;
    source: "browser";
}

export function DoctorSection() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationPromptOpen, setLocationPromptOpen] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);

    const fetchDoctors = React.useCallback(async (location?: SavedLocation | null) => {
        setLoading(true);
        try {
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
            setCampaigns(Array.isArray(result) ? result : result.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    }, []);

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

        const skipped = localStorage.getItem(LOCATION_SKIP_STORAGE_KEY) === "true";
        setLocationPromptOpen(!skipped);
        void fetchDoctors();
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
                localStorage.removeItem(LOCATION_SKIP_STORAGE_KEY);
                setSavedLocation(location);
                setLocationPromptOpen(false);
                setLocationLoading(false);
                void fetchDoctors(location);
            },
            () => {
                setLocationError("Location permission was denied. You can still browse all doctors.");
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
        );
    };

    const skipLocation = () => {
        localStorage.setItem(LOCATION_SKIP_STORAGE_KEY, "true");
        setLocationPromptOpen(false);
        setLocationError(null);
        setSavedLocation(null);
        void fetchDoctors();
    };

    const changeLocation = () => {
        setLocationError(null);
        setLocationPromptOpen(true);
    };

    return (
        <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-4">
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
                            {savedLocation ? (
                                <>
                                    <span>Showing doctors near {savedLocation.label}</span>
                                    <button type="button" onClick={changeLocation} className="text-primary underline-offset-4 hover:underline">
                                        Change
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>Showing featured doctors</span>
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

                {locationPromptOpen && (
                    <div className="mb-8 rounded-2xl border border-primary/20 bg-card/80 p-4 shadow-sm backdrop-blur-md md:p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <LocateFixed className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Find doctors near you</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Allow location access to sort in-clinic doctors by distance.
                                    </p>
                                    {locationError && <p className="mt-2 text-sm font-medium text-destructive">{locationError}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button type="button" onClick={useCurrentLocation} disabled={locationLoading} className="gap-2 rounded-full">
                                    <LocateFixed className="h-4 w-4" />
                                    {locationLoading ? "Detecting..." : "Use current location"}
                                </Button>
                                <Button type="button" variant="outline" onClick={skipLocation} className="rounded-full">
                                    Skip
                                </Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => setLocationPromptOpen(false)} className="rounded-full">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

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
