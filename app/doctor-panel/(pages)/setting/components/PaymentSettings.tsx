"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Building2, CreditCard, Landmark, Loader2, UserCircle } from "lucide-react";

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
    return (
        <Card className="border-none shadow-sm bg-muted/30 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-primary to-blue-400" />
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary" />
                        Bank Account Details
                    </CardTitle>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold border border-green-500/20">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Secure Connection
                    </div>
                </div>
                <CardDescription>
                    Securely manage your bank information for direct appointment payouts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="bankName" className="flex items-center gap-2 text-foreground/80">
                            <Building2 className="h-3.5 w-3.5" /> Bank Name
                        </Label>
                        <Input
                            id="bankName"
                            placeholder="e.g. HDFC Bank"
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                            className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountHolder" className="flex items-center gap-2 text-foreground/80">
                            <UserCircle className="h-3.5 w-3.5" /> Account Holder Name
                        </Label>
                        <Input
                            id="accountHolder"
                            placeholder="Enter name as per records"
                            value={bankDetails.accountHolderName}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                            className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="flex items-center gap-2 text-foreground/80">
                            <CreditCard className="h-3.5 w-3.5" /> Account Number
                        </Label>
                        <Input
                            id="accountNumber"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ifsc" className="flex items-center gap-2 text-foreground/80">
                            <BadgeCheck className="h-3.5 w-3.5" /> IFSC Code
                        </Label>
                        <Input
                            id="ifsc"
                            placeholder="e.g. HDFC0001234"
                            value={bankDetails.ifscCode}
                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                            className="h-11 rounded-xl bg-background border-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-primary transition-all uppercase"
                        />
                    </div>
                </div>
                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleBankDetailsUpdate}
                        disabled={saving}
                        className="px-8 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-primary/80 hover:to-primary"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Payment Details"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
