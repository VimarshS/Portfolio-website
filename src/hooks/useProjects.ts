import { useEffect, useState } from 'react';
import { PROJECTS, Project } from '../data/portfolioData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useProjects(): Project[] {
  // Start with the local data, so the page is never empty
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    if (!API_BASE) return;

    const controller = new AbortController();
    // Give up after 10 seconds (a sleeping server can be slow)
    const timer = setTimeout(() => controller.abort(), 10000);

    fetch(`${API_BASE}/api/projects`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Projects request failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects as Project[]);
        }
      })
      .catch(() => {
        // Server is down or slow: keep showing the local projects
      })
      .finally(() => clearTimeout(timer));

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return projects;
}