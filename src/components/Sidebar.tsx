import type { LucideIcon } from 'lucide-react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { ViewKey } from '../app/App';

interface Props {
  items: Array<{ key: ViewKey; label: string; icon: LucideIcon }>;
  activeView: ViewKey;
  collapsed: boolean;
  onNavigate: (view: ViewKey) => void;
  onToggleCollapsed: () => void;
}

export const Sidebar = ({
  items,
  activeView,
  collapsed,
  onNavigate,
  onToggleCollapsed
}: Props): JSX.Element => (
  <aside
    className={`border-r border-line bg-white px-3 py-5 transition-all dark:border-slate-800 dark:bg-slate-900 ${
      collapsed ? 'w-[76px]' : 'w-full'
    }`}
  >
    <div className={`mb-8 flex items-start ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
      {!collapsed && (
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold leading-7">SMART Focus</h1>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Deep Work & Productivity System
          </p>
        </div>
      )}
      <button
        type="button"
        className="rounded-md border border-line p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
        title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>
    </div>
    <nav className="space-y-1" aria-label="Hauptnavigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.key === activeView;
        return (
          <button
            key={item.key}
            className={`flex w-full items-center rounded-md py-2 text-left text-sm transition ${
              collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            } ${
              active ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            onClick={() => onNavigate(item.key)}
            type="button"
            aria-label={item.label}
            title={collapsed ? item.label : undefined}
          >
            <Icon size={18} aria-hidden />
            {!collapsed && item.label}
          </button>
        );
      })}
    </nav>
  </aside>
);
