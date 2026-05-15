export function fmtRelative(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1)    return 'Ahora mismo';
  if (diff < 60)   return `Hace ${diff}m`;
  if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
  return `Hace ${Math.floor(diff / 1440)}d`;
}

export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1)    return 'Ahora mismo';
  if (diff < 60)   return `Hace ${diff} min`;
  if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
