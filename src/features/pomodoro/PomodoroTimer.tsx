import { Bell, Pause, Play, RotateCcw, Square, Volume2, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Panel } from '../../components/ui';
import { useSessionStore } from '../../stores/sessionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { selectFocusTask, useTaskStore } from '../../stores/taskStore';

type TimerState = 'idle' | 'running' | 'paused';
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const remainingForSession = (session: { durationMinutes: number; plannedDurationMinutes: number; startTime: string; status: TimerState }): number => {
  const accumulatedSeconds = session.durationMinutes * 60;
  const runningSeconds = session.status === 'running' ? Math.max(0, (Date.now() - new Date(session.startTime).getTime()) / 1000) : 0;
  return Math.max(0, Math.round(session.plannedDurationMinutes * 60 - accumulatedSeconds - runningSeconds));
};

export const PomodoroTimer = (): JSX.Element => {
  const settings = useSettingsStore((state) => state.settings);
  const focusTask = useTaskStore((state) => selectFocusTask(state.tasks));
  const incrementCompletedPomodoros = useTaskStore((state) => state.incrementCompletedPomodoros);
  const moveTask = useTaskStore((state) => state.moveTask);
  const startFocusSession = useSessionStore((state) => state.startFocusSession);
  const pauseActive = useSessionStore((state) => state.pauseActive);
  const resumeActive = useSessionStore((state) => state.resumeActive);
  const cancelActive = useSessionStore((state) => state.cancelActive);
  const completeActive = useSessionStore((state) => state.completeActive);
  const addInterruption = useSessionStore((state) => state.addInterruption);
  const activeSession = useSessionStore((state) => state.activeSession);
  const completedFocusSessions = useSessionStore((state) => state.sessions.filter((session) => session.status === 'completed' && session.type === 'focus')).length;
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const modeMinutes =
    timerMode === 'focus' ? settings.focusMinutes : timerMode === 'shortBreak' ? settings.shortBreakMinutes : settings.longBreakMinutes;
  const [remainingSeconds, setRemainingSeconds] = useState(modeMinutes * 60);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [finishNotes, setFinishNotes] = useState('');
  const [focusScore, setFocusScore] = useState(4);
  const [markDone, setMarkDone] = useState(false);
  const ringRadius = 86;
  const ringCircumference = 2 * Math.PI * ringRadius;

  useEffect(() => {
    if (activeSession?.status === 'running' || activeSession?.status === 'paused') {
      setTimerMode('focus');
      setTimerState(activeSession.status);
      setRemainingSeconds(remainingForSession({
        durationMinutes: activeSession.durationMinutes,
        plannedDurationMinutes: activeSession.plannedDurationMinutes,
        startTime: activeSession.startTime,
        status: activeSession.status
      }));
      return;
    }
    if (timerState === 'idle') setRemainingSeconds(modeMinutes * 60);
  }, [activeSession, modeMinutes, timerState]);

  useEffect(() => {
    if (timerState !== 'running') return undefined;
    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerState]);

  const progress = useMemo(() => {
    const total = modeMinutes * 60;
    return Math.round(((total - remainingSeconds) / total) * 100);
  }, [modeMinutes, remainingSeconds]);
  const ringOffset = ringCircumference - (progress / 100) * ringCircumference;

  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');

  const notify = useCallback((): void => {
    if (!settings.notificationsEnabled || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro abgeschlossen', { body: focusTask?.title ?? 'Fokuszeit beendet' });
    }
  }, [focusTask?.title, settings.notificationsEnabled]);

  const start = async (): Promise<void> => {
    if (timerMode === 'focus' && !focusTask) return;
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (timerMode === 'focus' && focusTask) {
      const session = await startFocusSession(focusTask.id, focusTask.projectId, settings.focusMinutes);
      setFinishNotes(session.notes);
    }
    setRemainingSeconds(modeMinutes * 60);
    setTimerState('running');
  };

  const pause = async (): Promise<void> => {
    if (timerMode === 'focus') await pauseActive();
    setTimerState('paused');
  };

  const resume = async (): Promise<void> => {
    if (timerMode === 'focus') await resumeActive();
    setTimerState('running');
  };

  const cancel = async (): Promise<void> => {
    if (timerMode === 'focus') await cancelActive();
    setRemainingSeconds(modeMinutes * 60);
    setTimerState('idle');
  };

  const finish = useCallback(async (details?: { notes?: string; focusScore?: number; markDone?: boolean }): Promise<void> => {
    if (timerMode !== 'focus') {
      notify();
      setRemainingSeconds(modeMinutes * 60);
      setTimerState('idle');
      return;
    }
    const elapsed = Math.max(1, Math.round((settings.focusMinutes * 60 - remainingSeconds) / 60));
    const completed = await completeActive(elapsed, {
      notes: details?.notes,
      focusScore: details?.focusScore
    });
    if (completed) await incrementCompletedPomodoros(completed.taskId);
    if (completed && details?.markDone) await moveTask(completed.taskId, 'done');
    notify();
    setRemainingSeconds(settings.focusMinutes * 60);
    setTimerState('idle');
    setShowFinishDialog(false);
    setFinishNotes('');
    setFocusScore(4);
    setMarkDone(false);
  }, [completeActive, incrementCompletedPomodoros, modeMinutes, moveTask, notify, remainingSeconds, settings.focusMinutes, timerMode]);

  useEffect(() => {
    if (remainingSeconds !== 0 || timerState !== 'running') return;
    if (timerMode === 'focus') setShowFinishDialog(true);
    else void finish();
  }, [finish, remainingSeconds, timerMode, timerState]);

  const selectMode = (mode: TimerMode): void => {
    if (timerState !== 'idle') return;
    setTimerMode(mode);
  };

  const modeLabel = timerMode === 'focus' ? 'Fokus' : timerMode === 'shortBreak' ? 'Kurzpause' : 'Langpause';
  const nextBreakLabel = (completedFocusSessions + 1) % settings.longBreakEvery === 0 ? 'Nächste Pause: lang' : 'Nächste Pause: kurz';

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pomodoro</p>
          <h2 className="text-lg font-semibold">{timerMode === 'focus' ? focusTask?.title ?? 'Keine Fokus-Karte' : modeLabel}</h2>
        </div>
        <Zap className="text-accent" size={20} />
      </div>
      <div className="mb-3 grid grid-cols-3 rounded-md border border-line p-0.5 dark:border-slate-700">
        {([
          ['focus', 'Fokus'],
          ['shortBreak', 'Kurzpause'],
          ['longBreak', 'Langpause']
        ] as const).map(([mode, label]) => (
          <button
            className={`rounded px-2 py-1.5 text-xs font-medium transition ${
              timerMode === mode ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950' : 'text-slate-500'
            } ${timerState !== 'idle' ? 'cursor-not-allowed opacity-70' : ''}`}
            disabled={timerState !== 'idle'}
            key={mode}
            onClick={() => selectMode(mode)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-slate-100 p-5 text-center dark:bg-slate-950">
        <div className="mx-auto flex max-w-[300px] flex-col items-center">
          <div className="relative h-60 w-60">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220" aria-hidden>
              <circle
                cx="110"
                cy="110"
                fill="none"
                r={ringRadius}
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-200 dark:text-slate-800"
              />
              {Array.from({ length: 60 }, (_, index) => {
                const major = index % 5 === 0;
                const angle = (index / 60) * 2 * Math.PI;
                const outer = 102;
                const inner = major ? 94 : 98;
                const x1 = 110 + Math.cos(angle) * inner;
                const y1 = 110 + Math.sin(angle) * inner;
                const x2 = 110 + Math.cos(angle) * outer;
                const y2 = 110 + Math.sin(angle) * outer;
                return (
                  <line
                    className={major ? 'text-slate-400 dark:text-slate-500' : 'text-slate-300 dark:text-slate-700'}
                    key={index}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth={major ? 2 : 1}
                    x1={x1}
                    x2={x2}
                    y1={y1}
                    y2={y2}
                  />
                );
              })}
              <circle
                cx="110"
                cy="110"
                fill="none"
                r={ringRadius}
                stroke="currentColor"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                strokeWidth="10"
                className="text-accent transition-[stroke-dashoffset] duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-semibold tabular-nums">{minutes}:{seconds}</div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                {timerState === 'running' ? `${modeLabel} läuft` : timerState === 'paused' ? 'Pausiert' : 'Bereit'}
              </p>
              <p className="mt-1 text-sm text-slate-500">{progress}% abgeschlossen</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {timerState === 'idle' && <Button onClick={() => void start()} disabled={timerMode === 'focus' && !focusTask}><Play size={16} className="mr-2 inline" /> Start</Button>}
        {timerState === 'running' && <Button onClick={() => void pause()}><Pause size={16} className="mr-2 inline" /> Pause</Button>}
        {timerState === 'paused' && <Button onClick={() => void resume()}><Play size={16} className="mr-2 inline" /> Fortsetzen</Button>}
        <Button variant="secondary" onClick={() => setShowFinishDialog(true)} disabled={timerMode === 'focus' ? !activeSession : timerState === 'idle'}><Square size={16} className="mr-2 inline" /> Abschließen</Button>
        <Button variant="secondary" onClick={() => void addInterruption()} disabled={timerMode !== 'focus' || !activeSession}><Bell size={16} className="mr-2 inline" /> Unterbrechung</Button>
        <Button variant="secondary" onClick={() => void cancel()} disabled={timerState === 'idle'}><RotateCcw size={16} className="mr-2 inline" /> Abbrechen</Button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Volume2 size={14} /> Ton optional über Einstellungen. {nextBreakLabel}.</p>
      {showFinishDialog && activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-lg border border-line bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Pomodoro abschließen</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Ergänze optional Notizen und Fokusqualität. Diese Daten verbessern Reports und KI-Auswertungen.
            </p>
            <label className="mt-4 block text-sm">
              Session-Notiz
              <textarea
                className="mt-1 min-h-24 w-full rounded-md border border-line p-3 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Was wurde erreicht? Gab es Störungen?"
                value={finishNotes}
                onChange={(event) => setFinishNotes(event.target.value)}
              />
            </label>
            <label className="mt-3 block text-sm">
              Fokus-Score: {focusScore}/5
              <input
                className="mt-2 w-full"
                max={5}
                min={1}
                type="range"
                value={focusScore}
                onChange={(event) => setFocusScore(Number(event.target.value))}
              />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input checked={markDone} type="checkbox" onChange={(event) => setMarkDone(event.target.checked)} />
              Fokus-Aufgabe als erledigt markieren
            </label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowFinishDialog(false)}>Zurück</Button>
              <Button onClick={() => void finish({ notes: finishNotes, focusScore, markDone })}>Session speichern</Button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
};
