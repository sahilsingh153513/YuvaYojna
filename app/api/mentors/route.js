import { NextResponse } from 'next/server';
import connectdb from '@/config/ConnectDb';
import Mentor from '@/model/mentor';

export async function GET(request) {
  try {
    await connectdb();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const expertise = searchParams.get('expertise')?.trim() || '';
    const experience = searchParams.get('experience')?.trim() || '';
    const availability = searchParams.get('availability')?.trim() || '';
    const maxRate = Number(searchParams.get('maxRate') || 0);
    const sortBy = searchParams.get('sortBy') || 'rating';
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit')) || 12, 1), 30);

    // Build filter query
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (expertise) {
      filter.expertise = { $in: [expertise] };
    }

    if (experience) {
      filter.experience = experience;
    }

    if (availability) {
      filter.availability = availability;
    }

    if (maxRate > 0) {
      filter.hourlyRate = { $lte: maxRate };
    }

    const sortOptions = {
      rating: { rating: -1, totalSessions: -1, createdAt: -1 },
      sessions: { totalSessions: -1, rating: -1 },
      newest: { createdAt: -1 },
      'price-low': { hourlyRate: 1, rating: -1 },
      'price-high': { hourlyRate: -1, rating: -1 },
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    const [mentors, total, facets] = await Promise.all([
      Mentor.find(filter)
        .select('-password')
        .sort(sortOptions[sortBy] || sortOptions.rating)
        .skip(skip)
        .limit(limit)
        .lean(),
      Mentor.countDocuments(filter),
      Mentor.aggregate([
        { $match: { isActive: true } },
        {
          $facet: {
            expertise: [
              { $unwind: '$expertise' },
              { $group: { _id: '$expertise', count: { $sum: 1 } } },
              { $sort: { count: -1, _id: 1 } },
              { $limit: 20 },
            ],
            experience: [
              { $group: { _id: '$experience', count: { $sum: 1 } } },
              { $sort: { _id: 1 } },
            ],
            availability: [
              { $group: { _id: '$availability', count: { $sum: 1 } } },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      mentors: mentors.map(mentor => ({
        id: mentor._id.toString(),
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        phone: mentor.phone,
        company: mentor.company,
        position: mentor.position,
        title: mentor.position,
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
        responseTime: mentor.isOnline ? 'a few hours' : '1-2 days',
        createdAt: mentor.createdAt
      })),
      filters: {
        expertise: facets[0]?.expertise?.filter(item => item._id) || [],
        experience: facets[0]?.experience?.filter(item => item._id) || [],
        availability: facets[0]?.availability?.filter(item => item._id) || [],
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalMentors: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Fetch mentors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
