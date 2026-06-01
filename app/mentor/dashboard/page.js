'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Globe, 
  Linkedin,
  ExternalLink,
  Edit,
  GraduationCap,
  Star,
  Users,
  MessageCircle,
  Calendar,
  Video,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import TranslatedText from '@/app/language/page';

export default function MentorDashboard() {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        // Check if mentor data exists in localStorage
        const mentorData = localStorage.getItem('mentorData');
        if (mentorData) {
          const parsedData = JSON.parse(mentorData);
          setMentor(parsedData);
          // Fetch meeting requests for this mentor
          fetchMeetingRequests(parsedData.id || parsedData._id);
        } else {
          // If no data in localStorage, redirect to login
          router.push('/mentor/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, [router]);

  const fetchMeetingRequests = async (mentorId) => {
    try {
      const response = await fetch(`/api/meetings/${mentorId}`);
      const data = await response.json();
      console.log(data.meetings);
      if (data.success) {
        setMeetingRequests(data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meeting requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: requestId,
          status: 'confirmed',
          mentorNotes: 'Accepted by mentor',
          meetingLink: `/video-call/${requestId}`
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh meeting requests
        fetchMeetingRequests(mentor.id || mentor._id);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: requestId,
          status: 'cancelled',
          mentorNotes: 'Not available'
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh meeting requests
        fetchMeetingRequests(mentor.id || mentor._id);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#16A34A' }}></div>
          <p style={{ color: '#6B7280' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#16A34A' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 mr-3" style={{ color: '#16A34A' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
                <TranslatedText>Mentor Dashboard</TranslatedText>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/mentor/profile')}
                className="flex items-center px-4 py-2 rounded-lg border-2 transition-colors"
                style={{ 
                  borderColor: '#16A34A', 
                  color: '#16A34A',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F0FDF4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                <TranslatedText>Edit Profile</TranslatedText>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }}>
                <TranslatedText>Welcome back,</TranslatedText> {mentor.firstName}!
              </h2>
              <p className="text-lg" style={{ color: '#6B7280' }}>
                <TranslatedText>Ready to help students achieve their goals?</TranslatedText>
              </p>
            </div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#16A34A' }}>
              {mentor.firstName.charAt(0)}{mentor.lastName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Meeting Requests Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#1F2937' }}>
            <Users className="w-6 h-6 mr-3" style={{ color: '#16A34A' }} />
            <TranslatedText>Meeting Requests</TranslatedText>
          </h3>
          
          {requestsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#16A34A' }}></div>
              <p style={{ color: '#6B7280' }}>Loading meeting requests...</p>
            </div>
          ) : meetingRequests.length===0  ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
              <p className="text-lg" style={{ color: '#6B7280' }}>No pending meeting requests</p>
              <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>When students send you meeting requests, they will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetingRequests.map((request) => (
                <div
                  key={request._id}
                  className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
                    request.status === 'confirmed'
                      ? 'border-emerald-200'
                      : request.status === 'cancelled'
                        ? 'border-red-100'
                        : 'border-gray-200'
                  }`}
                >
                  <div className={`h-2 ${
                    request.status === 'confirmed'
                      ? 'bg-emerald-500'
                      : request.status === 'cancelled'
                        ? 'bg-red-400'
                        : 'bg-amber-400'
                  }`} />
                  <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-semibold" style={{ color: '#1F2937' }}>
                          {request.title}
                        </h4>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {request.status === 'confirmed' ? 'Accepted' : request.status === 'cancelled' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                        {request.requestMessage}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium" style={{ color: '#1F2937' }}>From:</span>
                          <span className="ml-2" style={{ color: '#6B7280' }}>
                            {request.studentName || request.studentEmail || request.userId}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: '#1F2937' }}>Preferred Date:</span>
                          <span className="ml-2" style={{ color: '#6B7280' }}>
                            {new Date(request.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: '#1F2937' }}>Time:</span>
                          <span className="ml-2" style={{ color: '#6B7280' }}>
                            {request.startTime} - {request.endTime}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: '#1F2937' }}>Duration:</span>
                          <span className="ml-2" style={{ color: '#6B7280' }}>
                            {request.duration} minutes
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="font-medium text-sm" style={{ color: '#1F2937' }}>Contact:</span>
                        <span className="ml-2 text-sm" style={{ color: '#6B7280' }}>{request.studentEmail || request.userId}</span>
                      </div>

                      {request.status === 'confirmed' && (
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                              <p className="font-semibold">Accepted. Student can now do video call on our platform.</p>
                              <p className="mt-1 text-emerald-700">
                                Share or open the platform room when the scheduled time starts.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {request.status === 'cancelled' && (
                        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                          <div className="flex items-start gap-3">
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                              <p className="font-semibold">Rejected</p>
                              <p className="mt-1">This request was declined and no video room is active.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                      {request.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </button>
                        </>
                      ) : request.status === 'confirmed' ? (
                        <a
                          href={request.meetingLink || `/video-call/${request._id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Open video call
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                          <XCircle className="mr-2 h-4 w-4" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1F2937' }}>
                <User className="w-5 h-5 mr-2" style={{ color: '#16A34A' }} />
                <TranslatedText>Profile Information</TranslatedText>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <Mail className="w-5 h-5 mr-3" style={{ color: '#16A34A' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Email</p>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{mentor.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <Phone className="w-5 h-5 mr-3" style={{ color: '#16A34A' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Phone</p>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{mentor.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <MapPin className="w-5 h-5 mr-3" style={{ color: '#16A34A' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Location</p>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{mentor.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <Briefcase className="w-5 h-5 mr-3" style={{ color: '#16A34A' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Experience</p>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{mentor.experience}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Bio */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1F2937' }}>
                <GraduationCap className="w-5 h-5 mr-2" style={{ color: '#16A34A' }} />
                <TranslatedText>Professional Bio</TranslatedText>
              </h3>
              <p className="leading-relaxed" style={{ color: '#6B7280' }}>{mentor.bio}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expertise Areas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1F2937' }}>
                <Star className="w-5 h-5 mr-2" style={{ color: '#16A34A' }} />
                <TranslatedText>Expertise Areas</TranslatedText>
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: '#16A34A' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Mentoring Preferences */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1F2937' }}>
                <Clock className="w-5 h-5 mr-2" style={{ color: '#16A34A' }} />
                <TranslatedText>Mentoring Preferences</TranslatedText>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <span className="font-medium" style={{ color: '#1F2937' }}>Availability</span>
                  <span style={{ color: '#6B7280' }}>{mentor.availability}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <span className="font-medium" style={{ color: '#1F2937' }}>Hourly Rate</span>
                  <span style={{ color: '#6B7280' }}>${mentor.hourlyRate}/hr</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <span className="font-medium" style={{ color: '#1F2937' }}>Timezone</span>
                  <span style={{ color: '#6B7280' }}>{mentor.timezone}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1F2937' }}>
                <Users className="w-5 h-5 mr-2" style={{ color: '#16A34A' }} />
                <TranslatedText>Quick Stats</TranslatedText>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <div className="text-2xl font-bold" style={{ color: '#16A34A' }}>0</div>
                  <div className="text-sm" style={{ color: '#6B7280' }}>Students</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                  <div className="text-2xl font-bold" style={{ color: '#16A34A' }}>0</div>
                  <div className="text-sm" style={{ color: '#6B7280' }}>Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
