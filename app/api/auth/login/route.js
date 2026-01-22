import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with process.env in production

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, mobile, password, role, otp } = body;

    console.log("Login request received:", { email, mobile, role, hasOtp: !!otp });

    // 1. Basic Validation
    // Require email/mobile AND role. Also require EITHER password OR otp.
    if ((!email && !mobile) || (!password && !otp) || !role) {
      console.log("Login failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Find User
    let user;
    if (email) {
      user = await db.user.findUnique({
        where: { email },
      });
    } else if (mobile) {
      user = await db.user.findUnique({
        where: { phone: mobile },
      });
    }

    if (!user) {
      console.log("Login failed: User not found");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2.1 Check Status
    if (user.status !== "ACTIVE") {
      console.log(`Login failed: User status is ${user.status}`);
      return NextResponse.json(
        { error: "Your account is not active. Please contact support." },
        { status: 403 }
      );
    }

    // 3. Verify Credentials (Password or OTP)
    if (body.otp) {
      // --- OTP Verification Mode ---
      if (!user.loginOtp || !user.otpExpiry) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 401 }
        );
      }

      if (new Date() > user.otpExpiry) {
        return NextResponse.json(
          { error: "OTP has expired" },
          { status: 401 }
        );
      }

      const isOtpValid = await bcrypt.compare(body.otp, user.loginOtp);

      if (!isOtpValid) {
        return NextResponse.json(
          { error: "Invalid OTP" },
          { status: 401 }
        );
      }

      // Clear OTP after successful use
      await db.user.update({
        where: { id: user.id },
        data: { loginOtp: null, otpExpiry: null }
      });

    } else {
      // --- Password Verification Mode ---
      if (!user.password) {
        console.log("Login failed: User has no password set");
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("Login failed: Invalid password");
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    // 4. Check Role Match (Normalization)
    // Map input role to Prisma Enum if necessary, or just compare string case-insensitively
    // Prisma Roles: SUPER_ADMIN, ADMIN, DOCTOR, PATIENT, LAB, PHARMACY

    // Normalize input role to upper case for comparison
    const inputRoleUpper = role.toUpperCase();
    // Normalize DB role
    const dbRoleUpper = user.role.toUpperCase();

    // Mapping user-friendly terms to DB roles if needed
    // e.g. "superAdmin" -> "SUPER_ADMIN"
    let normalizedInputRole = inputRoleUpper;
    if (inputRoleUpper === "SUPERADMIN") normalizedInputRole = "SUPER_ADMIN";

    console.log(`Role Check: Input=${role} (Normalized=${normalizedInputRole}), DB=${user.role} (Normalized=${dbRoleUpper})`);

    if (dbRoleUpper !== normalizedInputRole) {
      console.log("Login failed: Role mismatch");
      return NextResponse.json(
        { error: "Unauthorized for this role" },
        { status: 403 }
      );
    }

    // 5. Generate JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      email: user.email
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // 6. Set Cookie
    let cookieName = "token"; // Default
    if (normalizedInputRole === "SUPER_ADMIN") {
      cookieName = "SUPER_ADMIN";
    } else if (normalizedInputRole === "PATIENT") {
      cookieName = "PATIENT";
    } else if (normalizedInputRole === "DOCTOR") {
      cookieName = "DOCTOR";
    }

    console.log(`Setting cookie: ${cookieName}`);

    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    console.log("Login successful found user:", user.email);

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
