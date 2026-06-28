import { lazy, type ComponentType } from 'react';

/**
 * L2 深读 MDX 显式模块 map（复刻 P4 DYNASTY_HEROES 教训）。
 *
 * output:'export' + turbopack 下**禁变量 dynamic import**（`import(\`...${id}.mdx\`)` 不可静态解析）——
 * 故每条用**字面量路径** import，在**模块加载期**（非 render 期）建好 React.lazy 组件：
 * 既每原子一 chunk 按需懒加载、又满足 react-compiler「不在 render 期创建组件」规则。
 * 「某原子是否有 L2」**纯由本 map 派生**（单一事实源，杜绝 JSON↔map 漂移）。
 * 新增 L2 = 在此加一行（dynastyId → AtomRef → lazy 组件）。
 */
type LazyMdx = ComponentType;

export const DEEP_READ: Record<string, Record<string, LazyMdx>> = {
  ming: {
    'institution:cabinet': lazy(() => import('@/dynasties/ming/content/institution/cabinet.mdx')),
  },
};

export function getDeepReadComponent(dynastyId: string, atomRef: string): LazyMdx | undefined {
  return DEEP_READ[dynastyId]?.[atomRef];
}

export function hasDeepRead(dynastyId: string, atomRef: string): boolean {
  return Boolean(DEEP_READ[dynastyId]?.[atomRef]);
}
