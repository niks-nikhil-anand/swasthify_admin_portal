"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Heart, Award, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-muted/50 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-muted/50 rounded-2xl" />
          <div className="h-32 bg-muted/50 rounded-2xl" />
          <div className="h-32 bg-muted/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Health Score", value: "85", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { label: "Checkups", value: "12", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Rewards", value: "450", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-background border border-border/50 rounded-3xl p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative">
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-xl overflow-hidden">
              <User className="h-16 w-16" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 border-4 border-background" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{user?.name}</h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Platinum Member
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-semibold text-muted-foreground border border-border/50">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-semibold text-muted-foreground border border-border/50">
                <Phone className="h-3.5 w-3.5" /> +91 98765 43210
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <Activity className="h-4 w-4 text-muted-foreground opacity-30" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* More Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background border border-border/50 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Full Name</span>
              <span className="text-sm font-semibold">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Gender</span>
              <span className="text-sm font-semibold text-primary">Male</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Date of Birth</span>
              <span className="text-sm font-semibold">15 May, 1995</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <span className="text-sm text-muted-foreground">Blood Group</span>
              <span className="text-sm font-semibold text-red-500">O Positive (O+)</span>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border/50 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Primary Address
          </h3>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Plot No. 45, Sunshine Residency,<br />
              Near Green Park, HSR Layout Sector 2,<br />
              Bengaluru, Karnataka - 560102
            </p>
            <div className="pt-4">
              <button className="text-sm font-bold text-primary hover:underline underline-offset-4">
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
