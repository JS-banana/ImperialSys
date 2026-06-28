import type { DynastyTheme } from '@/platform/types';

// 唐 ·「绢帛与鎏金·盛唐金韵」——暖绢底 + 鎏金奢华层 + 深红朱主强调 + 唐三彩青绿点睛 + 暖褐墨。
// 设计系统 §6.2 定稿（替换旧占位值）：比明更暖、更金、更开阔（airy）。
export const TANG_THEME: DynastyTheme = {
  surface: { paper: '#FAF3E2', bright: '#FFFCF3', dark: '#F1E6C8' }, // 绢黄暖
  ink: { strong: '#2A2018', muted: '#5C4A33', subtle: '#8A7350' }, // 暖褐墨
  accent: '#9E2B2B', // 深红朱
  accentWash: 'rgba(158, 43, 43, 0.08)',
  accentAlt: '#356B5B', // 唐三彩青绿（点睛，克制少用）
  gold: '#C49A42', // 鎏金（奢华层）
  line: 'rgba(120, 90, 40, 0.16)', // 金褐发丝
  // body 氛围＝顶部鎏金径向晕（更暖更强）+ 绢色纵向渐变
  bgGradient:
    'radial-gradient(circle at top, rgba(196, 154, 66, 0.18), transparent 38%), linear-gradient(180deg, rgba(255, 252, 243, 0.86), rgba(241, 230, 200, 0.98))',
  fonts: {
    display: '"Kaiti SC", "STKaiti", "KaiTi", serif', // 楷体（盛唐书风）
    heading: '"Kaiti SC", "STKaiti", "KaiTi", serif',
    body: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif', // 黑体
    reading: '"Songti SC", "STSong", "Source Han Serif SC", serif', // 深读＝宋体（长文易读）
    caption: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
  decorative: { pattern: 'tang-vine+gold-flourish', particle: 'gold-dust' },
  // 站位：宫廷恢弘、留白更大；暖金褐 tint
  density: 'airy',
  shadowTint: 'rgba(120, 90, 40, 0.12)',
  lineInk: '#785A28',
};
