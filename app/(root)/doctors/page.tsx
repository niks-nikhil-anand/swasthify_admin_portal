"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CampaignCard, Campaign } from "@/components/root/CampaignCard";
import { CampaignCardSkeleton } from "@/components/root/CampaignCardSkeleton";
import { DoctorFilters } from "./components/DoctorFilters";
import { DoctorPagination } from "./components/DoctorPagination";
import { EmptyState } from "./components/EmptyState";
import { cn } from "@/lib/utils";

export default function DoctorCampaignsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(() => searchParams.get("query") || "");
    const [selectedType, setSelectedType] = useState<string>(() => searchParams.get("type") || "ALL");
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>(() => searchParams.get("specialization") || "ALL");
    const [sortBy, setSortBy] = useState<string>(() => searchParams.get("sort") || "recommended");

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append("query", searchQuery.trim());
            if (selectedType && selectedType !== "ALL") params.append("type", selectedType);
            if (selectedSpecialization && selectedSpecialization !== "ALL") params.append("specialization", selectedSpecialization);
            params.append("sort", sortBy);

            params.append("page", page.toString());
            params.append("limit", "9");
            params.append("source", "doctor"); // Only fetch doctor campaigns

            const response = await fetch(`/api/public/campaigns?${params.toString()}`, { signal: controller.signal });
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
            if (error instanceof DOMException && error.name === "AbortError") return;
            console.error("Error fetching campaigns:", error);
            toast.error("Failed to load campaigns");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 300);
        return () => { clearTimeout(timeoutId); controller.abort(); };
    }, [page, searchQuery, selectedType, selectedSpecialization, sortBy]);

    useEffect(() => {
        const nextParams = new URLSearchParams();
        if (searchQuery.trim()) nextParams.set("query", searchQuery.trim());
        if (selectedType !== "ALL") nextParams.set("type", selectedType);
        if (selectedSpecialization !== "ALL") nextParams.set("specialization", selectedSpecialization);
        if (sortBy !== "recommended") nextParams.set("sort", sortBy);
        if (page > 1) nextParams.set("page", page.toString());
        const nextUrl = nextParams.toString() ? `/doctors?${nextParams.toString()}` : "/doctors";
        const currentUrl = searchParams.toString() ? `/doctors?${searchParams.toString()}` : "/doctors";
        if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false });
    }, [searchQuery, selectedType, selectedSpecialization, sortBy, page, router, searchParams]);

    useEffect(() => {
        setSearchQuery(searchParams.get("query") || "");
        setSelectedType(searchParams.get("type") || "ALL");
        setSelectedSpecialization(searchParams.get("specialization") || "ALL");
        setSortBy(searchParams.get("sort") || "recommended");
        setPage(Math.max(1, Number(searchParams.get("page") || "1")));
    }, [searchParams]);

    const updateSearch = (value: string) => { setSearchQuery(value); setPage(1); };
    const updateType = (value: string) => { setSelectedType(value); setPage(1); };
    const updateSpecialization = (value: string) => { setSelectedSpecialization(value); setPage(1); };
    const updateSort = (value: string) => { setSortBy(value); setPage(1); };
    const hasActiveFilters = Boolean(searchQuery || selectedType !== "ALL" || selectedSpecialization !== "ALL" || sortBy !== "recommended");
    const clearFilters = () => {
        setSearchQuery(""); setSelectedType("ALL"); setSelectedSpecialization("ALL"); setSortBy("recommended"); setPage(1);
    };

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
                onSearchChange={updateSearch}
                selectedSpecialization={selectedSpecialization}
                onSpecializationChange={updateSpecialization}
                selectedType={selectedType}
                onTypeChange={updateType}
                sortBy={sortBy}
                onSortChange={updateSort}
            />

            {!loading && <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>{campaigns.length === 0 ? "No doctors found" : `Showing ${campaigns.length} doctor campaign${campaigns.length === 1 ? "" : "s"}`}</span>
                {hasActiveFilters && <button type="button" onClick={clearFilters} className="min-h-11 rounded-full px-4 font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear all filters</button>}
            </div>}

            {/* Grid */}
            {loading ? (
                <div className={cn("grid gap-6", "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CampaignCardSkeleton key={i} />
                    ))}
                </div>
            ) : campaigns.length > 0 ? (
                <>
                    <div className={cn("grid gap-6", "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
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
