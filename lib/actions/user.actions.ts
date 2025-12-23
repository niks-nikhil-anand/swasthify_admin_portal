"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const whereClause: any = {
        email: data.email
    };

    if (data.phone) {
        whereClause['OR'] = [
            { email: data.email },
            { phone: data.phone }
        ];
        delete whereClause.email; // OR covers it
    }

    // Actually, cleaner way:
    const existingUser = await db.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                data.phone ? { phone: data.phone } : {}
            ]
        }
    });

    if (existingUser) {
        if (existingUser.email === data.email) {
            return { error: "User with this email already exists" };
        }
        if (data.phone && existingUser.phone === data.phone) {
            return { error: "User with this phone number already exists" };
        }
    }

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone || null,
        role: data.role,
        isVerified: true, // Auto verify admins/doctors created by SuperAdmin
        status: true,
      },
    });

    revalidatePath("/superAdmin/userManagement/users");
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
