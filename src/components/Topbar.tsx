import { ShieldCheck } from 'lucide-react';

export const Topbar = (): JSX.Element => (
  <header className="sticky top-0 z-20 border-b border-line bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold leading-7">SMART Focus</h2>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Deep Work & Productivity System
        </p>
      </div>
      <div className="hidden items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300 sm:flex">
        <ShieldCheck size={17} />
        API-Key bleibt im Backend
      </div>
    </div>
  </header>
);
