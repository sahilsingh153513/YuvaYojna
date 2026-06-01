import yuserRegisterSchema from "@/model/yuserRegister";
import connectdb from "@/config/ConnectDb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectdb();

  try {
    const { email, password } = await req.json();
    const finduser = await yuserRegisterSchema.findOne({ email });

    if (!finduser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!finduser.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, finduser.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ✅ No token creation – just return success message and user info
    return NextResponse.json(
      { message: "Login success", user: finduser },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
