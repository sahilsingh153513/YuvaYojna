import { NextResponse } from 'next/server';
import connectdb from '@/config/ConnectDb';
import Mentor from '@/model/mentor';

export async function POST(request) {
  try {
    await connectdb();
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      company,
      position,
      experience,
      expertise,
      location,
      bio,
      linkedin,
      website,
      availability,
      languages,
      hourlyRate,
      timezone
    } = body;

    // Validation
    // if (!firstName || !lastName || !email || !password || !phone || !company || !position || !experience || !expertise || !location || !bio || !hourlyRate) {
    //   return NextResponse.json(
    //     { error: 'All required fields must be provided' },
    //     { status: 400 }
    //   );
    // }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return NextResponse.json(
        { error: 'Mentor with this email already exists' },
        { status: 409 }
      );
    }

    // Create new mentor
    const mentor = new Mentor({
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      position,
      experience,
      expertise: Array.isArray(expertise) ? expertise : [expertise],
      location,
      bio,
      linkedin: linkedin || '',
      website: website || '',
      availability: availability || 'Flexible',
      languages: Array.isArray(languages) ? languages : [languages || 'English'],
      hourlyRate: parseInt(hourlyRate),
      timezone: timezone || 'IST (India Standard Time)'
    });

    await mentor.save();

    return NextResponse.json(
      {
        message: 'Mentor registered successfully',
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
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Mentor with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
