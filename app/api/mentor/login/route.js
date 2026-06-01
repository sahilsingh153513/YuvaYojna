import { NextResponse } from 'next/server';
import connectdb from '@/config/ConnectDb';
import Mentor from '@/model/mentor';

export async function POST(request) {
  try {
    await connectdb();
    
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find mentor by email
    const mentor = await Mentor.findOne({ email, isActive: true });
    if (!mentor) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await mentor.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        mentor: {
          id: mentor._id.toString(),
          _id: mentor._id.toString(),
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          email: mentor.email,
          phone: mentor.phone,
          company: mentor.company,
          position: mentor.position,
          experience: mentor.experience,
          expertise: mentor.expertise,
          location: mentor.location,
          bio: mentor.bio,
          linkedin: mentor.linkedin,
          website: mentor.website,
          availability: mentor.availability,
          languages: mentor.languages,
          hourlyRate: mentor.hourlyRate,
          timezone: mentor.timezone,
          rating: mentor.rating,
          totalSessions: mentor.totalSessions,
          isOnline: mentor.isOnline,
          isVerified: mentor.isVerified,
          isActive: mentor.isActive,
          createdAt: mentor.createdAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
