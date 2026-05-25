import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and set to database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = new Date(resetPasswordExpire);
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #555;">You requested a password reset for your portfolio admin panel.</p>
          <p style="color: #555;">Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #10b981; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email. This link will expire in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(message);

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
