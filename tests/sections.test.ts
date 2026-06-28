import { describe, expect, it } from 'vitest';
import { SECTIONS as MING_SECTIONS } from '../dynasties/ming/sections';
import { SECTIONS as TANG_SECTIONS } from '../dynasties/tang/sections';

// SECTIONS 静态定义结构契约：编译期静态数组（config + component），
// page(Server) 据此组合分区进 SSR。结构错误（id 重复 / 漏绑组件）应在测试期暴露。
const DYNASTY_SECTIONS = [
  { name: '明', sections: MING_SECTIONS, expectedCount: 6 },
  { name: '唐', sections: TANG_SECTIONS, expectedCount: 4 },
] as const;

describe.each(DYNASTY_SECTIONS)('$name · SECTIONS 静态定义', ({ sections, expectedCount }) => {
  it('分区数量符合预期', () => {
    expect(sections).toHaveLength(expectedCount);
  });

  it('分区 id 唯一', () => {
    const ids = sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每个分区都绑定了组件', () => {
    for (const section of sections) {
      expect(typeof section.component).toBe('function');
    }
  });

  it('每个分区至少覆盖一个机构', () => {
    for (const section of sections) {
      expect(section.institutionIds.length).toBeGreaterThan(0);
    }
  });
});
