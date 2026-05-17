import { Download } from 'lucide-react';
import { Button, Panel } from '../../components/ui';
import { sessionsToCsv } from '../../services/reportingService';
import { useProjectStore } from '../../stores/projectStore';
import { useSessionStore } from '../../stores/sessionStore';

const downloadText = (name: string, content: string, type: string): void => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const ReportsView = (): JSX.Element => {
  const sessions = useSessionStore((state) => state.sessions);
  const projects = useProjectStore((state) => state.projects);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Button onClick={() => downloadText('pomodoro-sessions.csv', sessionsToCsv(sessions), 'text/csv')}><Download size={16} className="mr-2 inline" /> CSV</Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel><h2 className="font-semibold">Tagesreport</h2><p className="mt-2 text-sm text-slate-500">Heute wurden {sessions.filter((s) => s.status === 'completed').length} abgeschlossene Sessions erfasst.</p></Panel>
        <Panel><h2 className="font-semibold">Wochenreport</h2><p className="mt-2 text-sm text-slate-500">Die Wochenansicht nutzt alle lokalen Sessions und ist bereit für KI-Zusammenfassungen.</p></Panel>
        <Panel><h2 className="font-semibold">Projektreport</h2><p className="mt-2 text-sm text-slate-500">{projects.length} aktive Projektkontexte verfügbar.</p></Panel>
      </div>
      <Panel>
        <h2 className="mb-3 font-semibold">Session-Historie</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Start</th><th>Task</th><th>Dauer</th><th>Status</th><th>Unterbrechungen</th></tr></thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-t border-line dark:border-slate-800">
                  <td className="py-2">{new Date(session.startTime).toLocaleString()}</td>
                  <td>{session.taskId}</td>
                  <td>{session.durationMinutes} min</td>
                  <td>{session.status}</td>
                  <td>{session.interruptions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
