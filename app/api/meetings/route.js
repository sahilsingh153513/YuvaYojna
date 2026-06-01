import { NextResponse } from 'next/server';
import connectdb from '@/config/ConnectDb';
import Meeting from '@/model/meeting';
import Mentor from '@/model/mentor';

// GET - Fetch meetings for a user or mentor
export async function GET(request) {
  try {
    await connectdb();
    
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const userId = searchParams.get('userId');
    const studentEmail = searchParams.get('studentEmail');
    const status = searchParams.get('status');
    
    let query = {};
    
    if (mentorId) {
      query.mentorId = mentorId;
    }
    
    if (userId && studentEmail) {
      query.$or = [
        { userId },
        { studentEmail: studentEmail.toLowerCase() }
      ];
    } else if (userId) {
      query.userId = userId;
    } else if (studentEmail) {
      query.studentEmail = studentEmail.toLowerCase();
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

// POST - Create a new meeting request
export async function POST(request) {
  try {
    await connectdb();
    
    const body = await request.json();
    const {
      mentorId,
      userId,
      scheduledDate,
      startTime,
      duration,
      meetingType,
      requestMessage,
      title,
      studentName,
      studentEmail
    } = body;
    
    // Validation
    if (!mentorId || !userId || !scheduledDate || !startTime || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicateRequest = await Meeting.findOne({
      mentorId,
      createdAt: { $gte: oneDayAgo },
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { userId },
        ...(studentEmail ? [{ studentEmail: studentEmail.toLowerCase() }] : [])
      ]
    });

    if (duplicateRequest) {
      return NextResponse.json(
        { error: 'Session already requested. Try one day after.' },
        { status: 429 }
      );
    }
    
    // Calculate end time
    const startTimeMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endTimeMinutes = startTimeMinutes + parseInt(duration);
    const endTimeHours = Math.floor(endTimeMinutes / 60);
    const endTimeMins = endTimeMinutes % 60;
    const endTime = `${endTimeHours.toString().padStart(2, '0')}:${endTimeMins.toString().padStart(2, '0')}`;
    
    // Check for conflicting meetings
    const conflictingMeeting = await Meeting.findOne({
      mentorId,
      scheduledDate: new Date(scheduledDate),
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });
    
    if (conflictingMeeting) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      );
    }
    
    // Create meeting
    const meeting = new Meeting({
      title: title || `Meeting with ${mentor.firstName} ${mentor.lastName}`,
      mentorId,
      userId,
      scheduledDate: new Date(scheduledDate),
      startTime,
      endTime,
      duration: parseInt(duration),
      meetingType: meetingType || 'video',
      requestMessage,
      studentName,
      studentEmail,
      hourlyRate: mentor.hourlyRate,
      status: 'pending'
    });
    
    await meeting.save();
    
    // Populate mentor data for response
    await meeting.populate('mentorId', 'firstName lastName email phone company position');
    
    return NextResponse.json({
      success: true,
      message: 'Meeting request sent successfully',
      meeting
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting request' },
      { status: 500 }
    );
  }
}

// PUT - Update meeting status or details
export async function PUT(request) {
  try {
    await connectdb();
    
    const body = await request.json();
    const { meetingId, status, mentorNotes, userNotes, meetingLink, meetingLocation } = body;
    
    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }
    
    const updateData = {};
    if (status) updateData.status = status;
    if (mentorNotes) updateData.mentorNotes = mentorNotes;
    if (userNotes) updateData.userNotes = userNotes;
    if (meetingLink) updateData.meetingLink = meetingLink;
    if (status === 'confirmed' && !meetingLink) {
      updateData.meetingLink = `/video-call/${meetingId}`;
    }
    if (meetingLocation) updateData.meetingLocation = meetingLocation;
    
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      updateData,
      { new: true }
    ).populate('mentorId', 'firstName lastName email phone company position');
    
    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Meeting updated successfully',
      meeting
    });
    
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel a meeting
export async function DELETE(request) {
  try {
    await connectdb();
    
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');
    
    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }
    
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Meeting cancelled successfully'
    });
    
  } catch (error) {
    console.error('Error cancelling meeting:', error);
    return NextResponse.json(
      { error: 'Failed to cancel meeting' },
      { status: 500 }
    );
  }
}
