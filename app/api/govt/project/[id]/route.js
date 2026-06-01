import { NextResponse } from "next/server";
import { getProjectById } from "../data";

export async function GET(_req, ctx) {
	const { id } = await ctx.params;
	const project = getProjectById(id);
	if (!project) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ project });
}
