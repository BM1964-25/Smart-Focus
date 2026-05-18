import { create } from 'zustand';
import { sessionRepository } from '../repositories/sessionRepository';
import type { PomodoroSession } from '../types/domain';
import { createId, nowIso } from '../utils/id';

interface SessionState {
  sessions: PomodoroSession[];
  activeSession?: PomodoroSession;
  load: () => Promise<void>;
  startFocusSession: (taskId: string, projectId: string | undefined, plannedDurationMinutes: number) => Promise<PomodoroSession>;
  pauseActive: () => Promise<void>;
  resumeActive: () => Promise<void>;
  cancelActive: () => Promise<void>;
  completeActive: (actualMinutes: number, details?: { notes?: string; focusScore?: number }) => Promise<PomodoroSession | undefined>;
  addInterruption: () => Promise<void>;
}

const elapsedMinutesSince = (iso: string): number =>
  Math.max(0, (Date.now() - new Date(iso).getTime()) / 60_000);

const activeStatuses = new Set<PomodoroSession['status']>(['running', 'paused']);

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  async load() {
    const sessions = await sessionRepository.all();
    const activeSession = sessions
      .filter((session) => activeStatuses.has(session.status))
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
    set({ sessions, activeSession });
  },
  async startFocusSession(taskId, projectId, plannedDurationMinutes) {
    const session: PomodoroSession = {
      id: createId('session'),
      taskId,
      projectId,
      startTime: nowIso(),
      durationMinutes: 0,
      plannedDurationMinutes,
      type: 'focus',
      status: 'running',
      interruptions: 0,
      notes: ''
    };
    await sessionRepository.put(session);
    set({ activeSession: session, sessions: [...get().sessions, session] });
    return session;
  },
  async pauseActive() {
    const active = get().activeSession;
    if (!active) return;
    const updated = {
      ...active,
      status: 'paused' as const,
      durationMinutes: active.durationMinutes + elapsedMinutesSince(active.startTime)
    };
    await sessionRepository.put(updated);
    set({ activeSession: updated, sessions: get().sessions.map((session) => (session.id === updated.id ? updated : session)) });
  },
  async resumeActive() {
    const active = get().activeSession;
    if (!active) return;
    const updated = { ...active, status: 'running' as const, startTime: nowIso() };
    await sessionRepository.put(updated);
    set({ activeSession: updated, sessions: get().sessions.map((session) => (session.id === updated.id ? updated : session)) });
  },
  async cancelActive() {
    const active = get().activeSession;
    if (!active) return;
    const updated = { ...active, status: 'cancelled' as const, endTime: nowIso() };
    await sessionRepository.put(updated);
    set({ activeSession: undefined, sessions: get().sessions.map((session) => (session.id === updated.id ? updated : session)) });
  },
  async completeActive(actualMinutes, details) {
    const active = get().activeSession;
    if (!active) return undefined;
    const updated = {
      ...active,
      status: 'completed' as const,
      durationMinutes: actualMinutes,
      notes: details?.notes ?? active.notes,
      focusScore: details?.focusScore,
      endTime: nowIso()
    };
    await sessionRepository.put(updated);
    set({ activeSession: undefined, sessions: get().sessions.map((session) => (session.id === updated.id ? updated : session)) });
    return updated;
  },
  async addInterruption() {
    const active = get().activeSession;
    if (!active) return;
    const updated = { ...active, interruptions: active.interruptions + 1 };
    await sessionRepository.put(updated);
    set({ activeSession: updated, sessions: get().sessions.map((session) => (session.id === updated.id ? updated : session)) });
  }
}));
