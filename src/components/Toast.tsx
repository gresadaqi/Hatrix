import { FiCheck } from 'react-icons/fi';

type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[95] flex max-w-xs items-center gap-3 rounded-xl border border-white/10 bg-panel px-4 py-3 text-sm text-white shadow-card" aria-live="polite">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent">
        <FiCheck />
      </span>
      {message}
    </div>
  );
}
