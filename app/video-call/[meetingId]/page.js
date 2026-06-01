"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Copy, Mic, MicOff, PhoneOff, Video, VideoOff, Users } from "lucide-react";

const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCallRoomPage() {
  const { meetingId } = useParams();
  const roomId = Array.isArray(meetingId) ? meetingId[0] : meetingId;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const candidateIndexRef = useRef({ mentor: 0, student: 0 });
  const retryCountRef = useRef(0);
  const [role, setRole] = useState("student");
  const [status, setStatus] = useState("Ready to join");
  const [hasJoined, setHasJoined] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [remoteStreamActive, setRemoteStreamActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setRole(localStorage.getItem("mentorData") ? "mentor" : "student");
    } catch {
      setRole("student");
    }
  }, []);

  useEffect(() => {
    return () => leaveCall();
  }, []);

  const postSignal = async (type, payload) => {
    await fetch(`/api/video-rooms/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, type, payload }),
    });
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection(peerConfig);
    const remoteStream = new MediaStream();

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        postSignal("candidate", event.candidate.toJSON()).catch(console.error);
      }
    };

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      const targetStream = stream || remoteStream;

      if (!stream && event.track) {
        remoteStream.addTrack(event.track);
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = targetStream;
        remoteVideoRef.current.play?.().catch(() => {});
      }
      setRemoteStreamActive(true);
      setStatus("Connected");
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "connected") setStatus("Connected");
      if (peer.connectionState === "disconnected") setStatus("Other side disconnected");
      if (peer.connectionState === "failed") setStatus("Connection failed. Try rejoining.");
    };

    return peer;
  };

  const joinCall = async () => {
    setError("");
    setStatus("Starting camera...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      if (role === "mentor") {
        await postSignal("reset");
        candidateIndexRef.current = { mentor: 0, student: 0 };
      } else {
        await postSignal("join");
      }

      const peer = createPeer();
      peerRef.current = peer;
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      setHasJoined(true);
      setStatus(role === "mentor" ? "Waiting for student..." : "Waiting for mentor...");

      if (role === "mentor") {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        await postSignal("offer", offer);
      }

      startPolling(peer);
    } catch (joinError) {
      console.error("Video join error:", joinError);
      setError("Camera/mic permission failed. Allow camera and microphone, then try again.");
      setStatus("Unable to join");
    }
  };

  const startPolling = (peer) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/video-rooms/${roomId}`, { cache: "no-store" });
        const data = await response.json();
        const room = data.room || {};
        const otherRole = role === "mentor" ? "student" : "mentor";

        setRemoteJoined(Boolean(room.participants?.[otherRole]));

        if (role === "student" && room.offer && !peer.currentRemoteDescription) {
          setStatus("Joining mentor...");
          await peer.setRemoteDescription(new RTCSessionDescription(room.offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await postSignal("answer", answer);
        }

        if (role === "mentor" && room.answer && !peer.currentRemoteDescription) {
          setStatus("Student joined. Connecting...");
          await peer.setRemoteDescription(new RTCSessionDescription(room.answer));
        }

        if (peer.currentRemoteDescription) {
          const remoteCandidates = room.candidates?.[otherRole] || [];
          const startIndex = candidateIndexRef.current[otherRole] || 0;
          for (const candidate of remoteCandidates.slice(startIndex)) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          }
          candidateIndexRef.current[otherRole] = remoteCandidates.length;
        }

        if (
          role === "mentor" &&
          room.participants?.student &&
          peer.currentRemoteDescription &&
          !remoteVideoRef.current?.srcObject &&
          retryCountRef.current < 2
        ) {
          retryCountRef.current += 1;
          setStatus("Reconnecting student video...");
          await restartAsMentor();
          return;
        }
      } catch (pollError) {
        console.error("Video polling error:", pollError);
      }

      if (peerRef.current === peer) {
        window.setTimeout(poll, 1000);
      }
    };

    poll();
  };

  const restartAsMentor = async () => {
    if (role !== "mentor" || !streamRef.current) return;

    peerRef.current?.close();
    candidateIndexRef.current = { mentor: 0, student: 0 };
    const peer = createPeer();
    peerRef.current = peer;
    streamRef.current.getTracks().forEach((track) => peer.addTrack(track, streamRef.current));
    await postSignal("reset");
    await postSignal("join");
    const offer = await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await peer.setLocalDescription(offer);
    await postSignal("offer", offer);
    startPolling(peer);
  };

  const toggleMic = () => {
    const next = !micOn;
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    setMicOn(next);
  };

  const toggleCamera = () => {
    const next = !cameraOn;
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
    setCameraOn(next);
  };

  const leaveCall = () => {
    postSignal("leave").catch(() => {});
    peerRef.current?.close();
    peerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setHasJoined(false);
    setRemoteJoined(false);
    setRemoteStreamActive(false);
    setStatus("Ready to join");
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (copyError) {
      console.error("Unable to copy invite link:", copyError);
    }
  };

  return (
    <main className="min-h-screen bg-[#071914] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Yuva Yojna Video Call
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Mentorship Session Room</h1>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-emerald-50">
            Room ID: {roomId}
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl">
            <div className="grid min-h-[560px] gap-3 bg-slate-950 p-3 md:grid-cols-2">
              <VideoTile label={`You (${role})`} muted videoRef={localVideoRef} active={hasJoined} />
              <VideoTile label={role === "mentor" ? "Student" : "Mentor"} videoRef={remoteVideoRef} active={remoteStreamActive} />
            </div>

            {!hasJoined && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-8 text-center backdrop-blur">
                <div className="max-w-lg">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                    <Video className="h-11 w-11" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold">Join as {role}</h2>
                  <p className="mx-auto mt-3 text-emerald-50/70">
                    Open this same room on both sides. Mentor and student should press Join call and allow camera/mic.
                  </p>
                  {error && <p className="mt-4 rounded-lg bg-red-500/15 p-3 text-sm text-red-100">{error}</p>}
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={joinCall}
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-950/30 hover:bg-emerald-600"
                    >
                      <Video className="mr-2 h-5 w-5" />
                      Join call
                    </button>
                    <button
                      type="button"
                      onClick={copyInvite}
                      className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-5 py-3 font-semibold text-emerald-50 hover:bg-white/15"
                    >
                      <Copy className="mr-2 h-5 w-5" />
                      {copied ? "Copied" : "Copy invite"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Users className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="font-semibold">Participants</p>
                <p className="text-sm text-emerald-50/65">{status}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Participant name="Mentor" active={role === "mentor" ? hasJoined : remoteJoined} />
              <Participant name="Student" active={role === "student" ? hasJoined : remoteJoined} />
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-black/10 p-4 text-sm text-emerald-50/75">
              <p className="font-semibold text-white">How to join</p>
              <p className="mt-2">
                Mentor dashboard se Open video call. Student mentors page se Join video call. Dono same room me Join call press karein.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Control disabled={hasJoined} onClick={joinCall} icon={<Video className="h-5 w-5" />} label="Join" />
              <Control onClick={copyInvite} icon={<Copy className="h-5 w-5" />} label={copied ? "Copied" : "Invite"} />
              <Control disabled={!hasJoined} onClick={toggleMic} icon={micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />} label={micOn ? "Mic on" : "Mic off"} />
              <Control disabled={!hasJoined} onClick={toggleCamera} icon={cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />} label={cameraOn ? "Camera" : "Hidden"} />
              {role === "mentor" && (
                <Control disabled={!hasJoined} onClick={restartAsMentor} icon={<Video className="h-5 w-5" />} label="Reconnect" />
              )}
              <div className="col-span-2">
                <Control danger disabled={!hasJoined} onClick={leaveCall} icon={<PhoneOff className="h-5 w-5" />} label="Leave" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function VideoTile({ label, videoRef, muted = false, active }) {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-lg bg-black">
      <video ref={videoRef} autoPlay playsInline muted={muted} className="h-full min-h-[260px] w-full object-cover" />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center text-emerald-50/70">
            <VideoOff className="mx-auto h-10 w-10" />
            <p className="mt-3 text-sm">Waiting for video</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold">
        {label}
      </div>
    </div>
  );
}

function Participant({ name, active }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${active ? "bg-emerald-500" : "bg-slate-600"}`}>
        {name[0]}
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-emerald-50/65">{active ? "Joined" : "Not joined"}</p>
      </div>
    </div>
  );
}

function Control({ icon, label, danger = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
        danger ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/10 text-emerald-50 hover:bg-white/15"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
