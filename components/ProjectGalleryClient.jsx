"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Briefcase,
	Code2,
	ExternalLink,
	Grid2X2,
	LayoutList,
	Link as LinkIcon,
	Plus,
	Search,
	Sparkles,
} from "lucide-react";

const sortOptions = [
	{ id: "latest", label: "Latest" },
	{ id: "oldest", label: "Oldest" },
	{ id: "title", label: "Title" },
];

export default function ProjectGalleryClient({ projects = [] }) {
	const router = useRouter();
	const [items, setItems] = useState(projects);
	const [query, setQuery] = useState("");
	const [tag, setTag] = useState("All");
	const [sortBy, setSortBy] = useState("latest");
	const [layout, setLayout] = useState("grid");
	const [mounted, setMounted] = useState(false);
	const [showImport, setShowImport] = useState(false);
	const [importForm, setImportForm] = useState({ title: "", url: "", author: "", description: "" });
	const [importError, setImportError] = useState("");
	const [importing, setImporting] = useState(false);

	useEffect(() => setMounted(true), []);

	const allTags = useMemo(() => {
		const tags = new Set();
		items.forEach(item => (item.tags || []).forEach(itemTag => tags.add(itemTag)));
		return ["All", ...Array.from(tags)];
	}, [items]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		const list = items.filter(item => {
			const searchable = [
				item.title,
				item.description,
				item.author,
				item.role,
				...(item.tags || []),
				...(item.skills || []),
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			return (!q || searchable.includes(q)) && (tag === "All" || (item.tags || []).includes(tag));
		});

		return [...list].sort((a, b) => {
			if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
			const ad = new Date(a.createdAt || 0).getTime();
			const bd = new Date(b.createdAt || 0).getTime();
			return sortBy === "oldest" ? ad - bd : bd - ad;
		});
	}, [items, query, tag, sortBy]);

	async function importPortfolio(event) {
		event.preventDefault();
		setImportError("");
		setImporting(true);

		try {
			const payload = {
				type: "portfolio",
				title: importForm.title.trim(),
				description: importForm.description.trim() || "Imported portfolio link",
				author: importForm.author.trim() || "Portfolio owner",
				portfolioUrl: importForm.url.trim(),
				tags: ["Portfolio"],
				links: { demo: importForm.url.trim() },
			};

			const response = await fetch("/api/project", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await response.json();

			if (!response.ok) throw new Error(data.error || "Could not import portfolio");

			setItems(current => [data.project, ...current]);
			setImportForm({ title: "", url: "", author: "", description: "" });
			setShowImport(false);
		} catch (error) {
			setImportError(error.message);
		} finally {
			setImporting(false);
		}
	}

	if (!mounted) {
		return <div className="min-h-screen bg-base-200" />;
	}

	return (
		<div className="min-h-screen bg-base-200 text-base-content">
			<section className="border-b border-base-300 bg-base-100">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<p className="text-sm font-semibold uppercase tracking-wide text-primary">Project Gallery</p>
							<h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
								Projects and portfolios
							</h1>
							<p className="mt-2 max-w-2xl text-base-content/65">
								Showcase student work, import portfolio links, and keep everything browsable inside Yuva Yojna.
							</p>
						</div>

						<div className="flex flex-wrap gap-3">
							<button
								onClick={() => router.push("/project/submit")}
								className="btn btn-primary"
							>
								<Plus className="h-4 w-4" />
								Create Project
							</button>
							<button
								onClick={() => setShowImport(current => !current)}
								className="btn btn-outline"
							>
								<LinkIcon className="h-4 w-4" />
								Import Portfolio
							</button>
						</div>
					</div>
				</div>
			</section>

			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				{showImport && (
					<form onSubmit={importPortfolio} className="mb-6 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
						<div className="grid gap-3 md:grid-cols-2">
							<input
								value={importForm.title}
								onChange={event => setImportForm(current => ({ ...current, title: event.target.value }))}
								required
								placeholder="Portfolio title"
								className="input input-bordered w-full"
							/>
							<input
								value={importForm.url}
								onChange={event => setImportForm(current => ({ ...current, url: event.target.value }))}
								required
								placeholder="https://your-portfolio.com"
								className="input input-bordered w-full"
							/>
							<input
								value={importForm.author}
								onChange={event => setImportForm(current => ({ ...current, author: event.target.value }))}
								placeholder="Owner name"
								className="input input-bordered w-full"
							/>
							<input
								value={importForm.description}
								onChange={event => setImportForm(current => ({ ...current, description: event.target.value }))}
								placeholder="Short description"
								className="input input-bordered w-full"
							/>
						</div>
						{importError && <p className="mt-3 text-sm text-error">{importError}</p>}
						<div className="mt-4 flex justify-end gap-2">
							<button type="button" onClick={() => setShowImport(false)} className="btn btn-ghost btn-sm">
								Cancel
							</button>
							<button disabled={importing} className="btn btn-primary btn-sm">
								{importing ? "Importing..." : "Import Portfolio"}
							</button>
						</div>
					</form>
				)}

				<div className="mb-6 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
					<div className="grid gap-3 lg:grid-cols-[1fr_180px_160px_auto]">
						<label className="relative block">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
							<input
								value={query}
								onChange={event => setQuery(event.target.value)}
								placeholder="Search by title, author, skill, technology..."
								className="input input-bordered w-full pl-9"
							/>
						</label>

						<select value={tag} onChange={event => setTag(event.target.value)} className="select select-bordered w-full">
							{allTags.map(itemTag => (
								<option key={itemTag} value={itemTag}>
									{itemTag === "All" ? "All tags" : itemTag}
								</option>
							))}
						</select>

						<select value={sortBy} onChange={event => setSortBy(event.target.value)} className="select select-bordered w-full">
							{sortOptions.map(option => (
								<option key={option.id} value={option.id}>{option.label}</option>
							))}
						</select>

						<div className="join justify-self-start lg:justify-self-end">
							<button
								onClick={() => setLayout("grid")}
								className={`btn join-item ${layout === "grid" ? "btn-primary" : "btn-outline"}`}
								aria-label="Grid layout"
							>
								<Grid2X2 className="h-4 w-4" />
							</button>
							<button
								onClick={() => setLayout("list")}
								className={`btn join-item ${layout === "list" ? "btn-primary" : "btn-outline"}`}
								aria-label="List layout"
							>
								<LayoutList className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				<div className="mb-5 flex items-center justify-between">
					<p className="text-sm font-medium text-base-content/65">
						{`${filtered.length} ${filtered.length === 1 ? "item" : "items"} found`}
					</p>
				</div>

				{filtered.length === 0 ? (
					<div className="rounded-lg border border-base-300 bg-base-100 p-12 text-center shadow-sm">
						<Briefcase className="mx-auto mb-4 h-12 w-12 text-base-content/30" />
						<h2 className="text-xl font-semibold">No projects found</h2>
						<p className="mt-2 text-base-content/60">Try a different search or import your first portfolio.</p>
					</div>
				) : (
					<div className={layout === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
						{filtered.map(item => (
							layout === "grid" ? (
								<GalleryCard key={item.id} item={item} router={router} />
							) : (
								<GalleryRow key={item.id} item={item} router={router} />
							)
						))}
					</div>
				)}
			</main>
		</div>
	);
}

function GalleryCard({ item, router }) {
	const isPortfolio = item.type === "portfolio";
	const accent = isPortfolio ? "from-emerald-500 to-cyan-500" : "from-blue-500 to-indigo-500";

	return (
		<article
			onClick={() => router.push(`/project/${item.id}`)}
			className="group cursor-pointer overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
		>
			<div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${accent}`}>
				<div className="absolute inset-0 bg-black/10" />
				<div className="relative rounded-2xl bg-white/15 p-5 text-white backdrop-blur">
					{isPortfolio ? <Briefcase className="h-10 w-10" /> : <Sparkles className="h-10 w-10" />}
				</div>
				<span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
					{isPortfolio ? "Portfolio" : "Project"}
				</span>
			</div>

			<div className="p-5">
				<div className="mb-3">
					<h2 className="line-clamp-1 text-xl font-bold">{item.title}</h2>
					{item.role && <p className="mt-1 text-sm text-base-content/60">{item.role}</p>}
				</div>
				<p className="line-clamp-3 min-h-18 text-sm leading-6 text-base-content/65">{item.description}</p>

				<div className="mt-4 flex flex-wrap gap-2">
					{(item.tags || []).slice(0, 4).map(tag => (
						<span key={tag} className="badge badge-outline badge-sm">{tag}</span>
					))}
				</div>

				<div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
					<p className="text-sm text-base-content/50">{item.author || "Anonymous"}</p>
					<div className="flex gap-3">
						{item.portfolioUrl && (
							<button
								type="button"
								onClick={event => {
									event.stopPropagation();
									router.push(`/project/${item.id}`);
								}}
								className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
							>
								<LinkIcon className="h-4 w-4" />
								View
							</button>
						)}
						{item.links?.code && (
							<a
								href={item.links.code}
								target="_blank"
								onClick={event => event.stopPropagation()}
								className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
							>
								<Code2 className="h-4 w-4" />
								Code
							</a>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}

function GalleryRow({ item, router }) {
	const isPortfolio = item.type === "portfolio";

	return (
		<article
			onClick={() => router.push(`/project/${item.id}`)}
			className="group flex cursor-pointer flex-col gap-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center"
		>
			<div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-lg ${isPortfolio ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
				{isPortfolio ? <Briefcase className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2">
					<h2 className="font-bold">{item.title}</h2>
					<span className="badge badge-outline badge-sm">{isPortfolio ? "Portfolio" : "Project"}</span>
				</div>
				<p className="mt-1 line-clamp-2 text-sm text-base-content/65">{item.description}</p>
			</div>
			<button className="btn btn-outline btn-sm">
				Open
				<ExternalLink className="h-4 w-4" />
			</button>
		</article>
	);
}
