"use client";

import LabProfileForm from "@/components/lab/LabProfileForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Profile</h1>
          <p className="text-muted-foreground">Manage lab details and documents.</p>
        </div>
      </div>

      <LabProfileForm />
    </div>
  );
}