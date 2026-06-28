import type { ComponentType } from 'react';

/**
 * L2 深读 MDX 显式模块 map（复刻 P4 DYNASTY_HEROES 教训）。
 *
 * output:'export' + turbopack 下**禁变量 dynamic import**（`import(\`...${id}.mdx\`)` 不可静态解析）——
 * 故每条用**字面量路径** import：既可静态解析、又每原子一 chunk 按需懒加载。
 * 「某原子是否有 L2」**纯由本 map 派生**（单一事实源，杜绝 JSON↔map 漂移）。
 * 新增 L2 = 在此加一行（dynastyId → AtomRef → loader）。
 */
type MdxModule = { default: ComponentType };
type MdxLoader = () => Promise<MdxModule>;

export const DEEP_READ: Record<string, Record<string, MdxLoader>> = {
  ming: {
    'institution:cabinet': () => import('@/dynasties/ming/content/institution/cabinet.mdx'),
  },
};

export function getDeepReadLoader(dynastyId: string, atomRef: string): MdxLoader | undefined {
  return DEEP_READ[dynastyId]?.[atomRef];
}

export function hasDeepRead(dynastyId: string, atomRef: string): boolean {
  return Boolean(DEEP_READ[dynastyId]?.[atomRef]);
}
