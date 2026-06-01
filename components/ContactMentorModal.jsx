"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Mail, MessageSquare, Send, User, Video, X } from "lucide-react";

const DURATIONS = [30, 60, 90, 120];
const REQUEST_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const REQUEST_COOLDOWN_KEY = "yuvaMentorRequestCooldowns";
const CONTACT_METHODS = [
  { value: "video", label: "Video call" },
  { value: "phone", label: "Phone call" },
  { value: "in-person", label: "In person" },
];

function getStoredUser() {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem("yuvaUser") || "{}");
  } catch {
    return {};
  }
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function getCooldowns() {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(REQUEST_COOLDOWN_KEY) || "{}");
  } catch {
    return {};
  }
}

function getCooldownKey(mentorId, studentId) {
  return `${mentorId || "mentor"}:${String(studentId || "").trim().toLowerCase()}`;
}

function getRemainingCooldownMs(mentorId, studentId) {
  if (!studentId) return 0;

  const cooldowns = getCooldowns();
  const requestedAt = Number(cooldowns[getCooldownKey(mentorId, studentId)] || 0);
  const remaining = requestedAt + REQUEST_COOLDOWN_MS - Date.now();
  return remaining > 0 ? remaining : 0;
}

function setRequestCooldown(mentorId, studentId) {
  if (!mentorId || !studentId || typeof window === "undefined") return;

  const now = Date.now();
  const cooldowns = getCooldowns();
  const freshCooldowns = Object.fromEntries(
    Object.entries(cooldowns).filter(([, timestamp]) => Number(timestamp) + REQUEST_COOLDOWN_MS > now)
  );

  freshCooldowns[getCooldownKey(mentorId, studentId)] = now;
  localStorage.setItem(REQUEST_COOLDOWN_KEY, JSON.stringify(freshCooldowns));
}

function formatCooldownMessage(remainingMs) {
  const hours = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
  return `Session already requested. Try one day after. (${hours}h left)`;
}

export default function ContactMentorModal({ mentor, isOpen, onClose }) {
  const storedUser = useMemo(() => getStoredUser(), [isOpen]);
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    subject: "",
    message: "",
    scheduledDate: getTomorrowDate(),
    startTime: "17:00",
    duration: 30,
    meetingType: "video",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [cooldownMessage, setCooldownMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setFormData((current) => ({
      ...current,
      studentName: storedUser.name || current.studentName,
      studentEmail: storedUser.email || current.studentEmail,
      subject: current.subject || `Mentorship request for ${mentor?.firstName || "mentor"}`,
    }));
    setSuccessMessage("");
    setErrors({});
    const studentId = storedUser.id || storedUser.email;
    const remainingCooldown = getRemainingCooldownMs(mentor?.id || mentor?._id, studentId);
    setCooldownMessage(remainingCooldown ? formatCooldownMessage(remainingCooldown) : "");
  }, [isOpen, mentor, storedUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.studentName.trim()) nextErrors.studentName = "Name is required";
    if (!formData.studentEmail.trim()) {
      nextErrors.studentEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      nextErrors.studentEmail = "Email is invalid";
    }
    if (!formData.subject.trim()) nextErrors.subject = "Topic is required";
    if (!formData.scheduledDate) nextErrors.scheduledDate = "Date is required";
    if (!formData.startTime) nextErrors.startTime = "Start time is required";
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      studentName: storedUser.name || "",
      studentEmail: storedUser.email || "",
      subject: "",
      message: "",
      scheduledDate: getTomorrowDate(),
      startTime: "17:00",
      duration: 30,
      meetingType: "video",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const mentorId = mentor.id || mentor._id;
    const studentId = storedUser.id || storedUser.email || formData.studentEmail;
    const remainingCooldown = getRemainingCooldownMs(mentorId, studentId);

    if (remainingCooldown) {
      setCooldownMessage(formatCooldownMessage(remainingCooldown));
      setErrors((current) => ({
        ...current,
        form: "Session already requested. Try one day after.",
      }));
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId,
          userId: studentId,
          studentName: formData.studentName,
          studentEmail: formData.studentEmail,
          title: formData.subject,
          scheduledDate: formData.scheduledDate,
          startTime: formData.startTime,
          duration: Number(formData.duration),
          meetingType: formData.meetingType,
          requestMessage: formData.message,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to request session");
      }

      setRequestCooldown(mentorId, studentId);
      setCooldownMessage("Session requested. Try one day after.");
      setSuccessMessage("Session request sent. Try one day after before requesting this mentor again.");
      resetForm();
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1600);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        form: error.message || "Failed to request session",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mentor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {mentor.firstName?.[0]}
              {mentor.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Request a session with {mentor.firstName} {mentor.lastName}
              </h2>
              <p className="text-sm text-gray-600">
                {mentor.position || mentor.title || "Mentor"} at {mentor.company || "Independent"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          {cooldownMessage && !successMessage && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
              {cooldownMessage}
            </div>
          )}

          {errors.form && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <FieldError label="Your Name" error={errors.studentName}>
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your full name"
              />
            </FieldError>

            <FieldError label="Your Email" error={errors.studentEmail}>
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="name@example.com"
              />
            </FieldError>
          </div>

          <FieldError label="Session Topic" error={errors.subject}>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Career guidance, resume review, interview prep..."
            />
          </FieldError>

          <div className="grid gap-4 md:grid-cols-4">
            <FieldError label="Date" error={errors.scheduledDate}>
              <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="scheduledDate"
                min={new Date().toISOString().slice(0, 10)}
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </FieldError>

            <FieldError label="Time" error={errors.startTime}>
              <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </FieldError>

            <FieldError label="Duration">
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {DURATIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} min
                  </option>
                ))}
              </select>
            </FieldError>

            <FieldError label="Mode">
              <Video className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                name="meetingType"
                value={formData.meetingType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {CONTACT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </FieldError>
          </div>

          <FieldError label="Message" error={errors.message}>
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Tell the mentor what you need help with and what outcome you want from the session."
            />
          </FieldError>

          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            <div className="flex flex-wrap justify-between gap-2">
              <span>Availability: {mentor.availability || "Flexible"}</span>
              <span>Rate: ₹{mentor.hourlyRate || 0}/hour</span>
              <span>Timezone: {mentor.timezone || "IST"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Boolean(cooldownMessage)}
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {cooldownMessage ? "Try one day after" : "Request Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldError({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <span className="relative block">{children}</span>
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
