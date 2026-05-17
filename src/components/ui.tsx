export const Panel = ({ children, className = '' }: { children: React.ReactNode; className?: string }): JSX.Element => (
  <section className={`rounded-lg border border-line bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 ${className}`}>
    {children}
  </section>
);

export const Button = ({
  children,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }): JSX.Element => {
  const styles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950',
    secondary: 'border border-line bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-red-700 text-white hover:bg-red-600'
  };
  return (
    <button {...props} className={`rounded-md px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${props.className ?? ''}`}>
      {children}
    </button>
  );
};
