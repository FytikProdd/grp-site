/* SVG-иконки в стиле золотого герба GRP (currentColor = золото из CSS) */
const ICONS = {
  eagle: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 6 L36 14 L48 12 L42 22 L54 28 L42 30 L44 44 L32 36 L20 44 L22 30 L10 28 L22 22 L16 12 L28 14 Z" fill="currentColor" opacity="0.3"/>
      <path d="M32 14c-2 6-8 10-14 12 4 2 8 8 10 14 2-4 6-8 10-10 2 6 6 10 12 12-4-8-6-14-4-20-6 0-10-4-14-8z" fill="currentColor"/>
      <circle cx="32" cy="10" r="3" fill="currentColor"/>
      <path d="M20 48c4 4 8 6 12 6s8-2 12-6" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M16 52c6 4 12 6 16 6s10-2 16-6" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7"/>
    </svg>`,
  doors: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="12" y="8" width="18" height="48" rx="1" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.15"/>
      <rect x="34" y="8" width="18" height="48" rx="1" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.15"/>
      <rect x="16" y="14" width="10" height="14" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="38" y="14" width="10" height="14" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="16" y="34" width="10" height="14" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="38" y="34" width="10" height="14" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="28" cy="32" r="1.5" fill="currentColor"/>
      <circle cx="36" cy="32" r="1.5" fill="currentColor"/>
    </svg>`,
  columns: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 18 L32 8 L54 18" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.2"/>
      <rect x="14" y="18" width="6" height="30" fill="currentColor" fill-opacity="0.85"/>
      <rect x="29" y="18" width="6" height="30" fill="currentColor" fill-opacity="0.85"/>
      <rect x="44" y="18" width="6" height="30" fill="currentColor" fill-opacity="0.85"/>
      <rect x="10" y="48" width="44" height="6" rx="1" fill="currentColor"/>
      <path d="M8 54h48" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  gear: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 8l3 6 7-1 2 6 6 2-1 7 6 3-3 6 1 7-6 2-2 6-7-1-3 6-6-3-7 1-2-6-6-2 1-7-6-3 3-6-1-7 6-2 2-6 7 1 3-6z" fill="currentColor" fill-opacity="0.9"/>
      <circle cx="32" cy="32" r="10" fill="#0a0a0a" stroke="currentColor" stroke-width="2"/>
      <path d="M26 38l12-12M28 28h8v8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  chart: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="36" width="10" height="16" rx="1" fill="currentColor" fill-opacity="0.7"/>
      <rect x="24" y="26" width="10" height="26" rx="1" fill="currentColor" fill-opacity="0.85"/>
      <rect x="38" y="14" width="10" height="38" rx="1" fill="currentColor"/>
      <path d="M12 34l12-10 10 4 14-16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="48" cy="12" r="8" fill="#0a0a0a" stroke="currentColor" stroke-width="2"/>
      <text x="48" y="16" text-anchor="middle" fill="currentColor" font-size="10" font-family="serif" font-weight="700">₽</text>
    </svg>`,
  foundry: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="32" cy="48" rx="18" ry="6" fill="currentColor" fill-opacity="0.4"/>
      <path d="M16 44c0-4 6-8 16-8s16 4 16 8" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.2"/>
      <path d="M24 20c0-6 4-10 8-10s8 4 8 10c0 8-4 14-8 18-4-4-8-10-8-18z" fill="currentColor" fill-opacity="0.55"/>
      <path d="M28 36c2 4 4 8 4 10 0-2 2-6 4-10" stroke="#FFB347" stroke-width="2" fill="none"/>
      <circle cx="32" cy="14" r="3" fill="#FFD700"/>
    </svg>`,
  wheat: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="42" r="14" fill="currentColor" fill-opacity="0.25"/>
      <path d="M8 48c8-4 16-6 24-6s16 2 24 6" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M18 40c0-8 4-16 8-22M32 44V14M46 40c0-8-4-16-8-22" stroke="currentColor" stroke-width="2"/>
      <ellipse cx="22" cy="22" rx="3" ry="6" fill="currentColor" transform="rotate(-20 22 22)"/>
      <ellipse cx="32" cy="16" rx="3" ry="6" fill="currentColor"/>
      <ellipse cx="42" cy="22" rx="3" ry="6" fill="currentColor" transform="rotate(20 42 22)"/>
      <circle cx="32" cy="48" r="4" fill="#FFD700"/>
    </svg>`,
  truck: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="24" width="28" height="18" rx="2" fill="currentColor" fill-opacity="0.85"/>
      <path d="M34 30h12l8 8v4H34V30z" fill="currentColor" fill-opacity="0.9"/>
      <rect x="36" y="32" width="8" height="6" fill="#0a0a0a" opacity="0.5"/>
      <circle cx="16" cy="46" r="5" fill="#0a0a0a" stroke="currentColor" stroke-width="2"/>
      <circle cx="46" cy="46" r="5" fill="#0a0a0a" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  crane: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 54V16l24-8v8" stroke="currentColor" stroke-width="2.5" fill="none"/>
      <path d="M20 16h28" stroke="currentColor" stroke-width="2.5"/>
      <path d="M44 16v20" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
      <rect x="38" y="36" width="12" height="10" fill="currentColor" fill-opacity="0.8"/>
      <rect x="12" y="40" width="16" height="14" fill="currentColor" fill-opacity="0.5"/>
      <path d="M10 54h44" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  medicine: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 8v40" stroke="currentColor" stroke-width="3"/>
      <path d="M32 16c8 4 12 10 12 16s-4 10-12 12c-8-2-12-6-12-12s4-12 12-16z" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M24 28c4 2 8 2 12 0M28 36c2 2 6 2 8 0" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M44 44h12M50 38v12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="52" r="3" fill="currentColor"/>
    </svg>`,
  education: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 28 L32 16 L56 28 L32 40 Z" fill="currentColor" fill-opacity="0.85"/>
      <path d="M16 32v12c0 4 8 8 16 8s16-4 16-8V32" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M56 28v14" stroke="currentColor" stroke-width="2"/>
      <circle cx="56" cy="44" r="3" fill="currentColor"/>
      <path d="M28 12l4-4 4 4-4 2z" fill="currentColor"/>
    </svg>`,
  road: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 48c12-8 16-20 20-32 2 8 6 20 12 28 4-6 8-12 16-16" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M8 52c14-6 18-18 22-30 2 10 8 22 14 28" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`,
  arts: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 12c0 12 4 20 4 28h-4c0-8-4-16-4-28h4z" fill="currentColor"/>
      <path d="M16 12c4 2 8 2 12 0M16 18c4 2 8 2 12 0M16 24c3 1 7 1 10 0" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="40" cy="28" r="10" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.2"/>
      <path d="M34 28c0-4 3-6 6-6M46 28c0 4-3 6-6 6" stroke="currentColor" stroke-width="1.5"/>
      <path d="M48 40l6 12M50 44h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  trophy: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 12h24v8c0 10-6 16-12 18-6-2-12-8-12-18V12z" fill="currentColor" fill-opacity="0.9"/>
      <path d="M20 16h-8c0 8 4 12 8 14M44 16h8c0 8-4 12-8 14" stroke="currentColor" stroke-width="2.5" fill="none"/>
      <rect x="28" y="38" width="8" height="8" fill="currentColor"/>
      <rect x="20" y="46" width="24" height="6" rx="1" fill="currentColor"/>
      <path d="M14 52c6 4 12 6 18 6s12-2 18-6" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/>
    </svg>`,
  travel: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 44 L24 16 L36 36 L44 22 L56 44 Z" fill="currentColor" fill-opacity="0.85"/>
      <path d="M28 44 L36 32 L48 44" fill="currentColor" fill-opacity="0.5"/>
      <path d="M22 44h-4l4-8 6 4-2 4h-4z" fill="currentColor"/>
      <rect x="20" y="40" width="10" height="8" fill="currentColor"/>
      <path d="M22 40l3-4 3 4" fill="currentColor"/>
      <path d="M50 36c2 0 4 4 2 8M54 34c2 2 4 6 2 10" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
  info: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="12" width="36" height="28" rx="2" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.15"/>
      <rect x="12" y="16" width="28" height="18" fill="currentColor" fill-opacity="0.35"/>
      <path d="M18 44h16v4H18z" fill="currentColor"/>
      <circle cx="48" cy="40" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="48" cy="40" r="3" fill="currentColor"/>
      <path d="M42 34l-4-4M54 34l4-4M42 46l-4 4M54 46l4 4" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
  atom: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="currentColor" stroke-width="2" fill="none" transform="rotate(60 32 32)"/>
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="currentColor" stroke-width="2" fill="none" transform="rotate(-60 32 32)"/>
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="32" cy="32" r="5" fill="currentColor"/>
      <circle cx="50" cy="28" r="2.5" fill="currentColor"/>
      <circle cx="18" cy="40" r="2.5" fill="currentColor"/>
    </svg>`,
  instruments: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="28" cy="28" r="14" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.15"/>
      <circle cx="28" cy="28" r="5" fill="currentColor" fill-opacity="0.5"/>
      <path d="M28 14v4M28 38v4M14 28h4M38 28h4" stroke="currentColor" stroke-width="2"/>
      <path d="M36 36l14 14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M46 46l6-2-2 6" fill="currentColor"/>
      <circle cx="48" cy="20" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M48 16v8M45 20h6" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
  chem: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 12h16v8c0 4-2 8-6 14l-6 10c-2 4 0 8 6 8h0c6 0 8-4 6-8l-6-10c-4-6-6-10-6-14V12z" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.2"/>
      <path d="M26 40h12" stroke="currentColor" stroke-width="2" opacity="0.6"/>
      <rect x="42" y="28" width="8" height="24" fill="currentColor" fill-opacity="0.7"/>
      <rect x="50" y="36" width="6" height="16" fill="currentColor" fill-opacity="0.5"/>
      <circle cx="32" cy="20" r="2" fill="#FFD700"/>
    </svg>`,
  forest: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16 40 L24 16 L32 40 Z" fill="currentColor" fill-opacity="0.9"/>
      <path d="M28 44 L36 20 L44 44 Z" fill="currentColor" fill-opacity="0.7"/>
      <path d="M8 48 L14 32 L20 48 Z" fill="currentColor" fill-opacity="0.5"/>
      <rect x="22" y="40" width="4" height="12" fill="currentColor"/>
      <rect x="34" y="44" width="4" height="8" fill="currentColor"/>
      <ellipse cx="48" cy="50" rx="10" ry="4" fill="currentColor" fill-opacity="0.6"/>
      <circle cx="52" cy="28" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M52 24v8M49 28h6" stroke="currentColor" stroke-width="1.2"/>
    </svg>`,
};
