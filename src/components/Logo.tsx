export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center rounded-md bg-accent shadow-glow">
        <span className="absolute inset-1 rounded border border-white/20" />
        <span className="font-black leading-none text-white">H</span>
      </div>
      <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Hatrix</span>
    </div>
  );
}
