import { describe, it, expect } from 'vitest';
import { themeToCssVars } from '@/platform/utils';
import type { DynastyTheme } from '@/platform/types';

// 合成主题：每个槽位填可辨识占位值，精确钉住「语义令牌 → CSS 变量名」映射契约。
const sample: DynastyTheme = {
  surface: { paper: 'P', bright: 'PB', dark: 'PD' },
  ink: { strong: 'IS', muted: 'IM', subtle: 'ISU' },
  accent: 'AC',
  accentWash: 'AW',
  accentAlt: 'AA',
  gold: 'GO',
  line: 'LN',
  bgGradient: 'BG',
  fonts: { display: 'FD', heading: 'FH', body: 'FB', reading: 'FR', caption: 'FC' },
  decorative: { pattern: 'PAT', particle: 'PAR' },
  density: 'airy',
  shadowTint: 'ST',
  lineInk: 'LI',
};

describe('themeToCssVars', () => {
  it('把语义令牌映射到既有 CSS 叶子变量名（accent→--vermillion 历史命名、line→--border/--input）', () => {
    expect(themeToCssVars(sample)).toEqual({
      '--paper': 'P',
      '--paper-bright': 'PB',
      '--paper-dark': 'PD',
      '--ink-strong': 'IS',
      '--ink-muted': 'IM',
      '--ink-subtle': 'ISU',
      '--vermillion': 'AC',
      '--vermillion-wash': 'AW',
      '--accent-alt': 'AA',
      '--gold': 'GO',
      '--border': 'LN',
      '--input': 'LN',
      '--bg-gradient': 'BG',
      '--font-display': 'FD',
      '--font-heading': 'FH',
      '--font-body': 'FB',
      '--font-reading': 'FR',
      '--font-caption': 'FC',
      '--shadow-tint': 'ST',
      '--line-ink': 'LI',
    });
  });

  it('不产出派生令牌（--background/--primary 等按 CSS 间接性在子树内自动重解析）', () => {
    const keys = Object.keys(themeToCssVars(sample));
    expect(keys).not.toContain('--background');
    expect(keys).not.toContain('--foreground');
    expect(keys).not.toContain('--primary');
  });

  it('确定性：同输入恒等同输出且键序稳定（可水合、无 FOUC）', () => {
    const a = themeToCssVars(sample);
    const b = themeToCssVars(sample);
    expect(a).toEqual(b);
    expect(Object.keys(a)).toEqual(Object.keys(b));
  });
});
