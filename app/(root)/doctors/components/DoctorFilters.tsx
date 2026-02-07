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

export const SPECIALIZATIONS = [
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

interface DoctorFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedSpecialization: string;
    onSpecializationChange: (value: string) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedSpecialization,
    onSpecializationChange,
    selectedType,
    onTypeChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar onSearch={onSearchChange} placeholder="Search by campaign or doctor..." />
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Select value={selectedSpecialization} onValueChange={onSpecializationChange}>
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

                <Select value={selectedType} onValueChange={onTypeChange}>
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
    );
};
