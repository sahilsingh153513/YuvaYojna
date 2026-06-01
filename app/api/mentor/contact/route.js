import { NextResponse } from 'next/server';
import connectdb from '@/config/ConnectDb';
import Meeting from '@/model/meeting';
import Mentor from '@/model/mentor';

function defaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

function calculateEndTime(startTime = '17:00', duration = 30) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endMinutes = hours * 60 + minutes + Number(duration);
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
}

export async function POST(request) {
  try {
    await connectdb();

    const body = await request.json();
    const {
      mentorId,
      studentName,
      studentEmail,
      subject,
      message,
      preferredContactMethod,
      scheduledDate,
      startTime = '17:00',
      duration = 30,
    } = body;

    if (!mentorId || !studentName || !studentEmail || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    const meeting = await Meeting.create({
      title: subject,
      description: message,
      mentorId,
      userId: studentEmail,
      studentName,
      studentEmail,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : defaultDate(),
      startTime,
      endTime: calculateEndTime(startTime, duration),
      duration: Number(duration),
      meetingType: preferredContactMethod === 'phone' ? 'phone' : 'video',
      requestMessage: message,
      hourlyRate: mentor.hourlyRate,
      status: 'pending',
    });

    return NextResponse.json(
      {
        message: 'Meeting request sent successfully',
        contactId: meeting._id.toString(),
        status: meeting.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact mentor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectdb();

    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const status = searchParams.get('status');

    const query = {};
    if (mentorId) query.mentorId = mentorId;
    if (status) query.status = status;

    const messages = await Meeting.find(query)
      .populate('mentorId', 'firstName lastName email company position')
      .sort({ createdAt: -1 });

    return NextResponse.json({ messages, total: messages.length });
  } catch (error) {
    console.error('Get contact messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectdb();

    const { messageId, status, mentorResponse } = await request.json();

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      messageId,
      {
        ...(status ? { status } : {}),
        ...(mentorResponse ? { mentorNotes: mentorResponse } : {}),
      },
      { new: true }
    );

    if (!meeting) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Message updated successfully',
      contactMessage: meeting,
    });
  } catch (error) {
    console.error('Update contact message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
