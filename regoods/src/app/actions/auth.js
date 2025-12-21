"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const nationality = formData.get("nationality");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!name || !email || !password || !confirmPassword) {
      return { error: "Please fill in all required fields." };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      nationality,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration validation error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
