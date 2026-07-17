"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export type DoctorPackage = {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: string | number;
  currency: string;
  isFree: boolean;
  isDefault: boolean;
  isActive: boolean;
  benefits: unknown;
  limits: unknown;
  _count?: { subscriptions: number };
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPackage?: DoctorPackage | null;
  onSaved: () => void;
};

const initialState = { name: "", description: "", monthlyPrice: "0", currency: "INR", isFree: false, isActive: true, campaignLimit: "" };

export function DoctorPackageModal({ open, onOpenChange, initialPackage, onSaved }: Props) {
  const [form, setForm] = useState(initialState);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefit, setBenefit] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const limits = initialPackage?.limits && typeof initialPackage.limits === "object" && !Array.isArray(initialPackage.limits)
      ? initialPackage.limits as Record<string, unknown> : {};
    setForm(initialPackage ? {
      name: initialPackage.name,
      description: initialPackage.description || "",
      monthlyPrice: String(initialPackage.monthlyPrice),
      currency: initialPackage.currency,
      isFree: initialPackage.isFree,
      isActive: initialPackage.isActive,
      campaignLimit: typeof limits.campaignsPerMonth === "number" ? String(limits.campaignsPerMonth) : "",
    } : initialState);
    setBenefits(Array.isArray(initialPackage?.benefits) ? initialPackage.benefits.filter((item): item is string => typeof item === "string") : []);
    setBenefit("");
  }, [open, initialPackage]);

  const addBenefit = () => {
    const value = benefit.trim();
    if (value && !benefits.includes(value)) setBenefits((current) => [...current, value]);
    setBenefit("");
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Enter a package name");
    if (!form.isFree && (!form.monthlyPrice || Number(form.monthlyPrice) < 0)) return toast.error("Enter a valid monthly price");
    setSaving(true);
    try {
      const response = await fetch(initialPackage ? `/api/superAdmin/doctor-packages/${initialPackage.id}` : "/api/superAdmin/doctor-packages", {
        method: initialPackage ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlyPrice: form.isFree ? 0 : Number(form.monthlyPrice),
          benefits,
          limits: form.campaignLimit ? { campaignsPerMonth: Number(form.campaignLimit) } : {},
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      toast.success(initialPackage ? "Doctor package updated" : "Doctor package created");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save package");
    } finally {
      setSaving(false);
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-2xl">
      <DialogHeader>
        <DialogTitle>{initialPackage ? "Edit doctor package" : "Create doctor package"}</DialogTitle>
        <DialogDescription>Package price edits apply to future assignments and renewals; existing subscriptions retain their price snapshot.</DialogDescription>
      </DialogHeader>
      <div className="space-y-5 py-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="package-name">Package name</Label><Input id="package-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Professional" /></div>
          <div className="space-y-2"><Label htmlFor="campaign-limit">Campaigns per month</Label><Input id="campaign-limit" min="0" type="number" value={form.campaignLimit} onChange={(e) => setForm({ ...form, campaignLimit: e.target.value })} placeholder="Unlimited" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="package-price">Monthly price</Label><Input id="package-price" disabled={form.isFree} min="0" step="0.01" type="number" value={form.isFree ? "0" : form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="package-currency">Currency</Label><select id="package-currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"><option value="INR">INR — Indian Rupee</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — Pound Sterling</option></select></div>
        </div>
        <div className="space-y-2"><Label htmlFor="package-description">Description</Label><Textarea id="package-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A short description shown to administrators and doctors." /></div>
        <div className="space-y-2"><Label>Benefits</Label><div className="flex gap-2"><Input value={benefit} onChange={(e) => setBenefit(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBenefit(); } }} placeholder="e.g. Priority support" /><Button type="button" variant="outline" size="icon" onClick={addBenefit}><Plus className="h-4 w-4" /></Button></div><div className="flex flex-wrap gap-2">{benefits.map((item) => <Badge key={item} variant="secondary" className="gap-1 py-1">{item}<button type="button" onClick={() => setBenefits((current) => current.filter((value) => value !== item))} aria-label={`Remove ${item}`}><X className="h-3 w-3" /></button></Badge>)}</div></div>
        <div className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2"><div className="flex items-center justify-between gap-4"><div><Label htmlFor="free-package">Free package</Label><p className="text-xs text-muted-foreground">No monthly payment is due.</p></div><Switch id="free-package" checked={form.isFree} onCheckedChange={(isFree) => setForm({ ...form, isFree })} /></div><div className="flex items-center justify-between gap-4"><div><Label htmlFor="active-package">Available for assignment</Label><p className="text-xs text-muted-foreground">Inactive packages remain in history.</p></div><Switch id="active-package" checked={form.isActive} onCheckedChange={(isActive) => setForm({ ...form, isActive })} /></div></div>
      </div>
      <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{initialPackage ? "Save changes" : "Create package"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
