"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCampaignModal } from "./CreateCampaignModal";

export function CreateCampaign({ disabled = false }: { disabled?: boolean }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsCreateModalOpen(true)} disabled={disabled}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
            </Button>

            <CreateCampaignModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </>
    );
}
