import type { DynastyManifest, DynastyMeta } from '@/platform/types';
import { MING_MANIFEST } from '@/dynasties/ming';
import { TANG_MANIFEST } from '@/dynasties/tang';

// 已登记朝代 manifest。新增朝代 ＝ 在此数组加一项（+ 在 dynasty-client-map 加 hero 一行）。
const MANIFESTS: DynastyManifest[] = [MING_MANIFEST, TANG_MANIFEST];

/**
 * 平台朝代注册表：聚合各朝 manifest（纯服务端数据）。
 * 键由各朝 manifest.meta.id 派生——id 单一事实源，结构上杜绝「registry 键 ↔ meta.id」漂移
 * （漂移会让首页链接指向 generateStaticParams 没产出的路由 → 静态导出 404）。
 * 供首页（元数据列表）、动态路由 generateStaticParams（id 枚举）/ generateMetadata 使用。
 * hero（client 组件）不进此表——见 platform/dynasty-client-map.ts（output:'export' 显式 import map）。
 */
export const DYNASTIES: Record<string, DynastyManifest> = Object.fromEntries(
  MANIFESTS.map((manifest) => [manifest.meta.id, manifest]),
);

/** 已注册朝代 id 列表（generateStaticParams 枚举用）*/
export function getDynastyIds(): string[] {
  return Object.keys(DYNASTIES);
}

/** 取某朝 manifest；未注册返回 undefined（动态路由兜底用）*/
export function getDynastyManifest(id: string): DynastyManifest | undefined {
  return DYNASTIES[id];
}

/** 各朝元数据列表（首页朝代选择 / generateMetadata 用，不拖 section/hero 进客户端）*/
export function getDynastyMetaList(): DynastyMeta[] {
  return Object.values(DYNASTIES).map((manifest) => manifest.meta);
}
