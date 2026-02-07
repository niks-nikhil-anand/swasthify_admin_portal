"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search as SearchBar } from "./Search";

interface LabFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
}

export const LabFilters: React.FC<LabFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedType,
    onTypeChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar onSearch={onSearchChange} placeholder="Search by campaign or lab..." />
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Select value={selectedType} onValueChange={onTypeChange}>
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
    );
};
