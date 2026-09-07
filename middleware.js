import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    console.log("MIDDLEWARE HIT:", req.nextUrl.pathname);
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
    const labAuthToken = cookies.LAB;

    // Support for Authorization: Bearer <token> (primarily for mobile/API clients)
    let authHeaderToken = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        authHeaderToken = authHeader.substring(7);
    }

    const anyAuthToken = superAdminAuthToken || doctorAuthToken || patientAuthToken || labAuthToken || cookies.token || authHeaderToken;

    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Define auth routes (where logged-in users shouldn't go)
    const isSuperAdminAuthRoute = pathname === "/auth/superAdmin";
    const isDoctorAuthRoute = pathname === "/auth/doctor";
    const isPatientAuthRoute = pathname === "/login" || pathname === "/register";
    const isLabAuthRoute = pathname === "/auth/lab";

    // Define protected routes
    const isSuperAdminRoute = pathname.startsWith("/superAdmin");
    const isDoctorRoute = pathname.startsWith("/doctor-panel");
    const isPatientRoute = pathname.startsWith("/me");
    const isLabRoute = pathname.startsWith("/lab-panel");
    const isLabsRoute = pathname.startsWith("/labs");

    // --- Protection Logic ---

    // Doctor discovery is public. Authentication is required only when the
    // visitor enters a protected portal or completes a booking.
    if (isLabsRoute && !patientAuthToken) {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

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

    // 3. Patient/General Profile Protection
    if (isPatientRoute && !patientAuthToken) {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    // Redirect if already logged in as Patient
    if (isPatientAuthRoute && patientAuthToken) {
        const redirectUrl = req.nextUrl.searchParams.get("redirect");
        if (redirectUrl) {
            return NextResponse.redirect(new URL(redirectUrl, req.nextUrl.origin));
        }
        return NextResponse.redirect(new URL("/me", req.nextUrl.origin));
    }

    // 4. Lab Protection
    if (isLabRoute && !labAuthToken) {
        return NextResponse.redirect(new URL("/auth/lab", req.nextUrl.origin));
    }
    // Redirect if already logged in as Lab
    if (isLabAuthRoute && labAuthToken) {
        return NextResponse.redirect(new URL("/lab-panel", req.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - /api/* (API routes — must be publicly accessible for mobile app)
         * - /_next/static (Next.js static files)
         * - /_next/image (Next.js image optimization)
         * - /favicon.ico, /sitemap.xml, /robots.txt
         */
        '/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
