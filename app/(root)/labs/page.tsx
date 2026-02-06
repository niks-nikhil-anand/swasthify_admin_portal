"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { LabCampaignCard, LabCampaign } from "@/components/root/LabCampaignCard";
import { LabCampaignCardSkeleton } from "@/components/root/LabCampaignCardSkeleton";
import { Search as SearchBar } from "./components/Search";

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
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <SearchBar onSearch={setSearchQuery} placeholder="Search by campaign or lab..." />
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full sm:w-[200px] rounded-full shadow-md border-border/50">
                            <SelectValue placeholder="Campaign Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="HEALTH_CAMP">Health Camp</SelectItem>
                            <SelectItem value="HOME_COLLECTION_DRIVE">Home Collection Drive</SelectItem>
                            <SelectItem value="DISCOUNTED_TESTS">Discounted Tests</SelectItem>
                            <SelectItem value="COMMUNITY_SCREENING">Community Screening</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

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
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                        if (
                                            totalPages <= 7 ||
                                            p === 1 ||
                                            p === totalPages ||
                                            (p >= page - 1 && p <= page + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={p}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={page === p}
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(p); }}
                                                    >
                                                        {p}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (
                                            (p === page - 2 && page > 3) ||
                                            (p === page + 2 && page < totalPages - 2)
                                        ) {
                                            return (
                                                <PaginationItem key={p}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                    <FlaskConical className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No active lab campaigns found</h3>
                    <p className="text-muted-foreground mt-1">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    );
}
