"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCampaignModal } from "./CreateCampaignModal";

interface CreateCampaignProps {
    onSuccess?: () => void;
}

export function CreateCampaign({ onSuccess }: CreateCampaignProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
            </Button>

            <CreateCampaignModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={onSuccess}
            />
        </>
    );
}
