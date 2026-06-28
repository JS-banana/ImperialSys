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
  // 一、[data-dynasty] 子树：逐叶子令牌覆盖（派生令牌按使用点重解析）。
  // 二、html/body 漆底：用 :has() 让根元素在「本朝包裹层存在时」跟色——堵住
  //     overscroll/橡皮筋区域露出 :root 平台默认（明味）的缝。仍是声明式 SSR <style>
  //     （零 FOUC、首帧即正确；客户端导航随包裹层挂载/卸载自动生效/复原），不碰 :root
  //     全局注入（P2 锁定的 [data-dynasty] 作用域决策不回退）。
  const css =
    `[data-dynasty="${dynastyId}"] { ${declarations} } ` +
    `html:has([data-dynasty="${dynastyId}"]), body:has([data-dynasty="${dynastyId}"]) ` +
    `{ background-color: ${theme.surface.paper}; background-image: ${theme.bgGradient}; }`;
  return <style data-dynasty-theme={dynastyId} dangerouslySetInnerHTML={{ __html: css }} />;
}
