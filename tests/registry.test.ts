import { describe, expect, it } from 'vitest';
import {
  DYNASTIES,
  getDynastyIds,
  getDynastyManifest,
  getDynastyMetaList,
} from '../platform/registry';
import { DYNASTY_HEROES } from '../platform/dynasty-client-map';

// 平台朝代注册表：聚合各朝 manifest（纯服务端数据）。
// 新增朝代 = 写 manifest + 在 registry 加一行——这里钉住聚合/查询/契约。
describe('platform/registry 朝代注册表', () => {
  it('聚合明、唐两朝', () => {
    expect(getDynastyIds().sort()).toEqual(['ming', 'tang']);
  });

  it('getDynastyManifest 取已注册朝代', () => {
    expect(getDynastyManifest('ming')?.meta.name).toBe('明朝');
    expect(getDynastyManifest('tang')?.meta.name).toBe('唐朝');
  });

  it('getDynastyManifest 取未注册朝代返回 undefined', () => {
    expect(getDynastyManifest('qing')).toBeUndefined();
  });

  it('getDynastyMetaList 返回每朝元数据（id/name/period/description 齐备）', () => {
    const metas = getDynastyMetaList();
    expect(metas.map((m) => m.id).sort()).toEqual(['ming', 'tang']);
    for (const m of metas) {
      expect(m).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        period: expect.any(String),
        description: expect.any(String),
      });
    }
  });

  it('每朝 manifest 满足契约（meta/getData/sections/footerNote）', () => {
    for (const manifest of Object.values(DYNASTIES)) {
      expect(typeof manifest.getData).toBe('function');
      expect(Array.isArray(manifest.sections)).toBe(true);
      expect(manifest.sections.length).toBeGreaterThan(0);
      expect(typeof manifest.footerNote).toBe('string');
      expect(manifest.footerNote.length).toBeGreaterThan(0);
    }
  });

  it('getData() 返回经 loader 校验的朝代数据（含 theme）', () => {
    const data = getDynastyManifest('ming')!.getData();
    expect(data.institutions.length).toBeGreaterThan(0);
    expect(data.relations.length).toBeGreaterThan(0);
    expect(data.theme).toBeDefined();
  });

  // ─── id 三处一致性硬门（堵 P4 三处登记的静默漂移）──────────────────────
  // 朝代 id 写在 registry 键 / manifest.meta.id / DYNASTY_HEROES 键三处，任一漂移都静默坏页
  // （meta.id≠键 → 首页链接 404；hero 键漏 → 该朝静默丢 hero）。把隐式约束钉成构建期红灯。

  it('每朝 registry 键 === 其 manifest.meta.id（id 单一事实源）', () => {
    for (const [id, manifest] of Object.entries(DYNASTIES)) {
      expect(manifest.meta.id).toBe(id);
    }
  });

  it('DYNASTY_HEROES 覆盖每个已注册朝代 id（堵 hero 静默丢失）', () => {
    for (const id of getDynastyIds()) {
      expect(DYNASTY_HEROES[id]).toBeDefined();
    }
  });
});
