"use client";

import DoctorProfileForm from "@/components/doctor/DoctorProfileForm";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and clinic details.</p>
                </div>
            </div>

            <DoctorProfileForm />
        </div >
    );
}