import type { DynastyManifest } from '@/platform/types';
import { getMingDynastyData, MING_FOOTER_NOTE } from './meta';
import { SECTIONS } from './sections';

// 明朝清单：聚合本朝的元数据 + 数据加载器 + 分区叙事 + 页脚结语。
// 平台 registry 据此装配；动态路由 [dynastyId] 据此组合分区进 SSR。
// hero（client 组件）不在此——见 platform/dynasty-client-map.ts。
export const MING_MANIFEST: DynastyManifest = {
  meta: {
    id: 'ming',
    name: '明朝',
    period: '1368—1644',
    description: '废丞相、设内阁、以司礼监批红，构建了中国历史上最精密的皇权独裁体制。',
  },
  getData: getMingDynastyData,
  sections: SECTIONS,
  footerNote: MING_FOOTER_NOTE,
};
