import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { UserValidation } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input using Zod schema
    const validation = UserValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check for existing user
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.phone ? [{ phone: data.phone }] : []),
        ],
      },
    });

    if (existingUser) {
        if (existingUser.email === data.email) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }
        if (data.phone && existingUser.phone === data.phone) {
            return NextResponse.json(
                { error: "User with this phone number already exists" },
                { status: 409 }
            );
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone || null,
        role: data.role,
        status: true, // Default active
        isVerified: false, // Public registration might require verification
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
