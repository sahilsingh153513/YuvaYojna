'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  X,
  MessageCircle
} from 'lucide-react';
import TranslatedText from '@/app/language/page';
import ContactMentorModal from '@/components/ContactMentorModal';
import MentorChatModal from '@/components/MentorChatModal';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

const UserDashboard = () => {
  const { theme } = useDaisyTheme();
  
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [meetingData, setMeetingData] = useState({
    date: '',
    time: '',
    duration: '30',
    meetingType: 'video',
    message: ''
  });

  // Mock mentor data
  const mockMentors = [
    {
      id: 1,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0123',
      company: 'TechCorp Solutions',
      position: 'Senior Software Engineer',
      experience: '5-10 years',
      expertise: ['React', 'Node.js', 'AWS', 'JavaScript'],
      location: 'San Francisco, CA',
      bio: 'Experienced full-stack developer with expertise in modern web technologies. Passionate about mentoring junior developers and helping them grow in their careers.',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      website: 'https://sarahjohnson.dev',
      availability: 'Evenings',
      languages: ['English', 'Spanish'],
      hourlyRate: 75,
      timezone: 'PST',
      rating: 4.8,
      totalSessions: 150,
      isOnline: true
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phone: '+1-555-0456',
      company: 'DataFlow Inc',
      position: 'Data Science Lead',
      experience: '10+ years',
      expertise: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      location: 'New York, NY',
      bio: 'Data science expert with 10+ years of experience in machine learning and AI. I love helping others understand complex data concepts and build their careers in data science.',
      linkedin: 'https://linkedin.com/in/michaelchen',
      website: 'https://michaelchen.ai',
      availability: 'Weekends',
      languages: ['English', 'Mandarin'],
      hourlyRate: 90,
      timezone: 'EST',
      rating: 4.9,
      totalSessions: 200,
      isOnline: false
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1-555-0789',
      company: 'DesignStudio Pro',
      position: 'UX/UI Design Director',
      experience: '5-10 years',
      expertise: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      location: 'Austin, TX',
      bio: 'Creative UX/UI designer with a passion for creating user-centered designs. I enjoy mentoring designers and helping them develop their creative skills.',
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      website: 'https://emilyrodriguez.design',
      availability: 'Flexible',
      languages: ['English', 'Spanish'],
      hourlyRate: 65,
      timezone: 'CST',
      rating: 4.7,
      totalSessions: 120,
      isOnline: true
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Kim',
      email: 'david.kim@example.com',
      phone: '+1-555-0321',
      company: 'CloudTech Solutions',
      position: 'DevOps Engineer',
      experience: '5-10 years',
      expertise: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      location: 'Seattle, WA',
      bio: 'DevOps specialist with extensive experience in cloud infrastructure and automation. I love helping developers understand DevOps practices and cloud technologies.',
      linkedin: 'https://linkedin.com/in/davidkim',
      website: 'https://davidkim.cloud',
      availability: 'Mornings',
      languages: ['English', 'Korean'],
      hourlyRate: 80,
      timezone: 'PST',
      rating: 4.6,
      totalSessions: 95,
      isOnline: true
    },
    {
      id: 5,
      firstName: 'Lisa',
      lastName: 'Wang',
      email: 'lisa.wang@example.com',
      phone: '+1-555-0654',
      company: 'MobileFirst Apps',
      position: 'Mobile App Developer',
      experience: '3-5 years',
      expertise: ['React Native', 'iOS', 'Android', 'Flutter'],
      location: 'Los Angeles, CA',
      bio: 'Mobile app developer specializing in cross-platform development. I enjoy mentoring developers who want to enter the mobile development space.',
      linkedin: 'https://linkedin.com/in/lisawang',
      website: 'https://lisawang.mobile',
      availability: 'Evenings',
      languages: ['English', 'Chinese'],
      hourlyRate: 70,
      timezone: 'PST',
      rating: 4.5,
      totalSessions: 80,
      isOnline: false
    }
  ];

  const expertiseOptions = [
    'React', 'Node.js', 'Python', 'JavaScript', 'AWS', 'Machine Learning',
    'SQL', 'TensorFlow', 'Figma', 'Adobe Creative Suite', 'User Research',
    'Prototyping', 'Docker', 'Kubernetes', 'CI/CD', 'React Native',
    'iOS', 'Android', 'Flutter', 'Vue.js', 'Angular', 'TypeScript'
  ];

  const experienceOptions = [
    '1-3 years', '3-5 years', '5-10 years', '10+ years'
  ];

  const availabilityOptions = [
    'Mornings', 'Afternoons', 'Evenings', 'Weekends', 'Flexible'
  ];

  useEffect(() => {
    setIsClient(true);
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors');
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors);
        setFilteredMentors(data.mentors);
      } else {
        // Fallback to mock data if API fails
        setMentors(mockMentors);
        setFilteredMentors(mockMentors);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Fallback to mock data
      setMentors(mockMentors);
      setFilteredMentors(mockMentors);
    }
  };

  useEffect(() => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor => 
        mentor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedExpertise) {
      filtered = filtered.filter(mentor => 
        mentor.expertise.includes(selectedExpertise)
      );
    }

    if (selectedExperience) {
      filtered = filtered.filter(mentor => 
        mentor.experience === selectedExperience
      );
    }

    if (selectedAvailability) {
      filtered = filtered.filter(mentor => 
        mentor.availability === selectedAvailability
      );
    }

    setFilteredMentors(filtered);
  }, [searchTerm, selectedExpertise, selectedExperience, selectedAvailability, mentors]);

  const handleScheduleMeeting = (mentor) => {
    setSelectedMentor(mentor);
    setShowMeetingModal(true);
  };

  const handleChatMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowChatModal(true);
  };

  const handleCloseModal = () => {
    setShowMeetingModal(false);
    setShowChatModal(false);
    setSelectedMentor(null);
    setMeetingData({
      date: '',
      time: '',
      duration: '30',
      meetingType: 'video',
      message: ''
    });
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor._id || selectedMentor.id,
          userId: 'user123', // In a real app, this would come from authentication
          scheduledDate: meetingData.date,
          startTime: meetingData.time,
          duration: parseInt(meetingData.duration),
          meetingType: meetingData.meetingType,
          requestMessage: meetingData.message,
          title: `Meeting with ${selectedMentor.firstName} ${selectedMentor.lastName}`
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Meeting request sent successfully!');
        handleCloseModal();
      } else {
        alert(data.error || 'Failed to send meeting request');
      }
    } catch (error) {
      console.error('Error sending meeting request:', error);
      alert('Failed to send meeting request. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedExpertise('');
    setSelectedExperience('');
    setSelectedAvailability('');
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200" data-theme={theme}>
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200" data-theme={theme}>
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                <TranslatedText>Find Your Mentor</TranslatedText>
              </h1>
              <p className="text-lg mt-2 text-base-content/70">
                <TranslatedText>Connect with experienced professionals and grow your career</TranslatedText>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/60" />
                  <input
                    type="text"
                    placeholder="Search mentors by name, company, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10 input-primary"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline btn-primary"
                suppressHydrationWarning
              >
                <Filter className="w-5 h-5 mr-2" />
                <TranslatedText>Filters</TranslatedText>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-base-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Expertise Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">
                        <TranslatedText>Expertise</TranslatedText>
                      </span>
                    </label>
                    <select
                      value={selectedExpertise}
                      onChange={(e) => setSelectedExpertise(e.target.value)}
                      className="select select-bordered select-primary w-full"
                      suppressHydrationWarning
                    >
                      <option value="">All Expertise</option>
                      {expertiseOptions.map(expertise => (
                        <option key={expertise} value={expertise}>{expertise}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">
                        <TranslatedText>Experience</TranslatedText>
                      </span>
                    </label>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="select select-bordered select-primary w-full"
                      suppressHydrationWarning
                    >
                      <option value="">All Experience</option>
                      {experienceOptions.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">
                        <TranslatedText>Availability</TranslatedText>
                      </span>
                    </label>
                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="select select-bordered select-primary w-full"
                      suppressHydrationWarning
                    >
                      <option value="">All Availability</option>
                      {availabilityOptions.map(avail => (
                        <option key={avail} value={avail}>{avail}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="btn btn-ghost btn-sm"
                  >
                    <TranslatedText>Clear All Filters</TranslatedText>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                {/* Mentor Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg font-bold">
                          {mentor.firstName[0]}{mentor.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-base-content">
                        {mentor.firstName} {mentor.lastName}
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {mentor.position} at {mentor.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${mentor.isOnline ? 'bg-success' : 'bg-base-300'}`}></div>
                    <span className="text-xs text-base-content/60">
                      {mentor.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Mentor Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-base-content/70">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mentor.location}
                  </div>
                  <div className="flex items-center text-sm text-base-content/70">
                    <Clock className="w-4 h-4 mr-2" />
                    {mentor.availability}
                  </div>
                  <div className="flex items-center text-sm text-base-content/70">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${mentor.hourlyRate}/hour
                  </div>
                  <div className="flex items-center text-sm text-base-content/70">
                    <Star className="w-4 h-4 mr-2" />
                    {mentor.rating} ({mentor.totalSessions} sessions)
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 3).map(skill => (
                      <div key={skill} className="badge badge-primary badge-sm">
                        {skill}
                      </div>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <div className="badge badge-neutral badge-sm">
                        +{mentor.expertise.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Preview */}
                <p className="text-sm text-base-content/70 mb-4">
                  {mentor.bio.length > 100 ? `${mentor.bio.substring(0, 100)}...` : mentor.bio}
                </p>

                {/* Action Buttons */}
                <div className="card-actions justify-between">
                  <button
                    onClick={() => handleChatMentor(mentor)}
                    className="btn btn-outline btn-primary btn-sm flex-1 mr-2"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <TranslatedText>Chat</TranslatedText>
                  </button>
                  <button
                    onClick={() => handleScheduleMeeting(mentor)}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <TranslatedText>Schedule Meeting</TranslatedText>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
            <h3 className="text-xl font-semibold mb-2 text-base-content">
              <TranslatedText>No mentors found</TranslatedText>
            </h3>
            <p className="text-base-content/60 mb-4">
              <TranslatedText>Try adjusting your search criteria or filters</TranslatedText>
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              <TranslatedText>Clear Filters</TranslatedText>
            </button>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedMentor && (
        <MentorChatModal
          mentor={selectedMentor}
          isOpen={showChatModal}
          onClose={handleCloseModal}
        />
      )}

      {/* Meeting Scheduling Modal */}
      {showMeetingModal && selectedMentor && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-xl font-bold mb-4">
              <TranslatedText>Schedule Meeting with {selectedMentor.firstName} {selectedMentor.lastName}</TranslatedText>
            </h3>

            <div className="text-center mb-6">
              <div className="avatar placeholder mb-3">
                <div className="bg-primary text-primary-content rounded-full w-16">
                  <span className="text-2xl font-bold">
                    {selectedMentor.firstName[0]}{selectedMentor.lastName[0]}
                  </span>
                </div>
              </div>
              <p className="text-sm text-base-content/70">
                {selectedMentor.position} at {selectedMentor.company}
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                ${selectedMentor.hourlyRate}/hour
              </p>
            </div>

            <form onSubmit={handleMeetingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">
                      <TranslatedText>Date</TranslatedText>
                    </span>
                  </label>
                  <input
                    type="date"
                    value={meetingData.date}
                    onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                    className="input input-bordered input-primary w-full"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">
                      <TranslatedText>Time</TranslatedText>
                    </span>
                  </label>
                  <input
                    type="time"
                    value={meetingData.time}
                    onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                    className="input input-bordered input-primary w-full"
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">
                      <TranslatedText>Duration</TranslatedText>
                    </span>
                  </label>
                  <select
                    value={meetingData.duration}
                    onChange={(e) => setMeetingData({...meetingData, duration: e.target.value})}
                    className="select select-bordered select-primary w-full"
                    suppressHydrationWarning
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">
                      <TranslatedText>Meeting Type</TranslatedText>
                    </span>
                  </label>
                  <select
                    value={meetingData.meetingType}
                    onChange={(e) => setMeetingData({...meetingData, meetingType: e.target.value})}
                    className="select select-bordered select-primary w-full"
                    suppressHydrationWarning
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    <TranslatedText>Message (Optional)</TranslatedText>
                  </span>
                </label>
                <textarea
                  value={meetingData.message}
                  onChange={(e) => setMeetingData({...meetingData, message: e.target.value})}
                  placeholder="Tell the mentor what you'd like to discuss..."
                  rows={3}
                  className="textarea textarea-bordered textarea-primary w-full"
                  suppressHydrationWarning
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  <TranslatedText>Send Meeting Request</TranslatedText>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;