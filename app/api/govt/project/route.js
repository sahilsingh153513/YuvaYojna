import { NextResponse } from "next/server";
import { addProject, getAllProjects } from "./data";

export async function GET() {
	return NextResponse.json({ projects: getAllProjects() });
}

export async function POST(request) {
	try {
		const body = await request.json();
		const {
			title,
			description,
			imageUrl,
			tags = [],
			author = "Anonymous",
			links = {},
		} = body || {};

		if (!title || !description) {
			return NextResponse.json({ error: "title and description are required" }, { status: 400 });
		}

		const project = addProject({ title, description, imageUrl, tags, author, links });
		return NextResponse.json({ project }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}
}
