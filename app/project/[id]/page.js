import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function fetchProject(baseUrl, id) {
	const res = await fetch(`${baseUrl}/api/project/${id}`, { cache: "no-store" });
	if (!res.ok) return null;
	const data = await res.json();
	return data.project || null;
}

export default async function ProjectDetailPage({ params }) {
	const hdrs = await headers();
	const host = hdrs.get("host") || "localhost:3000";
	const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
	const baseUrl = `${protocol}://${host}`;
	const { id } = await params;
	const project = await fetchProject(baseUrl, id);
	if (!project) return notFound();
	const portfolioHost = project.portfolioUrl ? new URL(project.portfolioUrl).host : "";
	return (
		<div className="min-h-screen bg-slate-50">
			<div className="max-w-6xl mx-auto px-6 py-8">
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<p className="text-sm font-semibold uppercase tracking-wide text-green-700">
								{project.type === "portfolio" ? "Portfolio Preview" : "Project"}
							</p>
							<h1 className="text-3xl font-semibold text-slate-950 mt-1">{project.title}</h1>
							{project.role && <p className="text-lg text-slate-600 mt-2">{project.role}</p>}
							<p className="mt-4 max-w-3xl text-slate-700 leading-7">{project.description}</p>
						</div>
						{project.portfolioUrl && (
							<div className="rounded-xl border border-green-100 bg-green-50 p-4 lg:w-80">
								<p className="text-xs font-semibold uppercase tracking-wide text-green-700">Imported from</p>
								<p className="mt-1 break-all text-sm font-medium text-slate-800">{portfolioHost}</p>
								<a className="mt-4 inline-flex w-full justify-center rounded-lg bg-green-700 px-4 py-2 font-semibold text-white" href={project.portfolioUrl}>
									Open Original
								</a>
							</div>
						)}
					</div>

					<div className="mt-5 flex flex-wrap gap-2">
						{(project.tags || []).map(tag => (
							<span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">{tag}</span>
						))}
						{(project.skills || []).map(skill => (
							<span key={skill} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">{skill}</span>
						))}
					</div>
				</div>

				{project.imageUrl && <img src={project.imageUrl} alt={project.title} className="mt-6 rounded-2xl w-full h-72 object-cover border border-slate-200" />}

				{project.portfolioUrl && (
					<div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
						<div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-900 px-4 py-3 text-white md:flex-row md:items-center md:justify-between">
							<div className="flex items-center gap-3">
								<div className="flex gap-1.5">
									<span className="h-3 w-3 rounded-full bg-red-400" />
									<span className="h-3 w-3 rounded-full bg-yellow-400" />
									<span className="h-3 w-3 rounded-full bg-green-400" />
								</div>
								<div>
									<p className="font-semibold">Live Portfolio Preview</p>
									<p className="text-xs text-slate-300">{project.portfolioUrl}</p>
								</div>
							</div>
							<div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
								Embedded inside Project Gallery
							</div>
						</div>
						<div className="bg-slate-100 p-3">
							<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
								<iframe
									src={project.portfolioUrl}
									title={`${project.title} portfolio`}
									className="h-[760px] w-full bg-white"
								/>
							</div>
							<p className="mt-3 text-center text-xs text-slate-500">
								If the preview does not load, the portfolio site may block embedding. Use Open Original above.
							</p>
						</div>
					</div>
				)}

				{(project.featuredWork || []).length > 0 && (
					<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<h2 className="font-semibold text-slate-950 mb-3">Featured Work</h2>
						<div className="grid gap-3 md:grid-cols-2">
							{project.featuredWork.map((work, index) => (
								<div key={`${work.title}-${index}`} className="rounded-lg border border-slate-200 p-4">
									<p className="font-medium text-slate-900">{work.title}</p>
									{work.url && <a className="text-green-700 text-sm" href={work.url} target="_blank">{work.url}</a>}
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-4 mt-5">
					{project?.links?.code && <a className="text-green-700" href={project.links.code} target="_blank">Code</a>}
					{project?.links?.demo && !project.portfolioUrl && <a className="text-green-700" href={project.links.demo} target="_blank">Demo</a>}
				</div>
			</div>
		</div>
	);
}
