"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CampaignCard, Campaign } from "@/components/root/CampaignCard";
import { CampaignCardSkeleton } from "@/components/root/CampaignCardSkeleton";
import { DoctorFilters } from "./components/DoctorFilters";
import { DoctorPagination } from "./components/DoctorPagination";
import { EmptyState } from "./components/EmptyState";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DoctorCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>("ALL");

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("query", searchQuery);
            if (selectedType && selectedType !== "ALL") params.append("type", selectedType);
            if (selectedSpecialization && selectedSpecialization !== "ALL") params.append("specialization", selectedSpecialization);

            params.append("page", page.toString());
            params.append("limit", "9");
            params.append("source", "doctor"); // Only fetch doctor campaigns

            const response = await fetch(`/api/public/campaigns?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch campaigns");
            const result = await response.json();

            // Handle both legacy array response and new paginated response
            if (Array.isArray(result)) {
                setCampaigns(result);
                setTotalPages(1);
            } else {
                setCampaigns(result.data);
                setTotalPages(result.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            toast.error("Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search - reset page when filters change
        setPage(1);
    }, [searchQuery, selectedType, selectedSpecialization]);

    useEffect(() => {
        fetchCampaigns();
    }, [page, searchQuery, selectedType, selectedSpecialization]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 space-y-8 lg:min-h-[80vh]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4 text-left max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Find Healthcare Campaigns
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Discover active health camps, free checkups, and specialized OPD sessions from verified doctors near you.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <DoctorFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSpecialization={selectedSpecialization}
                onSpecializationChange={setSelectedSpecialization}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
            />

            {/* Grid */}
            {loading ? (
                <div className={cn("grid gap-6", "grid-cols-2 lg:grid-cols-3")}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CampaignCardSkeleton key={i} />
                    ))}
                </div>
            ) : campaigns.length > 0 ? (
                <>
                    <div className={cn("grid gap-6", "grid-cols-2 lg:grid-cols-3")}>
                        {campaigns.map((campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <DoctorPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}