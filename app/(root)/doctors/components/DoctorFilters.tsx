"use client";

import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search as SearchBar } from "./Search";

export const SORT_OPTIONS = [
    { id: "recommended", label: "Recommended" },
    { id: "newest", label: "Newest campaigns" },
    { id: "price_asc", label: "Price: low to high" },
    { id: "price_desc", label: "Price: high to low" },
    { id: "rating_desc", label: "Highest rated" },
    { id: "experience_desc", label: "Most experienced" },
];

interface DoctorFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedSpecialization: string;
    onSpecializationChange: (value: string) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedSpecialization,
    onSpecializationChange,
    selectedType,
    onTypeChange,
    sortBy,
    onSortChange,
}) => {
    const [specializations, setSpecializations] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        let active = true;
        fetch("/api/public/specializations?type=DOCTOR&limit=100")
            .then((response) => response.ok ? response.json() : [])
            .then((data) => { if (active) setSpecializations(data); })
            .catch(() => { if (active) setSpecializations([]); });
        return () => { active = false; };
    }, []);

    return (
        <div className="space-y-4 rounded-3xl border border-border/60 bg-background/60 p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">Find the right doctor</p>
                    <p className="text-xs text-muted-foreground">Search by doctor, campaign, or specialization</p>
                </div>
                <SearchBar value={searchQuery} onSearch={onSearchChange} placeholder="Search by doctor or campaign..." className="max-w-none lg:max-w-md" />
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Select value={selectedSpecialization} onValueChange={onSpecializationChange}>
                    <SelectTrigger aria-label="Filter by specialization" className="w-full rounded-full shadow-md border-border/50">
                        <SelectValue placeholder="Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Specializations</SelectItem>
                        {specializations.map((spec) => (
                            <SelectItem key={spec.id} value={spec.id}>
                                {spec.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={onTypeChange}>
                    <SelectTrigger aria-label="Filter by campaign type" className="w-full rounded-full shadow-md border-border/50">
                        <SelectValue placeholder="Campaign Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="OPD">OPD</SelectItem>
                        <SelectItem value="HEALTH_CAMP">Health Camp</SelectItem>
                        <SelectItem value="FREE_CHECKUP">Free Checkup</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger aria-label="Sort doctors" className="w-full rounded-full shadow-md border-border/50">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
