"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, AlignLeft, GitBranch, Link as LinkIcon, Tag as TagIcon, User as UserIcon, Image as ImageIcon, Upload, Briefcase } from "lucide-react";

export default function SubmitProjectPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		type: "project",
		title: "",
		description: "",
		imageUrl: "",
		tags: "",
		author: "",
		role: "",
		skills: "",
		portfolioUrl: "",
		featuredWork: "",
		codeUrl: "",
		demoUrl: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSubmitting(true);
		try {
			let imageUrl = form.imageUrl.trim();
			if (imageFile) {
				imageUrl = imagePreview || imageUrl;
			}

			const payload = {
				title: form.title.trim(),
				description: form.description.trim(),
				imageUrl: imageUrl || undefined,
				tags: form.tags
					.split(",")
					.map(t => t.trim())
					.filter(Boolean),
				author: form.author.trim() || undefined,
				type: form.type,
				role: form.role.trim() || undefined,
				portfolioUrl: form.portfolioUrl.trim() || undefined,
				skills: form.skills
					.split(",")
					.map(t => t.trim())
					.filter(Boolean),
				featuredWork: form.featuredWork
					.split("\n")
					.map(line => line.trim())
					.filter(Boolean)
					.map(line => {
						const [title, url] = line.split("|").map(part => part?.trim());
						return { title, url };
					}),
				links: {
					code: form.codeUrl.trim() || undefined,
					demo: form.demoUrl.trim() || form.portfolioUrl.trim() || undefined,
				},
			};

			const res = await fetch("/api/project", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || "Submission failed");
			}
			await res.json();
			router.push("/project");
		} catch (err) {
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	}

	function setField(name, value) {
		setForm(prev => ({ ...prev, [name]: value }));
	}

	function onFileChange(e) {
		const file = e.target.files?.[0];
		setImageFile(file || null);
		if (file) {
			const url = URL.createObjectURL(file);
			setImagePreview(url);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
			<div className="max-w-3xl mx-auto p-8">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl mb-6 shadow-lg shadow-emerald-500/25">
						✨
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent mb-4">
						Submit Your Project
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Showcase a project, import an existing portfolio, or create a small work portfolio inside Yuva Yojna
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-10">
					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setField("type", "project")}
								className={`rounded-xl border-2 px-4 py-4 font-semibold transition ${form.type === "project" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-700"}`}
							>
								Project
							</button>
							<button
								type="button"
								onClick={() => setField("type", "portfolio")}
								className={`rounded-xl border-2 px-4 py-4 font-semibold transition ${form.type === "portfolio" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-700"}`}
							>
								Portfolio
							</button>
						</div>

						{/* Project Title */}
						<div className="group">
							<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
								<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
									<FileText size={20} />
								</div>
								{form.type === "portfolio" ? "Portfolio Title" : "Project Title"}
							</label>
							<input 
								value={form.title} 
								onChange={e => setField("title", e.target.value)} 
								required 
								className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-lg"
								placeholder={form.type === "portfolio" ? "Priyansh's Web Portfolio" : "Enter your amazing project title..."}
							/>
						</div>

						{/* Project Description */}
						<div className="group">
							<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
								<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
									<AlignLeft size={20} />
								</div>
								{form.type === "portfolio" ? "About Your Work" : "Project Description"}
							</label>
							<textarea 
								value={form.description} 
								onChange={e => setField("description", e.target.value)} 
								required 
								rows={6} 
								className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 resize-none"
								placeholder={form.type === "portfolio" ? "Write a short intro, what you build, and what kind of opportunities you want..." : "Describe your project, the technologies used, challenges overcome, and what makes it special..."}
							/>
						</div>

						{form.type === "portfolio" && (
							<div className="space-y-6">
								<div className="group">
									<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
										<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
											<Briefcase size={20} />
										</div>
										Role / Headline
									</label>
									<input
										value={form.role}
										onChange={e => setField("role", e.target.value)}
										className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
										placeholder="Frontend Developer, UI Designer, Data Analyst..."
									/>
								</div>
								<div className="group">
									<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
										<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
											<LinkIcon size={20} />
										</div>
										Existing Portfolio Link
									</label>
									<input
										value={form.portfolioUrl}
										onChange={e => setField("portfolioUrl", e.target.value)}
										className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
										placeholder="https://your-portfolio.com"
									/>
									<p className="text-sm text-gray-500 mt-2">If you add this, visitors can open your original portfolio directly.</p>
								</div>
								<div className="group">
									<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
										<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
											<TagIcon size={20} />
										</div>
										Portfolio Skills
									</label>
									<input
										value={form.skills}
										onChange={e => setField("skills", e.target.value)}
										className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
										placeholder="React, Figma, Python, Communication"
									/>
								</div>
								<div className="group">
									<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
										<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
											<FileText size={20} />
										</div>
										Featured Work
									</label>
									<textarea
										value={form.featuredWork}
										onChange={e => setField("featuredWork", e.target.value)}
										rows={4}
										className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 resize-none"
										placeholder={"Landing page redesign | https://example.com\nData dashboard | https://example.com"}
									/>
									<p className="text-sm text-gray-500 mt-2">One work item per line. Use: title | link</p>
								</div>
							</div>
						)}

						{/* Cover Image Upload */}
						<div className="group">
							<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
								<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
									<ImageIcon size={20} />
								</div>
								Cover Image
							</label>
							<div className="relative">
								<div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-300 transition-colors duration-200">
									<input 
										id="cover-input" 
										type="file" 
										accept="image/*" 
										onChange={onFileChange} 
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
									/>
									<div className="flex flex-col items-center gap-4">
										<div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
											<Upload size={24} />
										</div>
										<div>
											<p className="text-lg font-medium text-gray-700 mb-1">
												{imageFile ? imageFile.name : "Drop your image here or click to browse"}
											</p>
											<p className="text-sm text-gray-500">
												PNG, JPG up to 10MB
											</p>
										</div>
									</div>
								</div>
								{imagePreview && (
									<div className="mt-4 relative">
										<img 
											src={imagePreview} 
											alt="Preview" 
											className="w-full h-64 object-cover rounded-xl border-2 border-gray-100"
										/>
										<button
											type="button"
											onClick={() => {
												setImageFile(null);
												setImagePreview("");
											}}
											className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
										>
											✕
										</button>
									</div>
								)}
							</div>
						</div>

						{/* Links Section */}
						<div className="space-y-6">
							<div className="group">
								<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
									<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
										<GitBranch size={20} />
									</div>
									GitHub Repository
								</label>
								<input 
									value={form.codeUrl} 
									onChange={e => setField("codeUrl", e.target.value)} 
									className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
									placeholder="https://github.com/yourusername/your-project"
								/>
							</div>

							<div className="group">
								<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
									<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
										<LinkIcon size={20} />
									</div>
									Live Demo
								</label>
								<input 
									value={form.demoUrl} 
									onChange={e => setField("demoUrl", e.target.value)} 
									className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
									placeholder="https://your-project-demo.vercel.app"
								/>
							</div>
						</div>

						{/* Tags and Author */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="group">
								<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
									<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
										<TagIcon size={20} />
									</div>
									Tags
								</label>
								<input 
									value={form.tags} 
									onChange={e => setField("tags", e.target.value)} 
									className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
									placeholder="React, Node.js, AI"
								/>
								<p className="text-sm text-gray-500 mt-2">Separate tags with commas</p>
							</div>
							<div className="group">
								<label className="flex items-center gap-3 text-gray-900 font-semibold mb-3 text-lg">
									<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-focus-within:bg-emerald-100 transition-colors duration-200">
										<UserIcon size={20} />
									</div>
									Author
								</label>
								<input 
									value={form.author} 
									onChange={e => setField("author", e.target.value)} 
									className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
									placeholder="Your name"
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-xl p-4">
								<p className="text-red-700 font-medium">⚠️ {error}</p>
							</div>
						)}

						{/* Submit Button */}
						<div className="pt-6">
							<button 
								type="submit" 
								disabled={submitting} 
								className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 text-lg"
							>
								{submitting ? (
									<span className="flex items-center justify-center gap-3">
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										Submitting Your Project...
									</span>
								) : (
									<span className="flex items-center justify-center gap-3">
										🚀 Submit Project
									</span>
								)}
							</button>
						</div>
					</form>

					{/* Back Link */}
					<div className="text-center mt-8 pt-6 border-t border-gray-100">
						<button 
							onClick={() => router.push("/project")} 
							className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
						>
							← Back to Gallery
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
