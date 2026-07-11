import hatrixLogo from '../assets/hatrix.png';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img className="h-10 w-10 rounded-md object-contain shadow-glow" src={hatrixLogo} alt="Hatrix logo" />
      <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Hatrix</span>
    </div>
  );
}
