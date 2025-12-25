"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

import { sendWelcomeNotice, sendResetPasswordEmail } from "@/lib/mail";
import crypto from "crypto";

export async function registerUser(formData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email")?.toLowerCase();
    const phone = formData.get("phone");
    const nationality = formData.get("nationality");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!name || !email || !password || !confirmPassword || !nationality || !phone) {
      return { error: "Please fill in all required fields." };
    }

    // Email Validation (Server-side)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Security Alert: Invalid email structure detected." };
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

    // ⚡ Check if email is already available in our DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Conflict: This email is already registered in our network." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      nationality,
      password: hashedPassword,
    });

    // ⚡ Send Welcome Notice Email
    try {
        await sendWelcomeNotice({
            to: email,
            name: name
        });
    } catch (mailErr) {
        console.error("Welcome email failed to dispatch:", mailErr);
        // We don't block registration if welcome email fails, but we log it
    }

    return { success: true };
  } catch (error) {
    console.error("Registration dispatch error:", error);
    return { error: "Protocol Error: Something went wrong. Please try again." };
  }
}

export async function requestPasswordReset(email) {
    try {
        if (!email) return { error: "Email is required." };
        
        await dbConnect();
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Security: Don't reveal if user exists
            return { success: true }; 
        }

        // Generate Token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();

        const resetUrl = `${process.env.NEXT_AUTH_URL || process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

        try {
            await sendResetPasswordEmail({
                to: user.email,
                name: user.name,
                resetUrl
            });
        } catch (mailErr) {
            console.error("Reset email failed:", mailErr);
            return { error: "Failed to dispatch recovery email. Please try again later." };
        }

        return { success: true };
    } catch (error) {
        console.error("Reset request error:", error);
        return { error: "System failure during recovery request." };
    }
}

export async function resetPassword(token, newPassword) {
    try {
        if (!token || !newPassword) return { error: "Missing required credentials." };

        // Password Complexity Check (Consistency with registration)
        if (newPassword.length < 8) {
            return { error: "Password must be at least 8 characters." };
        }
        const hasUpper = /[A-Z]/.test(newPassword);
        const hasLower = /[a-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
            return { error: "Password does not meet complexity requirements." };
        }

        await dbConnect();

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return { error: "Security Alert: Token is invalid or has expired." };
        }

        // Update Password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Reset execution error:", error);
        return { error: "Failed to update security credentials." };
    }
}
