import { NextResponse } from "next/server";

const rooms = globalThis.yuvaVideoRooms || new Map();
globalThis.yuvaVideoRooms = rooms;

function getRoom(roomId) {
  const key = String(roomId);
  if (!rooms.has(key)) {
    rooms.set(key, {
      participants: {},
      offer: null,
      answer: null,
      candidates: {
        mentor: [],
        student: [],
      },
      updatedAt: Date.now(),
    });
  }

  return rooms.get(key);
}

export async function GET(_request, { params }) {
  const { roomId } = await params;
  const room = getRoom(roomId);

  return NextResponse.json({
    success: true,
    room,
  });
}

export async function POST(request, { params }) {
  const { roomId } = await params;
  const body = await request.json();
  const { role, type, payload } = body;
  const room = getRoom(roomId);
  const safeRole = role === "mentor" ? "mentor" : "student";

  room.updatedAt = Date.now();

  if (type === "join") {
    room.participants[safeRole] = Date.now();
  }

  if (type === "reset") {
    room.offer = null;
    room.answer = null;
    room.candidates = {
      mentor: [],
      student: [],
    };
    room.participants = {
      [safeRole]: Date.now(),
    };
  }

  if (type === "offer") {
    room.offer = payload;
    room.answer = null;
    room.candidates.mentor = [];
    room.candidates.student = [];
  }

  if (type === "answer") {
    room.answer = payload;
  }

  if (type === "candidate" && payload) {
    room.candidates[safeRole].push(payload);
  }

  if (type === "leave") {
    delete room.participants[safeRole];
  }

  return NextResponse.json({
    success: true,
    room,
  });
}
