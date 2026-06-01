import { NextResponse } from "next/server";
import { deleteProjectById, getProjectById } from "../data";

export async function GET(_req, ctx) {
	const { id } = await ctx.params;
	const project = getProjectById(id);
	if (!project) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ project });
}

export async function DELETE(_req, ctx) {
	const { id } = await ctx.params;
	const deleted = deleteProjectById(id);
	if (!deleted) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ success: true });
}
