import { themeToCssVars } from '@/platform/utils';
import type { DynastyTheme } from '@/platform/types';

interface DynastyThemeStyleProps {
  dynastyId: string;
  theme: DynastyTheme;
}

/**
 * 服务端序列化朝代主题为作用域 <style>：`[data-dynasty="<id>"] { --token: value; … }`。
 *
 * 方案 C（重构方案锁定决策）：零闪烁、单一真源、同一 theme 对象喂 CSS（此处）+ JS（prop）。
 * 只覆盖叶子令牌；派生令牌（--background/--primary 等在 :root 以 var(--paper) 等间接定义）
 * 按 CSS 自定义属性的「使用点解析」在 [data-dynasty] 子树内自动重解析到本朝值。
 *
 * themeToCssVars 纯确定性 → 静态导出下此 <style> 文本可水合、首帧即正确（无 FOUC）。
 * 用 dangerouslySetInnerHTML 注入纯 CSS 文本，避免 React 对 `>`/`{` 等做文本转义。
 */
export default function DynastyThemeStyle({ dynastyId, theme }: DynastyThemeStyleProps) {
  const declarations = Object.entries(themeToCssVars(theme))
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ');
  const css = `[data-dynasty="${dynastyId}"] { ${declarations} }`;
  return <style data-dynasty-theme={dynastyId} dangerouslySetInnerHTML={{ __html: css }} />;
}
