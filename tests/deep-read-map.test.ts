import { describe, expect, it } from 'vitest';
import { DEEP_READ, hasDeepRead } from '../platform/content/deep-read-map';
import { getMingDynastyData } from '../dynasties/ming/meta';

// 全原子注册表（明）：map 键必须是指向存在原子的合法 AtomRef，杜绝 map↔数据漂移。
const ming = getMingDynastyData();
const validRefs = new Set<string>([
  ...ming.institutions.map((i) => `institution:${i.id}`),
  ...ming.figures.map((f) => `figure:${f.id}`),
  ...ming.events.map((e) => `event:${e.id}`),
  ...ming.concepts.map((c) => `concept:${c.id}`),
]);

describe('deep-read 模块 map 覆盖', () => {
  it('每个 map 键是指向存在原子的合法 AtomRef（明）', () => {
    for (const ref of Object.keys(DEEP_READ.ming ?? {})) {
      expect(validRefs.has(ref)).toBe(true);
    }
  });

  it('试点：内阁有 L2（hasDeepRead 派生）', () => {
    expect(hasDeepRead('ming', 'institution:cabinet')).toBe(true);
    expect(hasDeepRead('ming', 'institution:silijian')).toBe(false);
    expect(hasDeepRead('tang', 'institution:cabinet')).toBe(false);
  });

  it('⑦：票拟批红 concept 有 L2（新增 L2 = map 加一行）', () => {
    expect(hasDeepRead('ming', 'concept:piaoni-pihong')).toBe(true);
    expect(hasDeepRead('ming', 'concept:zhiheng')).toBe(false);
  });
});
