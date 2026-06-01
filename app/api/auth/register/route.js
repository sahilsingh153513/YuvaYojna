import connectdb from "@/config/ConnectDb";
import YuserRegister from "@/model/yuserRegister";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import nodemailer from "nodemailer";


const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const createVerificationCode = () => {
  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  return { code, codeHash };
};

const sendVerificationEmail = async ({ to, name, code }) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be set");
  }

  const configuredFrom = process.env.EMAIL_FROM;
  const from =
    configuredFrom &&
    !configuredFrom.includes("resend.dev") &&
    configuredFrom.includes(user)
      ? configuredFrom
      : `yuvaYojna <${user}>`;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Your yuvaYojna verification code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Welcome to yuvaYojna${name ? `, ${name}` : ""}</h2>
        <p>Use this code on the website to verify your email address:</p>
        <p style="font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #16a34a; margin: 20px 0;">
          ${code}
        </p>
        <p>This code will expire in 24 hours.</p>
        <p>If you did not create a yuvaYojna account, you can ignore this email.</p>
      </div>
    `,
  });
};

export async function POST(request) {
  try {
    await connectdb();

    const body = await request.json();
    const { fullName, email, phone, age, gender, password } = body;

    if (!fullName || !email || !phone || !gender || !password) {
      return Response.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return Response.json({ error: 'Please enter a valid phone number' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return Response.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    if (age && (age < 13 || age > 100)) {
      return Response.json({ error: 'Age must be between 13 and 100' }, { status: 400 });
    }

    const existingUser = await YuserRegister.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json({ error: 'An account with this email already exists' }, { status: 400 });
      }

      await YuserRegister.deleteOne({ _id: existingUser._id });
    }

    const { code, codeHash } = createVerificationCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new YuserRegister({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      age: age ? parseInt(age) : null,
      gender: gender.toLowerCase(),
      password: hashedPassword,
      provider: "credentials",
      userToken: crypto.randomUUID(),
      isVerified: false,
      emailVerificationToken: codeHash,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const savedUser = await newUser.save();

    try {
      await sendVerificationEmail({
        to: savedUser.email,
        name: savedUser.fullName,
        code,
      });
    } catch (error) {
      await YuserRegister.deleteOne({ _id: savedUser._id });
      throw error;
    }

    const userResponse = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      phone: savedUser.phone,
      age: savedUser.age,
      gender: savedUser.gender,
      provider: savedUser.provider,
      isVerified: savedUser.isVerified,
      createdAt: savedUser.createdAt
    };

    return Response.json({
      success: true,
      message: 'Account created successfully. Please enter the verification code sent to your email.',
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 400 });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json({ error: validationErrors.join(', ') }, { status: 400 });
    }

    return Response.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}
