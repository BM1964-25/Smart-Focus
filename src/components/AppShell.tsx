import { BarChart3, CalendarDays, HelpCircle, KanbanSquare, Settings, Timer, Upload, Workflow } from 'lucide-react';
import { useState } from 'react';
import type { ViewKey } from '../app/App';
import { AiAssistantPanel } from '../features/ai/AiAssistantPanel';
import { Sidebar } from './Sidebar';

interface Props {
  activeView: ViewKey;
  showAiAssistant: boolean;
  onNavigate: (view: ViewKey) => void;
  children: React.ReactNode;
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'kanban', label: 'Kanban', icon: KanbanSquare },
  { key: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { key: 'planner', label: 'Tagesplanung', icon: CalendarDays },
  { key: 'reports', label: 'Reports', icon: Workflow },
  { key: 'importExport', label: 'Import/Export', icon: Upload },
  { key: 'settings', label: 'Einstellungen', icon: Settings },
  { key: 'help', label: 'Hilfe', icon: HelpCircle }
] satisfies Array<{ key: ViewKey; label: string; icon: typeof BarChart3 }>;

export const AppShell = ({ activeView, showAiAssistant, onNavigate, children }: Props): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-quiet text-ink dark:bg-slate-950 dark:text-slate-100">
      <div
        className="grid min-h-screen transition-[grid-template-columns] duration-200"
        style={{
          gridTemplateColumns: sidebarCollapsed ? '76px minmax(0, 1fr)' : '248px minmax(0, 1fr)'
        }}
      >
        <Sidebar
          items={navItems}
          activeView={activeView}
          collapsed={sidebarCollapsed}
          onNavigate={onNavigate}
          onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <div className="min-w-0">
          <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6 lg:px-8">
            {children}
            {showAiAssistant && <AiAssistantPanel view={activeView} />}
          </div>
        </div>
      </div>
    </div>
  );
};
