import type { Project, TaskCard } from '../types/domain';

const createdAt = '2026-05-17T08:00:00.000Z';

export const seedProjects: Project[] = [
  {
    id: 'project_builtsmart',
    name: 'BuiltSmart Hub',
    client: 'Intern',
    color: '#2563eb',
    archived: false,
    createdAt,
    updatedAt: createdAt
  },
  {
    id: 'project_client',
    name: 'Kundenarbeit',
    client: 'Musterkunde',
    color: '#15803d',
    archived: false,
    createdAt,
    updatedAt: createdAt
  }
];

export const seedTasks: TaskCard[] = [
  {
    id: 'task_offer_review',
    title: 'Angebot Müller prüfen',
    description: 'Leistungsumfang, Risiken und offene Annahmen prüfen.',
    status: 'focus',
    priority: 'high',
    projectId: 'project_client',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    tags: ['angebot', 'prüfung'],
    createdAt,
    updatedAt: createdAt,
    archived: false
  },
  {
    id: 'task_weekly_report',
    title: 'Wochenreport vorbereiten',
    description: 'Sessions auswerten und Projektfortschritt zusammenfassen.',
    status: 'today',
    priority: 'medium',
    projectId: 'project_builtsmart',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    tags: ['reporting'],
    createdAt,
    updatedAt: createdAt,
    archived: false
  }
];
