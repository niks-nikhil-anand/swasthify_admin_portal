"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CampaignNotFound = () => {
    return (
        <div className="container mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Campaign Not Found</h2>
            <p className="text-muted-foreground mt-2">The campaign you are looking for may have ended or been removed.</p>
            <Button className="mt-6" variant="outline" asChild>
                <Link href="/labs">Browse Lab Campaigns</Link>
            </Button>
        </div>
    );
};
