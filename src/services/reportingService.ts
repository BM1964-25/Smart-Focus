import {
  differenceInCalendarDays,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfWeek
} from 'date-fns';
import type { PomodoroSession, Project, TaskCard } from '../types/domain';

export interface DashboardStats {
  focusMinutesToday: number;
  focusMinutesWeek: number;
  pomodorosToday: number;
  completedTasksToday: number;
  interruptions: number;
  focusByProject: Array<{ projectId: string; projectName: string; minutes: number }>;
  estimateVsActual: Array<{ taskId: string; taskTitle: string; estimated: number; actual: number }>;
  productivityTrend: Array<{ day: string; minutes: number }>;
}

const isBetween = (date: Date, start: Date, end: Date): boolean =>
  (isAfter(date, start) || date.getTime() === start.getTime()) &&
  (isBefore(date, end) || date.getTime() === end.getTime());

export const calculateDashboardStats = (
  tasks: TaskCard[],
  sessions: PomodoroSession[],
  projects: Project[],
  referenceDate = new Date()
): DashboardStats => {
  const todayStart = startOfDay(referenceDate);
  const todayEnd = endOfDay(referenceDate);
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const projectNameById = new Map(projects.map((project) => [project.id, project.name]));

  const completedFocusSessions = sessions.filter(
    (session) => session.type === 'focus' && session.status === 'completed'
  );
  const sessionsToday = completedFocusSessions.filter((session) =>
    isBetween(new Date(session.startTime), todayStart, todayEnd)
  );
  const sessionsThisWeek = completedFocusSessions.filter((session) =>
    isBetween(new Date(session.startTime), weekStart, todayEnd)
  );

  const focusByProjectMap = new Map<string, number>();
  for (const session of completedFocusSessions) {
    const projectId = session.projectId ?? 'none';
    focusByProjectMap.set(projectId, (focusByProjectMap.get(projectId) ?? 0) + session.durationMinutes);
  }

  const trend = new Map<string, number>();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() - offset);
    trend.set(format(date, 'yyyy-MM-dd'), 0);
  }
  for (const session of completedFocusSessions) {
    const date = new Date(session.startTime);
    if (differenceInCalendarDays(referenceDate, date) <= 6) {
      const key = format(date, 'yyyy-MM-dd');
      trend.set(key, (trend.get(key) ?? 0) + session.durationMinutes);
    }
  }

  return {
    focusMinutesToday: sessionsToday.reduce((sum, session) => sum + session.durationMinutes, 0),
    focusMinutesWeek: sessionsThisWeek.reduce((sum, session) => sum + session.durationMinutes, 0),
    pomodorosToday: sessionsToday.length,
    completedTasksToday: tasks.filter(
      (task) => task.status === 'done' && isBetween(new Date(task.updatedAt), todayStart, todayEnd)
    ).length,
    interruptions: sessionsToday.reduce((sum, session) => sum + session.interruptions, 0),
    focusByProject: [...focusByProjectMap.entries()].map(([projectId, minutes]) => ({
      projectId,
      projectName: projectNameById.get(projectId) ?? 'Ohne Projekt',
      minutes
    })),
    estimateVsActual: tasks.map((task) => ({
      taskId: task.id,
      taskTitle: task.title,
      estimated: task.estimatedPomodoros,
      actual: task.completedPomodoros
    })),
    productivityTrend: [...trend.entries()].map(([day, minutes]) => ({ day, minutes }))
  };
};

export const sessionsToCsv = (sessions: PomodoroSession[]): string => {
  const header = [
    'id',
    'taskId',
    'projectId',
    'startTime',
    'endTime',
    'durationMinutes',
    'plannedDurationMinutes',
    'type',
    'status',
    'interruptions',
    'focusScore',
    'notes'
  ];
  const rows = sessions.map((session) =>
    header
      .map((key) => {
        const value = session[key as keyof PomodoroSession] ?? '';
        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(',')
  );
  return [header.join(','), ...rows].join('\n');
};
