import { NextResponse } from "next/server";
import connectdb from '@/config/ConnectDb';
import Meeting from "@/model/meeting";
import "@/model/mentor";

export async function GET(request, { params }) {
  try {
    await connectdb();

    const { mentorId: routeMentorId } = await params;
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId') || routeMentorId;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    let query = {};
    
    if (mentorId) {
      query.mentorId = mentorId;
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const meetings = await Meeting.find(query)
      .populate('mentorId', 'firstName lastName email phone company position')
      .sort({ scheduledDate: 1, startTime: 1 });
    
    return NextResponse.json({
      success: true,
      meetings
    });
    
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}
