import { Bell, Pause, Play, RotateCcw, Square, Volume2, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Panel } from '../../components/ui';
import { useSessionStore } from '../../stores/sessionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { selectFocusTask, useTaskStore } from '../../stores/taskStore';

type TimerState = 'idle' | 'running' | 'paused';

export const PomodoroTimer = (): JSX.Element => {
  const settings = useSettingsStore((state) => state.settings);
  const focusTask = useTaskStore((state) => selectFocusTask(state.tasks));
  const incrementCompletedPomodoros = useTaskStore((state) => state.incrementCompletedPomodoros);
  const startFocusSession = useSessionStore((state) => state.startFocusSession);
  const pauseActive = useSessionStore((state) => state.pauseActive);
  const resumeActive = useSessionStore((state) => state.resumeActive);
  const cancelActive = useSessionStore((state) => state.cancelActive);
  const completeActive = useSessionStore((state) => state.completeActive);
  const addInterruption = useSessionStore((state) => state.addInterruption);
  const activeSession = useSessionStore((state) => state.activeSession);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(settings.focusMinutes * 60);

  useEffect(() => {
    if (timerState === 'idle') setRemainingSeconds(settings.focusMinutes * 60);
  }, [settings.focusMinutes, timerState]);

  useEffect(() => {
    if (timerState !== 'running') return undefined;
    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerState]);

  const progress = useMemo(() => {
    const total = settings.focusMinutes * 60;
    return Math.round(((total - remainingSeconds) / total) * 100);
  }, [remainingSeconds, settings.focusMinutes]);

  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');

  const notify = useCallback((): void => {
    if (!settings.notificationsEnabled || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro abgeschlossen', { body: focusTask?.title ?? 'Fokuszeit beendet' });
    }
  }, [focusTask?.title, settings.notificationsEnabled]);

  const start = async (): Promise<void> => {
    if (!focusTask) return;
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    await startFocusSession(focusTask.id, focusTask.projectId, settings.focusMinutes);
    setRemainingSeconds(settings.focusMinutes * 60);
    setTimerState('running');
  };

  const pause = async (): Promise<void> => {
    await pauseActive();
    setTimerState('paused');
  };

  const resume = async (): Promise<void> => {
    await resumeActive();
    setTimerState('running');
  };

  const cancel = async (): Promise<void> => {
    await cancelActive();
    setRemainingSeconds(settings.focusMinutes * 60);
    setTimerState('idle');
  };

  const finish = useCallback(async (): Promise<void> => {
    const elapsed = Math.max(1, Math.round((settings.focusMinutes * 60 - remainingSeconds) / 60));
    const completed = await completeActive(elapsed);
    if (completed) await incrementCompletedPomodoros(completed.taskId);
    notify();
    setRemainingSeconds(settings.focusMinutes * 60);
    setTimerState('idle');
  }, [completeActive, incrementCompletedPomodoros, notify, remainingSeconds, settings.focusMinutes]);

  useEffect(() => {
    if (remainingSeconds !== 0 || timerState !== 'running') return;
    void finish();
  }, [finish, remainingSeconds, timerState]);

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pomodoro</p>
          <h2 className="text-lg font-semibold">{focusTask?.title ?? 'Keine Fokus-Karte'}</h2>
        </div>
        <Zap className="text-accent" size={20} />
      </div>
      <div className="rounded-lg bg-slate-100 p-5 text-center dark:bg-slate-950">
        <div className="text-5xl font-semibold tabular-nums">{minutes}:{seconds}</div>
        <div className="mt-4 h-2 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {timerState === 'idle' && <Button onClick={() => void start()} disabled={!focusTask}><Play size={16} className="mr-2 inline" /> Start</Button>}
        {timerState === 'running' && <Button onClick={() => void pause()}><Pause size={16} className="mr-2 inline" /> Pause</Button>}
        {timerState === 'paused' && <Button onClick={() => void resume()}><Play size={16} className="mr-2 inline" /> Fortsetzen</Button>}
        <Button variant="secondary" onClick={() => void finish()} disabled={!activeSession}><Square size={16} className="mr-2 inline" /> Abschließen</Button>
        <Button variant="secondary" onClick={() => void addInterruption()} disabled={!activeSession}><Bell size={16} className="mr-2 inline" /> Unterbrechung</Button>
        <Button variant="secondary" onClick={() => void cancel()} disabled={!activeSession}><RotateCcw size={16} className="mr-2 inline" /> Abbrechen</Button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Volume2 size={14} /> Ton optional über Einstellungen.</p>
    </Panel>
  );
};
