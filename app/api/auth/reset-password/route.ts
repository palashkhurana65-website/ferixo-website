import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; 

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    // 1. Verify OTP
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: otp },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // 2. Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update User Data
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // 4. Burn the OTP so it can't be reused
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset Error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}