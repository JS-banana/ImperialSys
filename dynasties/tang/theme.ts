import type { DynastyTheme } from '@/platform/types';

export const TANG_THEME: DynastyTheme = {
  colors: {
    paper: '#FFF8E7',     // 绢色，比明朝宣纸更暖
    ink: '#1A1A2E',       // 深蓝墨色
    accent: '#D4AF37',    // 金色（唐朝尚金）
    accentAlt: '#8B0000', // 深红
    gold: '#FFD700',
  },
  fonts: {
    display: '"KaiTi", "STKaiti", "BiauKai", serif',
    body: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
  decorative: {
    backgroundPattern: 'radial-gradient(circle at top, rgba(212,175,55,0.18), transparent 62%)',
    particleEffect: 'gold-dust',
  },
};
