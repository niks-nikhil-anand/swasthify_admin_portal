"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const CampaignLoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50/30 font-sans">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                {/* Back Button Skeleton */}
                <div className="mb-6">
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mobile Lab Profile Header Skeleton (lg:hidden) */}
                        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-4 lg:hidden">
                            <Skeleton className="w-24 h-24 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48 mx-auto" />
                                <div className="flex gap-2 justify-center">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                        </div>

                        {/* Title Section Skeleton */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 w-full">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    </div>
                                    <Skeleton className="h-10 w-3/4" />
                                </div>
                                <Skeleton className="h-9 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                        </div>

                        {/* Metrics Skeleton */}
                        <div className="grid grid-cols-1 gap-4">
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-5 flex items-start gap-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Schedule & Timing Skeleton */}
                        <Card className="shadow-sm border-muted">
                            <div className="p-4 border-b">
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-12 w-48 rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Skeleton */}
                        <Card className="shadow-sm border-muted">
                            <div className="p-4 border-b">
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-10 w-40" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-0 shadow-lg ring-1 ring-black/5 overflow-hidden">
                                <Skeleton className="h-24 w-full" />
                                <CardContent className="relative pt-0 px-6 pb-6 text-center -mt-12">
                                    <Skeleton className="w-24 h-24 mx-auto rounded-full border-4 border-white mb-4" />
                                    <div className="space-y-2 mb-6">
                                        <Skeleton className="h-6 w-3/4 mx-auto" />
                                        <div className="flex gap-2 justify-center">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-16" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <Skeleton className="h-16 rounded-xl" />
                                        <Skeleton className="h-16 rounded-xl" />
                                    </div>
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
