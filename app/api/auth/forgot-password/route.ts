import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Verify User Exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Explicitly return an error so the frontend can notify the user
      return NextResponse.json({ error: "This email is not registered with us." }, { status: 404 });
    }

    // 2. Generate 6-Digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // Valid for 15 mins

    // 3. Save to Database (using your existing VerificationToken model)
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: { identifier: email, token: otp, expires },
    });

    // 4. Send Premium HTML Email
    await resend.emails.send({
      from: 'Ferixo Security <alerts@ferixo.in>', 
      to: email,
      subject: '🔐 Your Ferixo Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #0A1A2F; margin: 0;">Ferixo Security</h1>
          </div>
          <div style="background-color: #f4f4f5; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <h2 style="margin-top: 0; color: #0A1A2F;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555;">We received a request to reset the password for your Ferixo account. Use the secure OTP below to proceed:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; margin: 30px 0; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #888;">This code will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}