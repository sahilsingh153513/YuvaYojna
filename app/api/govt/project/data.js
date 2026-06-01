export const projects = [];

let nextIdCounter = 1;

export function generateProjectId() {
	const id = String(nextIdCounter);
	nextIdCounter += 1;
	return id;
}

export function addProject(projectInput) {
	const id = generateProjectId();
	const createdAt = new Date().toISOString();
	const project = { id, createdAt, ...projectInput };
	projects.push(project);
	return project;
}

export function getAllProjects() {
	return projects;
}

export function getProjectById(id) {
	return projects.find(p => p.id === id) || null;
} 