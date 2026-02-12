//import { getSampleProjects } from "./sampleData"

import { Project } from "./types"
import { PROJECTS_KEY } from "./storageKeys"

// Projects
export function getProjects(): Project[] | null {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(PROJECTS_KEY)
  if (stored) return JSON.parse(stored)

 const sampleProjects =null;
 // getSampleProjects()
  //saveProjects(sampleProjects)
  //return sampleProjects
  return null;
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function addProject(project: Project): void {
  const projects = getProjects()
  projects.push(project)
  saveProjects(projects)
}

export function updateProject(project: Project): void {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === project.id)
  if (index !== -1) {
    projects[index] = project
    saveProjects(projects)
  }
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id)
  saveProjects(projects)
}
