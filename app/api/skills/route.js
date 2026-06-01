import connectdb from "@/config/ConnectDb";
import UserProfile from "@/model/userProfile";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    await connectdb();

    const body = await request.json();
    console.log('Received profile data:', body);

    // Flatten personalInfo
    const profileData = {
      fullName: body.personalInfo?.fullName,
      email: body.personalInfo?.email,
      phone: body.personalInfo?.phone,
      address: body.personalInfo?.address,
      photo: body.personalInfo?.photo || null,

      skills: body.skills || [],
      workExperience: body.workExperience || [],
      education: body.education || [],
      certifications: body.certifications || []
    };

    const userProfile = await UserProfile.findOneAndUpdate(
      { email: profileData.email },
      profileData,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        message: 'Profile created successfully',
        profile: userProfile.profileSummary,
        id: userProfile._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating profile:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    await connectdb();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skill = searchParams.get('skill');
    const company = searchParams.get('company');
    const email = searchParams.get('email');
    
    let query = { isActive: true };
    
    // Add filters if provided
    if (skill) {
      query['skills.skillName'] = { $regex: skill, $options: 'i' };
    }
    
    if (company) {
      query['workExperience.company'] = { $regex: company, $options: 'i' };
    }

    if (email) {
      query.email = email.toLowerCase();
    }
    
    const skip = (page - 1) * limit;
    
    const profiles = await UserProfile.find(query)
      .select('fullName email skills workExperience profileCompleteness createdAt')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await UserProfile.countDocuments(query);
    
    return NextResponse.json({
      profiles,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: profiles.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



// export async function GET(request, { params }) {
//   try {
//     await connectDB();
    
//     const { id } = params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: 'Invalid profile ID' },
//         { status: 400 }
//       );
//     }
    
//     const profile = await UserProfile.findById(id);
    
//     if (!profile) {
//       return NextResponse.json(
//         { error: 'Profile not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({ profile });

//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(request, { params }) {
  try {
    await connectdb();
    
    const { id } = params;
    const body = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid profile ID' },
        { status: 400 }
      );
    }
    
    const profile = await UserProfile.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: profile.profileSummary
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectdb();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid profile ID' },
        { status: 400 }
      );
    }
    
    // Soft delete by setting isActive to false
    const profile = await UserProfile.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



// export async function GET(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const query = searchParams.get('q');
//     const skillLevel = searchParams.get('skillLevel');
//     const minExperience = searchParams.get('minExperience');
//     const location = searchParams.get('location');
    
//     let searchQuery = { isActive: true };
    
//     // Text search across multiple fields
//     if (query) {
//       searchQuery.$or = [
//         { fullName: { $regex: query, $options: 'i' } },
//         { 'skills.skillName': { $regex: query, $options: 'i' } },
//         { 'workExperience.company': { $regex: query, $options: 'i' } },
//         { 'workExperience.jobTitle': { $regex: query, $options: 'i' } }
//       ];
//     }
    
//     // Filter by skill level
//     if (skillLevel) {
//       searchQuery['skills.proficiencyLevel'] = skillLevel;
//     }
    
//     // Filter by minimum experience
//     if (minExperience) {
//       searchQuery['skills.yearsOfExperience'] = { $gte: parseInt(minExperience) };
//     }
    
//     // Filter by location
//     if (location) {
//       searchQuery.$or = [
//         ...(searchQuery.$or || []),
//         { address: { $regex: location, $options: 'i' } },
//         { 'workExperience.location': { $regex: location, $options: 'i' } }
//       ];
//     }
    
//     const profiles = await UserProfile.find(searchQuery)
//       .select('fullName email skills workExperience address profileCompleteness')
//       .limit(20)
//       .sort({ profileCompleteness: -1 });
    
//     return NextResponse.json({
//       profiles,
//       count: profiles.length
//     });

//   } catch (error) {
//     console.error('Error searching profiles:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// File: pages/api/user-profile/stats.js - Analytics endpoint
// import connectDB from '../../../lib/mongodb';
// import UserProfile from '../../../models/UserProfile';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     await connectDB();
    
//     // Get various statistics
//     const totalProfiles = await UserProfile.countDocuments({ isActive: true });
    
//     const skillsStats = await UserProfile.aggregate([
//       { $match: { isActive: true } },
//       { $unwind: '$skills' },
//       {
//         $group: {
//           _id: '$skills.skillName',
//           count: { $sum: 1 },
//           avgExperience: { $avg: '$skills.yearsOfExperience' }
//         }
//       },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ]);
    
//     const companiesStats = await UserProfile.aggregate([
//       { $match: { isActive: true } },
//       { $unwind: '$workExperience' },
//       {
//         $group: {
//           _id: '$workExperience.company',
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ]);
    
//     const proficiencyDistribution = await UserProfile.aggregate([
//       { $match: { isActive: true } },
//       { $unwind: '$skills' },
//       {
//         $group: {
//           _id: '$skills.proficiencyLevel',
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     return NextResponse.json({
//       totalProfiles,
//       topSkills: skillsStats,
//       topCompanies: companiesStats,
//       skillProficiencyDistribution: proficiencyDistribution
//     });

//   } catch (error) {
//     console.error('Error fetching stats:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
