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
  completeActive: (actualMinutes: number) => Promise<PomodoroSession | undefined>;
  addInterruption: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  async load() {
    set({ sessions: await sessionRepository.all() });
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
    const updated = { ...active, status: 'paused' as const };
    await sessionRepository.put(updated);
    set({ activeSession: updated, sessions: get().sessions.map((session) => (session.id === updated.id ? updated : session)) });
  },
  async resumeActive() {
    const active = get().activeSession;
    if (!active) return;
    const updated = { ...active, status: 'running' as const };
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
  async completeActive(actualMinutes) {
    const active = get().activeSession;
    if (!active) return undefined;
    const updated = {
      ...active,
      status: 'completed' as const,
      durationMinutes: actualMinutes,
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
