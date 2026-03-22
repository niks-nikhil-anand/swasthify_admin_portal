import { Skeleton } from "@/components/ui/skeleton";

export const LabCampaignCardSkeleton = () => {
    return (
        <div className="h-full block pt-[60px] md:pt-[75px]">
            <div className="relative bg-[#F8F9F9] dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 shadow-sm w-full h-full flex flex-col pb-4 md:pb-6">
                
                {/* Top Header Shape Container */}
                <div className="absolute top-0 left-0 w-full h-[180px] pointer-events-none z-0">
                    <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" className="text-zinc-200 dark:text-zinc-900 rounded-t-[2.5rem]">
                        <path d="M0,0 L400,0 L400,60 Q200,240 0,60 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Profile Avatar Sticking Out of Top */}
                <div className="absolute top-[-60px] md:top-[-75px] left-1/2 -translate-x-1/2 z-10 w-[120px] h-[120px] md:w-[150px] md:h-[150px]">
                    <Skeleton className="w-full h-full rounded-full border-[8px] md:border-8 border-[#F8F9F9] dark:border-zinc-950 bg-zinc-300 dark:bg-zinc-800" />
                </div>

                {/* Specialization Pill */}
                <div className="absolute top-[138px] left-1/2 -translate-x-1/2 z-20">
                    <Skeleton className="w-24 h-6 rounded-full bg-zinc-300 dark:bg-zinc-800 border-[4px] border-[#F8F9F9] dark:border-zinc-950" />
                </div>

                <div className="relative z-10 pt-[180px] flex flex-col items-center flex-1 w-full">
                    {/* Lab / Campaign Name */}
                    <div className="text-center px-4 md:px-6 w-full flex flex-col items-center">
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>

                    {/* Divider line */}
                    <div className="w-full px-4 lg:px-8 mt-7 mb-5">
                        <div className="w-full h-[1px] bg-zinc-200/60 dark:bg-zinc-800" />
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between w-full px-2 lg:px-8 text-center">
                        <div className="flex flex-col flex-1 items-center space-y-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="w-[1px] h-12 bg-zinc-200/60 dark:bg-zinc-800" />
                        <div className="flex flex-col flex-1 items-center space-y-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="w-[1px] h-12 bg-zinc-200/60 dark:bg-zinc-800" />
                        <div className="flex flex-col flex-1 items-center space-y-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 lg:gap-3 w-full px-2 lg:px-4 mt-8 md:mt-10">
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-20 rounded-full" />
                    </div>

                    {/* Bottom CTA block */}
                    <div className="w-full px-2 lg:px-6 pt-8 mt-auto">
                        <Skeleton className="w-full h-[65px] md:h-[75px] rounded-[18px] md:rounded-[20px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
