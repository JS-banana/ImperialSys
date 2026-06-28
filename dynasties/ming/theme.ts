import type { DynastyTheme } from '@/platform/types';

// 明 ·「奏章与朱批」——宣纸奏章素白 + 朱砂批红 + 浓墨字 + 印章钤记。
// 设计系统 §6.1：零回归基线，色值＝重构前 globals :root 的明朝固定色。
export const MING_THEME: DynastyTheme = {
  surface: { paper: '#F5F0E8', bright: '#FFFAF2', dark: '#EDE5D8' },
  ink: { strong: '#2C2C2C', muted: '#51463E', subtle: '#7C6D5F' },
  accent: '#C0392B', // 朱砂红（批红）
  accentWash: 'rgba(192, 57, 43, 0.08)',
  accentAlt: '#8B4513', // 赭石
  gold: '#B8860B', // 暗金（印玺点缀）
  line: 'rgba(68, 50, 31, 0.12)', // 墨褐发丝
  // body 氛围＝重构前 body 渐变（顶部暗金径向晕 + 宣纸→米白纵向），逐字零回归
  bgGradient:
    'radial-gradient(circle at top, rgba(184, 134, 11, 0.14), transparent 34%), linear-gradient(180deg, rgba(255, 251, 244, 0.84), rgba(245, 240, 232, 0.98))',
  fonts: {
    display: '"Songti SC", "STSong", "Source Han Serif SC", "SimSun", serif', // 宋体（庄重朝堂）
    heading: '"Songti SC", "STSong", "Source Han Serif SC", "SimSun", serif',
    body: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif', // 黑体
    reading: '"Songti SC", "STSong", "Source Han Serif SC", serif', // 深读＝宋体（书卷感）
    caption: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
  decorative: { pattern: 'paper-grain+ink-seal', particle: 'ink-wash' },
  // 站位：官僚理性、密度稍高；墨褐 tint
  density: 'default',
  shadowTint: 'rgba(68, 50, 31, 0.10)',
  lineInk: '#44321F',
};
