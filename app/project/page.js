import { headers } from "next/headers";
import ProjectGalleryClient from "@/components/ProjectGalleryClient";

async function fetchProjects(baseUrl) {
	const res = await fetch(`${baseUrl}/api/project`, { cache: "no-store" });
	if (!res.ok) return { projects: [] };
	return res.json();
}

export default async function ProjectGalleryPage() {
	const hdrs = await headers();
	const host = hdrs.get("host") || "localhost:3000";
	const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
	const baseUrl = `${protocol}://${host}`;
	const { projects } = await fetchProjects(baseUrl);
	return <ProjectGalleryClient projects={projects} />;
}
