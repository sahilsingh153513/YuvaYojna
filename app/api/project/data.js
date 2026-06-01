import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "projects.json");

function ensureDataFile() {
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	if (!fs.existsSync(dataFile)) {
		fs.writeFileSync(dataFile, "[]", "utf8");
	}
}

function readProjects() {
	ensureDataFile();
	try {
		return JSON.parse(fs.readFileSync(dataFile, "utf8"));
	} catch {
		return [];
	}
}

function writeProjects(projects) {
	ensureDataFile();
	fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2), "utf8");
}

export function generateProjectId(projects = readProjects()) {
	const maxId = projects.reduce((max, project) => {
		const numericId = Number(project.id);
		return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
	}, 0);

	return String(maxId + 1);
}

export function addProject(projectInput) {
	const projects = readProjects();
	const id = generateProjectId(projects);
	const createdAt = new Date().toISOString();
	const project = { id, createdAt, ...projectInput };
	projects.push(project);
	writeProjects(projects);
	return project;
}

export function getAllProjects() {
	return readProjects();
}

export function getProjectById(id) {
	return readProjects().find(p => p.id === id) || null;
}

export function deleteProjectById(id) {
	const projects = readProjects();
	const nextProjects = projects.filter(p => p.id !== id);
	if (nextProjects.length === projects.length) return false;
	writeProjects(nextProjects);
	return true;
}
