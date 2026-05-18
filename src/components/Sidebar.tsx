import type { LucideIcon } from 'lucide-react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ViewKey } from '../app/App';
import { useSettingsStore } from '../stores/settingsStore';

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
}: Props): JSX.Element => {
  const licenseKey = useSettingsStore((state) => state.settings.licenseKey);
  const [aiConfigured, setAiConfigured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAiStatus = async (): Promise<void> => {
      try {
        const response = await fetch('/api/health');
        const payload = (await response.json()) as { aiConfigured?: boolean };
        if (!cancelled) setAiConfigured(Boolean(payload.aiConfigured));
      } catch {
        if (!cancelled) setAiConfigured(false);
      }
    };
    void checkAiStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside
      className={`flex min-h-screen flex-col border-r border-line bg-white px-3 py-5 transition-all dark:border-slate-800 dark:bg-slate-900 ${
        collapsed ? 'w-[76px]' : 'w-full'
      }`}
    >
      <div className={`mb-6 ${collapsed ? 'hidden' : 'block'}`}>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-7">SMART Focus</h1>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Deep Work & Productivity System
            </p>
          </div>
        )}
      </div>
      <div className={`mb-2 flex ${collapsed ? 'justify-center' : 'justify-start'}`}>
        <button
          type="button"
          className={`rounded-md p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${
            collapsed ? '' : 'ml-1'
          }`}
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
      {!collapsed && (
        <div className="mt-auto border-t border-line pt-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <span className="font-medium text-slate-700 dark:text-slate-200">Lizenz</span>
            <span>{licenseKey ? 'Aktiviert' : 'Nicht aktiviert'}</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">KI</span>
            <span>{aiConfigured ? 'KI verfügbar' : 'KI nicht eingerichtet'}</span>
          </div>
          <div className="mt-3 border-t border-line pt-3 text-center dark:border-slate-800">
            <p>© 2026 BuiltSmart AI</p>
            <p>powered by BuiltSmart Hub</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-center">
            <a className="hover:text-slate-900 dark:hover:text-slate-100" href="https://www.built-smart-hub.com/impressum" rel="noreferrer" target="_blank">Impressum</a>
            <span>|</span>
            <a className="hover:text-slate-900 dark:hover:text-slate-100" href="https://www.built-smart-hub.com/datenschutz" rel="noreferrer" target="_blank">Datenschutz</a>
            <span>|</span>
            <a className="hover:text-slate-900 dark:hover:text-slate-100" href="https://www.built-smart-hub.com/agb" rel="noreferrer" target="_blank">AGB</a>
            <span>|</span>
            <a className="hover:text-slate-900 dark:hover:text-slate-100" href="https://www.built-smart-hub.com/widerrufsbelehrung" rel="noreferrer" target="_blank">Widerrufsbelehrung</a>
          </div>
        </div>
      )}
    </aside>
  );
};
