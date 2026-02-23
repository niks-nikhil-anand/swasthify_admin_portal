"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Heart, Award, Activity, Save, Loader2, Thermometer, Ruler, Droplets, AlertCircle, Stethoscope, Contact, UserPlus, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          dateOfBirth: data.user.patient?.dateOfBirth ? new Date(data.user.patient.dateOfBirth).toISOString().split('T')[0] : "",
          gender: data.user.patient?.gender || "",
          bloodGroup: data.user.patient?.bloodGroup || "",
          height: data.user.patient?.height || "",
          weight: data.user.patient?.weight || "",
          allergies: data.user.patient?.allergies || "",
          chronicDiseases: data.user.patient?.chronicDiseases || "",
          emergencyContactName: data.user.patient?.emergencyContactName || "",
          emergencyContactPhone: data.user.patient?.emergencyContactPhone || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const cleanedData = Object.entries(formData).reduce((acc: any, [key, value]) => {
      // For string fields, convert empty strings to null
      if (typeof value === "string") {
        acc[key] = value.trim() === "" ? null : value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    try {
      const response = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cleanedData,
          height: cleanedData.height ? parseFloat(cleanedData.height) : null,
          weight: cleanedData.weight ? parseFloat(cleanedData.weight) : null,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        await fetchUser();
        setIsEditModalOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Internal server error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "profile");

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { url } = await uploadRes.json();

      const updateRes = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: url }),
      });

      if (updateRes.ok) {
        toast.success("Profile picture updated");
        await fetchUser();
      } else {
        throw new Error("Failed to update profile with image URL");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

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

  const patient = user?.patient;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-background border border-border/50 rounded-3xl p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative">
          <div className="relative group cursor-pointer">
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <label htmlFor="profile-upload" className="cursor-pointer">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-xl overflow-hidden relative transition-all group-hover:brightness-75">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <User className="h-16 w-16 opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                      <Camera className="h-8 w-8 text-primary/40" />
                    </div>
                  </div>
                )}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity bg-black/20",
                  user?.profilePic ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>
            </label>
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
                <Phone className="h-3.5 w-3.5" /> {user?.phone || "+91 98765 43210"}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                  Edit Profile
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile Information</DialogTitle>
                  <DialogDescription>
                    Update your personal and health-related information here.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(val) => handleSelectChange("gender", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select value={formData.bloodGroup} onValueChange={(val) => handleSelectChange("bloodGroup", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" name="height" type="number" step="0.1" value={formData.height} onChange={handleInputChange} placeholder="175" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" name="weight" type="number" step="0.1" value={formData.weight} onChange={handleInputChange} placeholder="70" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input id="allergies" name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="None" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chronicDiseases">Chronic Diseases</Label>
                      <Input id="chronicDiseases" name="chronicDiseases" value={formData.chronicDiseases} onChange={handleInputChange} placeholder="None" />
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-background border border-border/50 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1 pb-3 border-b border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</span>
              <p className="text-sm font-bold text-foreground">{user?.name || "Not set"}</p>
            </div>
            <div className="space-y-1 pb-3 border-b border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date of Birth</span>
              <p className="text-sm font-bold text-foreground">
                {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not set"}
              </p>
            </div>
            <div className="space-y-1 pb-3 border-b border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</span>
              <p className="text-sm font-bold text-foreground capitalize">{patient?.gender?.toLowerCase() || "Not set"}</p>
            </div>
            <div className="space-y-1 pb-3 border-b border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blood Group</span>
              <p className="text-sm font-bold text-red-500">{patient?.bloodGroup || "Not set"}</p>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="bg-background border border-border/50 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5 text-primary" /> Health Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex items-center gap-4 pb-3 border-b border-border/40">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Ruler className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Height</span>
                <p className="text-sm font-bold text-foreground">{patient?.height ? `${patient.height} cm` : "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-3 border-b border-border/40">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weight</span>
                <p className="text-sm font-bold text-foreground">{patient?.weight ? `${patient.weight} kg` : "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-3 border-b border-border/40">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allergies</span>
                <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{patient?.allergies || "None"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-3 border-b border-border/40">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-purple-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diseases</span>
                <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{patient?.chronicDiseases || "None"}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
