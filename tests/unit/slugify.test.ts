import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/slugify';

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Gran Via Madrid')).toBe('gran-via-madrid');
  });

  it('strips Spanish accents and the ñ', () => {
    expect(slugify('Acción Ñoño')).toBe('accion-nono');
    expect(slugify('Distrito Chamartín')).toBe('distrito-chamartin');
  });

  it('drops punctuation and symbols', () => {
    expect(slugify('Metro: ¿L6 cerrada?')).toBe('metro-l6-cerrada');
  });

  it('collapses runs of spaces and underscores into one hyphen', () => {
    expect(slugify('obras   en_el  centro')).toBe('obras-en-el-centro');
  });

  it('trims leading and trailing separators', () => {
    expect(slugify('  — Centro — ')).toBe('centro');
  });

  it('returns an empty string when nothing survives', () => {
    expect(slugify('¡!¿?')).toBe('');
  });
});
