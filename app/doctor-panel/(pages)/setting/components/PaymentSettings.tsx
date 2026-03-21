"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BadgeCheck, Building2, CreditCard, Landmark, Loader2, UserCircle, Pencil, AlertTriangle } from "lucide-react";

interface PaymentDetails {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
}

interface PaymentSettingsProps {
    bankDetails: PaymentDetails;
    setBankDetails: (details: PaymentDetails) => void;
    handleBankDetailsUpdate: () => Promise<void>;
    saving: boolean;
}

export function PaymentSettings({ bankDetails, setBankDetails, handleBankDetailsUpdate, saving }: PaymentSettingsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onSave = async () => {
        await handleBankDetailsUpdate();
        setIsDialogOpen(false);
    };

    return (
        <Card className="border-none shadow-sm bg-muted/30 overflow-hidden relative">
            <div className="h-2 bg-linear-to-r from-primary to-blue-400 absolute top-0 left-0 right-0 w-full" />
            <CardHeader className="pt-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-1.5 flex-1">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Landmark className="h-6 w-6 text-primary" />
                            Bank Account Details
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground w-full">
                            Securely manage your bank information for direct appointment payouts.
                        </CardDescription>
                        <div className="mt-5 flex items-start gap-3 text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 max-w-3xl">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                                <strong>Important Disclaimer:</strong> Please ensure your bank details are accurate. Payouts routed to incorrect accounts are irreversible and Swasthify is not liable for lost funds.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-4 shrink-0 mt-1 shadow-xs">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-xs font-bold border border-green-500/20">
                            <BadgeCheck className="h-4 w-4" />
                            Secure Connection
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2 relative group overflow-hidden border-primary/20 hover:border-primary/50 transition-all rounded-xl h-10 px-5 bg-background">
                                    <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <Pencil className="h-4 w-4 relative z-10 text-primary" />
                                    <span className="relative z-10 font-semibold">Edit Details</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px] p-6 rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl flex items-center gap-2">
                                        <Landmark className="h-5 w-5 text-primary" />
                                        Update Bank Details
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Modify your bank account information. These details will be used for all future transaction settlements.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2.5">
                                            <Label htmlFor="bankName" className="flex items-center gap-2 text-foreground/80 font-semibold text-sm">
                                                <Building2 className="h-4 w-4 text-muted-foreground" /> Bank Name
                                            </Label>
                                            <Input
                                                id="bankName"
                                                placeholder="e.g. HDFC Bank"
                                                value={bankDetails.bankName}
                                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/40 border-border/60 focus-visible:bg-background transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="accountHolder" className="flex items-center gap-2 text-foreground/80 font-semibold text-sm">
                                                <UserCircle className="h-4 w-4 text-muted-foreground" /> Account Holder Name
                                            </Label>
                                            <Input
                                                id="accountHolder"
                                                placeholder="Enter name as per records"
                                                value={bankDetails.accountHolderName}
                                                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/40 border-border/60 focus-visible:bg-background transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="accountNumber" className="flex items-center gap-2 text-foreground/80 font-semibold text-sm">
                                                <CreditCard className="h-4 w-4 text-muted-foreground" /> Account Number
                                            </Label>
                                            <Input
                                                id="accountNumber"
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                value={bankDetails.accountNumber}
                                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/40 border-border/60 focus-visible:bg-background transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="ifsc" className="flex items-center gap-2 text-foreground/80 font-semibold text-sm">
                                                <BadgeCheck className="h-4 w-4 text-muted-foreground" /> IFSC Code
                                            </Label>
                                            <Input
                                                id="ifsc"
                                                placeholder="e.g. HDFC0001234"
                                                value={bankDetails.ifscCode}
                                                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                                                className="h-11 rounded-xl bg-muted/40 border-border/60 focus-visible:bg-background transition-all uppercase font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3 border-t">
                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={saving} className="rounded-xl h-11 px-5">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={onSave}
                                            disabled={saving}
                                            className="h-11 px-8 rounded-xl shadow-lg shadow-primary/25 bg-linear-to-r from-primary to-primary/90 hover:to-primary transition-all font-semibold"
                                        >
                                            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Details"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-background rounded-2xl border border-border/50 shadow-xs relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="space-y-2 relative z-10">
                        <span className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 opacity-70" /> Bank Name
                        </span>
                        <div className="font-semibold text-foreground text-lg">
                            {bankDetails.bankName || <span className="text-muted-foreground/50 italic text-base font-normal">Not Provided</span>}
                        </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                        <span className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase flex items-center gap-2">
                            <UserCircle className="h-3.5 w-3.5 opacity-70" /> Account Holder
                        </span>
                        <div className="font-semibold text-foreground text-lg">
                            {bankDetails.accountHolderName || <span className="text-muted-foreground/50 italic text-base font-normal">Not Provided</span>}
                        </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                        <span className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5 opacity-70" /> Account Number
                        </span>
                        <div className="font-semibold text-foreground text-lg font-mono tracking-wider">
                            {bankDetails.accountNumber ? `•••• ${bankDetails.accountNumber.slice(-4)}` : <span className="text-muted-foreground/50 italic font-sans tracking-normal text-base font-normal">Not Provided</span>}
                        </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                        <span className="text-[11px] text-muted-foreground font-bold tracking-widest uppercase flex items-center gap-2">
                            <BadgeCheck className="h-3.5 w-3.5 opacity-70" /> IFSC Code
                        </span>
                        <div className="font-semibold text-foreground text-lg font-mono tracking-wider">
                            {bankDetails.ifscCode || <span className="text-muted-foreground/50 italic font-sans tracking-normal text-base font-normal">Not Provided</span>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
