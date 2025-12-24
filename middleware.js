import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const cookieHeader = req.headers.get('cookie');
    const cookies = parse(cookieHeader || '');

    // Correcting cookie assignments based on typically expected keys (though user prompt had them swapped, plan said to fix them)
    // User Prompt: const superAdminAuthToken = cookies.SUPER_ADMIN;
    // const doctorAuthToken = cookies.PATIENT; // This looked wrong
    // const patientAuthToken = cookies.DOCTOR // This looked wrong

    // Correct logic:
    const superAdminAuthToken = cookies.SUPER_ADMIN;
    const doctorAuthToken = cookies.DOCTOR;
    const patientAuthToken = cookies.PATIENT;

    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Define protected routes
    const isSuperAdminRoute = pathname.startsWith("/superAdmin");
    const isDoctorRoute = pathname.startsWith("/doctor-panel");
    const isPatientRoute = pathname.startsWith("/me");

    // Define auth routes (where logged-in users shouldn't go)
    const isSuperAdminAuthRoute = pathname === "/auth/superAdmin";
    const isDoctorAuthRoute = pathname === "/auth/doctor";
    const isPatientAuthRoute = pathname === "/login" || pathname === "/register";

    // --- Protection Logic ---

    // 1. Super Admin Protection
    if (isSuperAdminRoute && !superAdminAuthToken) {
        return NextResponse.redirect(new URL("/auth/superAdmin", req.nextUrl.origin));
    }
    // Redirect if already logged in as Super Admin
    if (isSuperAdminAuthRoute && superAdminAuthToken) {
        return NextResponse.redirect(new URL("/superAdmin", req.nextUrl.origin));
    }

    // 2. Doctor Protection
    if (isDoctorRoute && !doctorAuthToken) {
        return NextResponse.redirect(new URL("/auth/doctor", req.nextUrl.origin));
    }
    // Redirect if already logged in as Doctor
    if (isDoctorAuthRoute && doctorAuthToken) {
        return NextResponse.redirect(new URL("/doctor-panel", req.nextUrl.origin));
    }

    // 3. Patient Protection
    if (isPatientRoute && !patientAuthToken) {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    // Redirect if already logged in as Patient
    if (isPatientAuthRoute && patientAuthToken) {
        return NextResponse.redirect(new URL("/me", req.nextUrl.origin)); // Assuming /me or home /
    }

    return NextResponse.next();
}
