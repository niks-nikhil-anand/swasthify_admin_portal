"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LabCampaignCard } from "@/components/root/LabCampaignCard";
import { LabCampaignCardSkeleton } from "@/components/root/LabCampaignCardSkeleton";
import { LabFilters } from "./components/LabFilters";
import { LabPagination } from "./components/LabPagination";
import { EmptyState } from "./components/EmptyState";
import { LabCampaign } from "./types";

export default function LabCampaignsPage() {
    const [campaigns, setCampaigns] = useState<LabCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("ALL");

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("query", searchQuery);
            if (selectedType && selectedType !== "ALL") params.append("type", selectedType);

            params.append("page", page.toString());
            params.append("limit", "9");
            params.append("source", "lab"); // Only fetch lab campaigns

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
    }, [searchQuery, selectedType]);

    useEffect(() => {
        fetchCampaigns();
    }, [page, searchQuery, selectedType]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 space-y-8 lg:min-h-[80vh]">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Find Lab Campaigns
                </h1>
                <p className="text-lg text-muted-foreground">
                    Discover health checkup camps, discounted tests, and home collection drives from verified labs near you.
                </p>
            </div>

            {/* Filters */}
            <LabFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
            />

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <LabCampaignCardSkeleton key={i} />
                    ))}
                </div>
            ) : campaigns.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <LabCampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <LabPagination
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
