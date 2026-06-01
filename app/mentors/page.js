"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  Clock,
  Filter,
  Globe,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  Star,
  UserRoundCheck,
  X,
  School2,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ContactMentorModal from "@/components/ContactMentorModal";

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "sessions", label: "Most sessions" },
  { value: "newest", label: "Newest mentors" },
  { value: "price-low", label: "Lowest rate" },
  { value: "price-high", label: "Highest rate" },
];

export default function MentorsPage() {
  const { data: authSession } = useSession();
  const [mentors, setMentors] = useState([]);
  const [filters, setFilters] = useState({ expertise: [], experience: [], availability: [] });
  const [pagination, setPagination] = useState({ currentPage: 1, totalMentors: 0, hasNext: false });
  const [query, setQuery] = useState({
    search: "",
    expertise: "",
    experience: "",
    availability: "",
    maxRate: "0",
    sortBy: "rating",
    page: 1,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [viewerRole, setViewerRole] = useState("guest");
  const [mentorProfile, setMentorProfile] = useState(null);
  const [studentUser, setStudentUser] = useState(null);
  const [studentSessions, setStudentSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const activeFilterCount = useMemo(
    () =>
      [query.expertise, query.experience, query.availability, query.maxRate !== "0" ? query.maxRate : ""].filter(Boolean)
        .length,
    [query]
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(query.search.trim()), 350);
    return () => clearTimeout(timeout);
  }, [query.search]);

  useEffect(() => {
    try {
      if (localStorage.getItem("mentorData")) {
        const parsedMentor = JSON.parse(localStorage.getItem("mentorData") || "{}");
        setMentorProfile(parsedMentor);
        setViewerRole("mentor");
      } else if (localStorage.getItem("yuvaToken") || localStorage.getItem("yuvaUser")) {
        const parsedUser = JSON.parse(localStorage.getItem("yuvaUser") || "{}");
        setStudentUser(parsedUser);
        setViewerRole("student");
      } else if (authSession?.user?.email) {
        setStudentUser({
          id: authSession.user.id || authSession.user.userToken || authSession.user.email,
          email: authSession.user.email,
          name: authSession.user.name || "",
        });
        setViewerRole("student");
      } else {
        setMentorProfile(null);
        setViewerRole("guest");
      }
    } catch (error) {
      console.error("Unable to detect viewer role:", error);
      setViewerRole("guest");
    }
  }, [authSession]);

  const fetchStudentSessions = useCallback(async () => {
    const studentId = studentUser?.id || authSession?.user?.id || authSession?.user?.userToken || studentUser?.email || authSession?.user?.email;
    const studentEmail = studentUser?.email || authSession?.user?.email;
    if ((!studentId && !studentEmail) || viewerRole !== "student") return;

    setIsLoadingSessions(true);
    try {
      const params = new URLSearchParams();
      if (studentId) params.set("userId", studentId);
      if (studentEmail) params.set("studentEmail", studentEmail);

      const response = await fetch(`/api/meetings?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Unable to load sessions:", data.error || response.statusText);
        setStudentSessions([]);
        return;
      }

      setStudentSessions(data.meetings || []);
    } catch (sessionError) {
      console.error("Unable to load student sessions:", sessionError);
      setStudentSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [authSession, studentUser, viewerRole]);

  useEffect(() => {
    fetchStudentSessions();
  }, [fetchStudentSessions]);

  const fetchMentors = useCallback(
    async ({ page = 1, append = false } = {}) => {
      append ? setIsLoadingMore(true) : setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
          sortBy: query.sortBy,
        });

        if (debouncedSearch) params.set("search", debouncedSearch);
        if (query.expertise) params.set("expertise", query.expertise);
        if (query.experience) params.set("experience", query.experience);
        if (query.availability) params.set("availability", query.availability);
        if (query.maxRate !== "0") params.set("maxRate", query.maxRate);

        const response = await fetch(`/api/mentors?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load mentors");
        }

        setMentors((current) => (append ? [...current, ...data.mentors] : data.mentors));
        setFilters(data.filters || { expertise: [], experience: [], availability: [] });
        setPagination(data.pagination || { currentPage: page, totalMentors: 0, hasNext: false });
      } catch (loadError) {
        setError(loadError.message || "Unable to load mentors");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedSearch, query.availability, query.experience, query.expertise, query.maxRate, query.sortBy]
  );

  useEffect(() => {
    fetchMentors({ page: 1 });
  }, [fetchMentors]);

  const updateQuery = (key, value) => {
    setQuery((current) => ({ ...current, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setQuery({
      search: "",
      expertise: "",
      experience: "",
      availability: "",
      maxRate: "0",
      sortBy: "rating",
      page: 1,
    });
  };

  const isMentorViewer = viewerRole === "mentor";
  const totalMentorCount = pagination.totalMentors || mentors.length;
  const sessionByMentorId = useMemo(() => {
    const sortedSessions = [...studentSessions].sort((a, b) => {
      const priority = { confirmed: 0, pending: 1, rescheduled: 2, cancelled: 3, completed: 4 };
      return (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
    });

    return sortedSessions.reduce((map, session) => {
      const mentorValue = session.mentorId;
      const mentorId = typeof mentorValue === "object" ? mentorValue?._id : mentorValue;
      if (mentorId && !map[String(mentorId)]) {
        map[String(mentorId)] = session;
      }
      return map;
    }, {});
  }, [studentSessions]);

  return (
    <div className="min-h-screen bg-[#f6fbf7] text-slate-950">
      <section className="relative overflow-hidden border-b border-emerald-100 bg-[#0f2e25] text-white">
        <div className="absolute inset-0">
          <img
            src="/mentor-onboarding.png"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071914] via-[#0f2e25]/95 to-[#0f2e25]/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 backdrop-blur">
                <Sparkles className="mr-2 h-4 w-4" />
                Mentor network
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
                {isMentorViewer ? "Explore the mentor network" : "Find the right mentor for your next step"}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/85">
                {isMentorViewer
                  ? "Browse other mentor profiles, see the skills available on Yuva Yojna, and keep your own mentor dashboard focused."
                  : "Search experienced professionals by skills, availability, language, and rate. Send a structured session request directly to their dashboard."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {viewerRole === "guest" && (
                  <Link
                    href="/mentor/register"
                    className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-600"
                  >
                    <School2 className="mr-2 h-5 w-5" />
                    Join as Mentor
                  </Link>
                )}
                {isMentorViewer && (
                  <Link
                    href="/mentor/dashboard"
                    className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-600"
                  >
                    <UserRoundCheck className="mr-2 h-5 w-5" />
                    Mentor Dashboard
                  </Link>
                )}
                <a
                  href="#mentor-list"
                  className="inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  Browse Mentors
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/15 bg-white/10 p-4 text-center shadow-2xl backdrop-blur">
              <Stat label="Mentors" value={totalMentorCount} />
              <Stat label="Skills" value={filters.expertise.length || 0} />
              <Stat label={isMentorViewer ? "Mode" : "Requests"} value={isMentorViewer ? "Browse" : "Live"} />
            </div>
          </div>
        </div>
      </section>

      <main id="mentor-list" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isMentorViewer && (
          <MentorProfilePanel mentor={mentorProfile} />
        )}

        {viewerRole === "student" && (
          <StudentSessionsPanel
            sessions={studentSessions}
            isLoading={isLoadingSessions}
          />
        )}

        <div className="mb-6 rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
              <input
                value={query.search}
                onChange={(event) => updateQuery("search", event.target.value)}
                placeholder="Search by name, company, role, or skill"
                className="w-full rounded-lg border border-emerald-100 bg-[#fbfffc] py-3 pl-10 pr-3 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              onClick={() => setShowFilters((current) => !current)}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-100 px-4 py-3 text-slate-700 hover:bg-emerald-50"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`ml-2 h-4 w-4 transition ${showFilters ? "rotate-180" : ""}`} />
            </button>

            <select
              value={query.sortBy}
              onChange={(event) => updateQuery("sortBy", event.target.value)}
              className="rounded-lg border border-emerald-100 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-emerald-100 pt-4 md:grid-cols-4">
              <FilterSelect
                label="Expertise"
                value={query.expertise}
                onChange={(value) => updateQuery("expertise", value)}
                options={filters.expertise}
              />
              <FilterSelect
                label="Experience"
                value={query.experience}
                onChange={(value) => updateQuery("experience", value)}
                options={filters.experience}
              />
              <FilterSelect
                label="Availability"
                value={query.availability}
                onChange={(value) => updateQuery("availability", value)}
                options={filters.availability}
              />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Max hourly rate
                </span>
                <select
                  value={query.maxRate}
                  onChange={(event) => updateQuery("maxRate", event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="0">Any rate</option>
                  <option value="500">Up to ₹500</option>
                  <option value="1000">Up to ₹1,000</option>
                  <option value="2000">Up to ₹2,000</option>
                  <option value="5000">Up to ₹5,000</option>
                </select>
              </label>

              <div className="md:col-span-4">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-950"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            {`Showing ${mentors.length} of ${totalMentorCount} mentors`}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center rounded-lg border border-emerald-100 bg-white py-20">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
          </div>
        ) : mentors.length === 0 ? (
          <div className="overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 md:p-12">
                <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  <School2 className="mr-2 h-4 w-4" />
                  Mentor onboarding open
                </div>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                  No mentors found yet
                </h2>
                <p className="mt-3 max-w-xl text-gray-600">
                  {isMentorViewer
                    ? "No matching mentors found for these filters. Clear filters to browse the full mentor network."
                    : "Be the first mentor on Yuva Yojna. Create your mentor profile, add expertise, and students will be able to request sessions from this page."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {viewerRole === "guest" && (
                    <Link
                      href="/mentor/register"
                      className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                    >
                      <School2 className="mr-2 h-5 w-5" />
                      Join as Mentor
                    </Link>
                  )}
                  <button onClick={clearFilters} className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50">
                    Clear filters
                  </button>
                </div>
              </div>

              <div className="relative min-h-72 bg-gradient-to-br from-emerald-800 via-teal-700 to-slate-900">
                <img
                  src="/mentor-onboarding.png"
                  alt="Mentor onboarding"
                  className="absolute inset-0 h-full w-full object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/55 to-emerald-900/25" />
                <div className="relative flex h-full flex-col justify-end p-8 text-white">
                  <UserRoundCheck className="mb-4 h-12 w-12" />
                  <p className="text-2xl font-bold">Guide students. Build impact.</p>
                  <p className="mt-2 text-white/80">Your experience can become someone else's first step.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onContact={() => setSelectedMentor(mentor)}
                canRequest={!isMentorViewer}
                session={sessionByMentorId[String(mentor.id || mentor._id)]}
              />
            ))}
          </div>
        )}

        {pagination.hasNext && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => fetchMentors({ page: pagination.currentPage + 1, append: true })}
              disabled={isLoadingMore}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load more mentors
            </button>
          </div>
        )}
      </main>

      {!isMentorViewer && (
        <ContactMentorModal
          mentor={selectedMentor}
          isOpen={Boolean(selectedMentor)}
          onClose={() => {
            setSelectedMentor(null);
            fetchStudentSessions();
          }}
        />
      )}
    </div>
  );
}

function StudentSessionsPanel({ sessions, isLoading }) {
  if (isLoading) {
    return (
      <div className="mb-6 rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center text-sm font-semibold text-slate-600">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
          Loading your mentor sessions...
        </div>
      </div>
    );
  }

  if (!sessions.length) return null;

  const visibleSessions = sessions.slice(0, 3);

  return (
    <section className="mb-6 rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Your mentor sessions</h2>
          <p className="text-sm text-slate-600">
            Accepted sessions show the video call button for both student and mentor.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {sessions.length} total
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {visibleSessions.map((session) => {
          const mentorName = session.mentorId
            ? `${session.mentorId.firstName || ""} ${session.mentorId.lastName || ""}`.trim()
            : "Mentor";
          const meetingHref = session.meetingLink || `/video-call/${session._id}`;
          const isAccepted = session.status === "confirmed";
          const isRejected = session.status === "cancelled";

          return (
            <article key={session._id} className="rounded-lg border border-slate-200 bg-[#fbfffc] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{session.title || "Mentor session"}</p>
                  <p className="mt-1 text-sm text-slate-600">{mentorName}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isAccepted
                      ? "bg-emerald-100 text-emerald-700"
                      : isRejected
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isAccepted ? "Accepted" : isRejected ? "Rejected" : "Pending"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-white px-2.5 py-1">
                  {new Date(session.scheduledDate).toLocaleDateString()}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1">
                  {session.startTime} - {session.endTime}
                </span>
              </div>

              {isAccepted ? (
                <Link
                  href={meetingHref}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Join video call
                </Link>
              ) : (
                <p className={`mt-4 text-sm ${isRejected ? "text-red-700" : "text-amber-700"}`}>
                  {isRejected ? "Mentor rejected this request." : "Waiting for mentor to accept."}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MentorProfilePanel({ mentor }) {
  const fullName = `${mentor?.firstName || ""} ${mentor?.lastName || ""}`.trim() || mentor?.email || "Mentor";
  const initials = `${mentor?.firstName?.[0] || ""}${mentor?.lastName?.[0] || ""}` || "M";
  const expertise = Array.isArray(mentor?.expertise) ? mentor.expertise : [];

  return (
    <section className="mb-6 rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#0f2e25] text-xl font-bold text-white shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-950">{fullName}</h2>
              {mentor?.isVerified && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Verified mentor
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {mentor?.position || "Mentor"} at {mentor?.company || "Independent"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(expertise.length ? expertise : ["Mentorship"]).slice(0, 5).map((skill) => (
                <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/mentor/dashboard"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <UserRoundCheck className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/mentor/dashboard"
            className="inline-flex items-center rounded-lg border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Accept requests
          </Link>
        </div>
      </div>
    </section>
  );
}

function MentorCard({ mentor, onContact, canRequest, session }) {
  const initials = `${mentor.firstName?.[0] || ""}${mentor.lastName?.[0] || ""}`;
  const isAccepted = session?.status === "confirmed";
  const isPending = session?.status === "pending";
  const meetingHref = session?.meetingLink || (session?._id ? `/video-call/${session._id}` : "");

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
      <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-lg bg-[#0f2e25] text-lg font-bold text-white shadow-md">
            {initials || "M"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-gray-900">
                {mentor.firstName} {mentor.lastName}
              </h2>
              {mentor.isVerified && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{mentor.position || "Mentor"}</p>
            <p className="text-sm text-gray-500">{mentor.company || "Independent"}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end text-sm font-semibold">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            {mentor.rating?.toFixed ? mentor.rating.toFixed(1) : mentor.rating || "0.0"}
          </div>
          <p className="text-xs text-gray-500">{mentor.totalSessions || 0} sessions</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(mentor.expertise || []).slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-4 line-clamp-3 min-h-16 text-sm leading-6 text-gray-600">
        {mentor.bio || "Available for career guidance, practical feedback, and structured mentoring sessions."}
      </p>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <Info icon={<MapPin className="h-4 w-4" />} text={mentor.location || "Remote"} />
        <Info icon={<Briefcase className="h-4 w-4" />} text={`${mentor.experience || "Experienced"} experience`} />
        <Info icon={<Clock className="h-4 w-4" />} text={mentor.availability || "Flexible"} />
        <Info icon={<Globe className="h-4 w-4" />} text={(mentor.languages || ["English"]).join(", ")} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-emerald-50 pt-5">
        <div>
          <p className="text-xs text-gray-500">Hourly rate</p>
          <p className="text-lg font-bold text-slate-950">₹{mentor.hourlyRate || 0}</p>
        </div>
        {isAccepted ? (
          <Link
            href={meetingHref}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <Video className="mr-2 h-4 w-4" />
            Join video call
          </Link>
        ) : isPending ? (
          <span className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Requested
          </span>
        ) : canRequest ? (
          <button
            onClick={onContact}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Request Session
          </button>
        ) : (
          <span className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Mentor profile
          </span>
        )}
      </div>
      </div>
    </article>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-emerald-600">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-emerald-100 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option._id} ({option.count})
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-emerald-50/75">{label}</p>
    </div>
  );
}
