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

    if (!name || !email || !password || !confirmPassword || !nationality || !phone) {
      return { error: "Please fill in all required fields." };
    }

    // Name Validation
    if (name.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
        return { error: "Legal name must be letters only and min 3 characters." };
    }

    // Nationality Validation
    if (nationality.trim().length < 3) {
        return { error: "Jurisdiction must be at least 3 characters." };
    }

    // Phone Validation
    if (!/^\+?[0-9\s-]{10,20}$/.test(phone)) {
        return { error: "Invalid phone number format (min 10 digits)." };
    }

    // Password Complexity
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        return { error: "Password does not meet complexity requirements." };
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
