import type { DynastyConfig } from '@/platform/types';

export const DYNASTY_REGISTRY: Record<string, DynastyConfig> = {
  ming: {
    id: 'ming',
    name: '明朝',
    period: '1368—1644',
    description: '废丞相、设内阁、以司礼监批红，构建了中国历史上最精密的皇权独裁体制。',
  },
  tang: {
    id: 'tang',
    name: '唐朝',
    period: '618—907',
    description: '三省六部制的成熟形态，中书出令、门下封驳、尚书执行，政事堂集体议政。',
  },
  // song: { id: 'song', name: '宋朝', period: '960—1279', description: '...' },
};

export function getDynastyList(): DynastyConfig[] {
  return Object.values(DYNASTY_REGISTRY);
}

export function getDynastyById(id: string): DynastyConfig | undefined {
  return DYNASTY_REGISTRY[id];
}
