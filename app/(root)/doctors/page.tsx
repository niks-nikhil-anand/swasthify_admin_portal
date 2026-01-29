"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
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
import { CampaignCard, Campaign } from "./components/CampaignCard";
import { CampaignCardSkeleton } from "./components/CampaignCardSkeleton";

const SPECIALIZATIONS = [
    { id: "ALL", label: "All Specializations" },
    { id: "general_physician", label: "General Physician" },
    { id: "cardiologist", label: "Cardiologist" },
    { id: "dermatologist", label: "Dermatologist" },
    { id: "pediatrician", label: "Pediatrician" },
    { id: "neurologist", label: "Neurologist" },
    { id: "orthopedist", label: "Orthopedist" },
    { id: "gynecologist", label: "Gynecologist" },
    { id: "dentist", label: "Dentist" },
    { id: "ent", label: "ENT Specialist" },
    { id: "psychiatrist", label: "Psychiatrist" },
    { id: "ophthalmologist", label: "Ophthalmologist" },
    { id: "urologist", label: "Urologist" },
];

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
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Find Healthcare Campaigns
                </h1>
                <p className="text-lg text-muted-foreground">
                    Discover active health camps, free checkups, and specialized OPD sessions from verified doctors near you.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full max-w-md p-2 bg-background border border-border/50 rounded-full shadow-xl shadow-primary/5 flex items-center gap-2 focus-within:ring-2 ring-primary/20 transition-all">
                    <div className="pl-4 text-muted-foreground">
                        <Search className="w-5 h-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search by campaign or doctor..."
                        className="border-0 shadow-none focus-visible:ring-0 px-2 h-10 text-base bg-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button className="rounded-full px-6 h-10 shadow-lg" onClick={fetchCampaigns}>Search</Button>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                        <SelectTrigger className="w-full sm:w-[200px] rounded-full shadow-md border-border/50">
                            <SelectValue placeholder="Specialization" />
                        </SelectTrigger>
                        <SelectContent>
                            {SPECIALIZATIONS.map((spec) => (
                                <SelectItem key={spec.id} value={spec.id}>
                                    {spec.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full sm:w-[180px] rounded-full shadow-md border-border/50">
                            <SelectValue placeholder="Campaign Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="OPD">OPD</SelectItem>
                            <SelectItem value="HEALTH_CAMP">Health Camp</SelectItem>
                            <SelectItem value="FREE_CHECKUP">Free Checkup</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <CampaignCardSkeleton key={i} />
                    ))}
                </div>
            ) : campaigns.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
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
                                        // Simple pagination logic: show all pages if total <= 7
                                        // Otherwise we'd need more complex logic with ellipsis
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
                    <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No active campaigns found</h3>
                    <p className="text-muted-foreground mt-1">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    );
}