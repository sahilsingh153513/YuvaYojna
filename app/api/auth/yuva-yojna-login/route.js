import connectdb from "@/config/ConnectDb";
import YuserRegister from "@/model/yuserRegister";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export async function POST(request) {
  try {
    await connectdb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "Please enter email and password" },
        { status: 400 }
      );
    }

    const user = await YuserRegister.findOne({ email: email.toLowerCase() });

    if (!user || user.provider === "google") {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isVerified) {
      return Response.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.userToken) {
      user.userToken = crypto.randomUUID();
      await user.save();
    }

    return Response.json({
      message: "Login success",
      data: {
        userToken: user.userToken,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error("Yuva Yojna login error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
