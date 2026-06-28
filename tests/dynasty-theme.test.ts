import { describe, it, expect } from 'vitest';
import { DynastyThemeSchema } from '@/platform/utils';
import type { DynastyTheme } from '@/platform/types';

// 一个合法的完整主题（构建期硬门的「正例」）。
const valid: DynastyTheme = {
  surface: { paper: '#F5F0E8', bright: '#FFFAF2', dark: '#EDE5D8' },
  ink: { strong: '#2C2C2C', muted: '#51463E', subtle: '#7C6D5F' },
  accent: '#C0392B',
  accentWash: 'rgba(192, 57, 43, 0.08)',
  accentAlt: '#8B4513',
  gold: '#B8860B',
  line: 'rgba(68, 50, 31, 0.12)',
  bgGradient: 'linear-gradient(180deg, #fff, #eee)',
  fonts: {
    display: 'serif',
    heading: 'serif',
    body: 'sans-serif',
    reading: 'serif',
    caption: 'sans-serif',
  },
  decorative: { pattern: 'paper-grain', particle: 'ink-wash' },
  density: 'default',
  shadowTint: 'rgba(68, 50, 31, 0.10)',
  lineInk: '#44321F',
};

describe('DynastyThemeSchema（构建期硬门）', () => {
  it('完整主题通过校验', () => {
    expect(DynastyThemeSchema.safeParse(valid).success).toBe(true);
  });

  it('缺任一语义槽位即拒绝（必填）', () => {
    const { surface, ...missingSurface } = valid;
    void surface;
    expect(DynastyThemeSchema.safeParse(missingSurface).success).toBe(false);

    const missingAccent = { ...valid, accent: undefined };
    expect(DynastyThemeSchema.safeParse(missingAccent).success).toBe(false);

    const partialFonts = { ...valid, fonts: { display: 'serif' } };
    expect(DynastyThemeSchema.safeParse(partialFonts).success).toBe(false);
  });

  it('空字符串槽位被拒绝（.min(1)）', () => {
    expect(DynastyThemeSchema.safeParse({ ...valid, accent: '' }).success).toBe(false);
  });

  it('非法 density 被拒绝（枚举）', () => {
    expect(DynastyThemeSchema.safeParse({ ...valid, density: 'spacious' }).success).toBe(false);
  });

  it('多余字段被拒绝（strictObject，杜绝拼写错位静默丢失）', () => {
    expect(DynastyThemeSchema.safeParse({ ...valid, colors: {} }).success).toBe(false);
  });
});
