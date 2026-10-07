export const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

// Lunes de esta semana a las 00:00
export const startOfWeek = () => {
  const d = startOfToday();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};

// Date -> "2026-10-20" (en hora local)
export const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// 9300 -> "2h 35m"
export const fmtHM = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
};

// 1500 -> "25:00"
export const fmtClock = (s: number) => {
  const p = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${p(m)}:${p(s % 60)}` : `${p(m)}:${p(s % 60)}`;
};

// Días que faltan para una fecha "AAAA-MM-DD" (negativo = ya pasó)
export const daysUntil = (date: string) =>
  Math.round((new Date(date + 'T00:00:00').getTime() - startOfToday().getTime()) / 86400000);

export const dueLabel = (date: string, done = false) => {
  if (done) return 'Entregada';
  const d = daysUntil(date);
  if (d < 0) return `Vencida hace ${-d} d`;
  if (d === 0) return 'Vence hoy';
  if (d === 1) return 'Vence mañana';
  return `Vence en ${d} días`;
};