// ── Category metadata ─────────────────────────────────────────────────────────
// Single source of truth used by pages, components, and query utilities.

export const CATEGORY_DISPLAY: Record<string, {
  name: string; slug: string; color: string;
}> = {
  urban_development: { name: 'Urbanismo',     slug: 'obras',          color: '#c56b2d' },
  transport:         { name: 'Transporte',     slug: 'transporte',     color: '#2563eb' },
  culture:           { name: 'Cultura',        slug: 'cultura',        color: '#6d28d9' },
  environment:       { name: 'Medio ambiente', slug: 'medio-ambiente', color: '#166534' },
  economy:           { name: 'Economía',       slug: 'economia',       color: '#0891b2' },
  safety:            { name: 'Seguridad',      slug: 'seguridad',      color: '#b91c1c' },
  health:            { name: 'Salud',          slug: 'salud',          color: '#be185d' },
  education:         { name: 'Educación',      slug: 'educacion',      color: '#65a30d' },
  tourism:           { name: 'Turismo',        slug: 'turismo',        color: '#b45309' },
  general:           { name: 'General',        slug: 'general',        color: '#9b8c7e' },
};

// Derived label map — backward-compatible with existing imports
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_DISPLAY).map(([k, v]) => [k, v.name])
);

// Maps report category to LiveCard visual type
export const CATEGORY_TO_CARD: Record<string, string> = {
  transport:         'metro',
  safety:            'alert',
  culture:           'culture',
  environment:       'weather',
  urban_development: 'alert',
  economy:           'metro',
  health:            'alert',
  education:         'culture',
  tourism:           'culture',
  general:           'alert',
};

export const FEED_COLORS = ['blue', 'red', 'amber', 'purple', 'green'] as const;
export type FeedColor = (typeof FEED_COLORS)[number];

// ── Status metadata ───────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  draft:     'Borrador',
  published: 'Publicado',
  archived:  'Archivado',
};

// Admin-only — Tailwind classes kept here, not used in public pages
export const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived:  'bg-gray-100 text-gray-500',
};
