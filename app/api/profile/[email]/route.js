import { NextResponse } from "next/server";
import YuserRegister from "@/model/yuserRegister";
// import Mentor from '@/model/mentor';
import connectdb from "@/config/ConnectDb";

export async function GET(request, { params }) {
  await connectdb();

  const { email: emailParam } = await params;
  if (!emailParam) {
    return NextResponse.json({ message: "Email not provided" }, { status: 400 });
  }

  try {
    const email = decodeURIComponent(emailParam.toLowerCase());
    const user = await YuserRegister.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 });
    }

    const userCredentials = {
      provider: user.provider || "credentials",
      isVerified: user.isVerified || false,
      userToken: user.userToken || null,
    };
    const userProfile = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      provider: user.provider,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      userProfile,
      userCredentials,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
