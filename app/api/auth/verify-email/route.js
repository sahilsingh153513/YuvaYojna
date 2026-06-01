import connectdb from "@/config/ConnectDb";
import YuserRegister from "@/model/yuserRegister";
import crypto from "node:crypto";

export async function POST(request) {
  try {
    await connectdb();

    const { email, code } = await request.json();

    if (!email || !code) {
      return Response.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const codeHash = crypto.createHash("sha256").update(code.trim()).digest("hex");

    const user = await YuserRegister.findOne({
      email: email.toLowerCase().trim(),
      emailVerificationToken: codeHash,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { error: "Verification code is invalid or expired" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return Response.json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json(
      { error: "Unable to verify email. Please try again later." },
      { status: 500 }
    );
  }
}
