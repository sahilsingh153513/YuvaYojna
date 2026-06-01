import { NextResponse } from 'next/server';
import connectdb from '@/config/ConnectDb';
import Mentor from '@/model/mentor';

// GET - Fetch mentor profile
export async function GET(request) {
  try {
    await connectdb();
    
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    
    if (!mentorId) {
      return NextResponse.json(
        { error: 'Mentor ID is required' },
        { status: 400 }
      );
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      mentor: {
        id: mentor._id,
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
        createdAt: mentor.createdAt,
        updatedAt: mentor.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update mentor profile
export async function PUT(request) {
  try {
    await connectdb();
    
    const body = await request.json();
    const {
      mentorId,
      firstName,
      lastName,
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

    if (!mentorId) {
      return NextResponse.json(
        { error: 'Mentor ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (company) updateData.company = company;
    if (position) updateData.position = position;
    if (experience) updateData.experience = experience;
    if (expertise) updateData.expertise = Array.isArray(expertise) ? expertise : [expertise];
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (website !== undefined) updateData.website = website;
    if (availability) updateData.availability = availability;
    if (languages) updateData.languages = Array.isArray(languages) ? languages : [languages];
    if (hourlyRate) updateData.hourlyRate = parseInt(hourlyRate);
    if (timezone) updateData.timezone = timezone;

    const mentor = await Mentor.findByIdAndUpdate(
      mentorId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      mentor: {
        id: mentor._id,
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
        createdAt: mentor.createdAt,
        updatedAt: mentor.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}