import type { DynastyTheme } from '@/platform/types';

export const MING_THEME: DynastyTheme = {
  colors: {
    paper: '#F5F0E8',
    ink: '#2C2C2C',
    accent: '#C0392B',     // 朱砂红
    accentAlt: '#8B4513',  // 赭石
    gold: '#B8860B',       // 暗金
  },
  fonts: {
    display: '"Songti SC", "STSong", "SimSun", serif',
    body: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
  decorative: {
    backgroundPattern: 'radial-gradient(circle at top, rgba(184,134,11,0.18), transparent 62%)',
    particleEffect: 'ink-wash',
  },
};
