import { describe, expect, it } from 'vitest';
import {
  DYNASTIES,
  getDynastyIds,
  getDynastyManifest,
  getDynastyMetaList,
} from '../platform/registry';

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
});
