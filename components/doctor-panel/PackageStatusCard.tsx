"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PackageResponse = { subscription: { package: { name: string }; status: string; isPriceOverride: boolean; monthlyPrice: string | number; currency: string; freePeriodEndsAt: string | null; currentPeriodEnd: string } | null };

export function PackageStatusCard() {
  const [data, setData] = useState<PackageResponse | null>(null);

  useEffect(() => { fetch("/api/doctor-panel/package").then((response) => response.ok ? response.json() : null).then(setData).catch(() => setData(null)); }, []);
  const subscription = data?.subscription;

  if (!subscription) return <Card className="border-dashed border-primary/30 bg-primary/5"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary"><CreditCard className="h-5 w-5" /></div><div><p className="font-semibold">Package assignment pending</p><p className="text-sm text-muted-foreground">Your administrator will assign a package to your account.</p></div></div><Button asChild variant="outline" size="sm"><Link href="/doctor-panel/package">View package</Link></Button></CardContent></Card>;

  const trial = subscription.status === "TRIAL" && subscription.freePeriodEndsAt;
  return <Card className="overflow-hidden border-primary/20 bg-linear-to-r from-primary/10 via-background to-background"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><div className="h-10 w-10 shrink-0 rounded-xl bg-primary p-2.5 text-primary-foreground shadow-md shadow-primary/20"><Sparkles className="h-5 w-5" /></div><div><div className="flex items-center gap-2"><p className="font-semibold">{subscription.package.name}</p><Badge variant="secondary">{subscription.status.replace("_", " ")}</Badge></div><p className="text-sm text-muted-foreground">{trial ? `Free access until ${new Date(subscription.freePeriodEndsAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}</p></div></div><Button asChild variant="ghost" size="sm" className="text-primary"><Link href="/doctor-panel/package">Manage package <ArrowRight className="ml-1 h-4 w-4" /></Link></Button></CardContent></Card>;
}
