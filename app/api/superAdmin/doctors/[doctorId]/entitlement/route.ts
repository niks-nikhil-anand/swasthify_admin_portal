import { NextResponse } from "next/server";
import { getDoctorCampaignEntitlement } from "@/lib/doctor-package-entitlement";
export async function GET(_request: Request, { params }: { params: Promise<{ doctorId: string }> }) { try { return NextResponse.json(await getDoctorCampaignEntitlement((await params).doctorId)); } catch { return NextResponse.json({ error: "Unable to load campaign entitlement" }, { status: 500 }); } }
