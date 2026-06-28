import type { DynastyTheme } from '@/platform/types';

/**
 * 把朝代主题的「表达令牌」映射到既有 CSS 自定义属性（叶子令牌）。
 *
 * 只产出叶子令牌；派生令牌（--background/--foreground/--primary 等在 :root 里
 * 以 var(--paper)/var(--ink-strong)/var(--vermillion) 间接定义）会按 CSS 自定义
 * 属性的「使用点解析」规则，在 [data-dynasty] 子树内自动重解析到本朝值——无需重复产出。
 *
 * 纯确定性：同输入恒等同输出、键序稳定（对象字面量插入序），保证 SSR 序列化的
 * 作用域 <style> 可水合、无 FOUC。命名保留现有 --paper/--ink-strong/--vermillion，
 * 仅承载语义槽位（accent→--vermillion 为历史命名，见重构方案锁定决策）。
 */
export function themeToCssVars(theme: DynastyTheme): Record<string, string> {
  return {
    // 表面三阶
    '--paper': theme.surface.paper,
    '--paper-bright': theme.surface.bright,
    '--paper-dark': theme.surface.dark,
    // 墨三阶
    '--ink-strong': theme.ink.strong,
    '--ink-muted': theme.ink.muted,
    '--ink-subtle': theme.ink.subtle,
    // 招牌主色 + 低透染（历史命名 vermillion = 语义 accent）
    '--vermillion': theme.accent,
    '--vermillion-wash': theme.accentWash,
    // 辅强调 / 金 / 描边
    '--accent-alt': theme.accentAlt,
    '--gold': theme.gold,
    '--border': theme.line,
    '--input': theme.line,
    // body 氛围
    '--bg-gradient': theme.bgGradient,
    // 字体角色
    '--font-display': theme.fonts.display,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--font-reading': theme.fonts.reading,
    '--font-caption': theme.fonts.caption,
    // 站位（暂为数据，P6 结构令牌消费）
    '--shadow-tint': theme.shadowTint,
    '--line-ink': theme.lineInk,
  };
}
