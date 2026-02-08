import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { UserValidation } from "@/lib/validators";
import { db as prisma } from "@/lib/db";
import { logAuthEvent } from "@/lib/auth-tracking";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate using the strict UserValidation schema
    const validationResult = UserValidation.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and patient in DB transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role,
        },
      });

      // If the user is a patient, create a Patient profile
      if (role === 'PATIENT') {
        await tx.patient.create({
          data: {
            userId: newUser.id,
            name: newUser.name, // Initialize with user's name
            // Other fields will be empty/default
          }
        });
      }

      return newUser;
    });

    const newUser = result;

    // Log sign-up event (don't await to avoid delaying response)
    logAuthEvent(newUser.id, "SIGN_UP");

    // Return success (exclude sensitive data)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
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
