import type { DynastyManifest } from '@/platform/types';
import { getTangDynastyData, TANG_FOOTER_NOTE } from './meta';
import { SECTIONS } from './sections';

// 唐朝清单：聚合本朝的元数据 + 数据加载器 + 分区叙事 + 页脚结语。
// 平台 registry 据此装配；动态路由 [dynastyId] 据此组合分区进 SSR。
// hero（client 组件）不在此——见 platform/dynasty-client-map.ts。
export const TANG_MANIFEST: DynastyManifest = {
  meta: {
    id: 'tang',
    name: '唐朝',
    period: '618—907',
    description: '三省六部制的成熟形态，中书出令、门下封驳、尚书执行，政事堂集体议政。',
  },
  getData: getTangDynastyData,
  sections: SECTIONS,
  footerNote: TANG_FOOTER_NOTE,
};
