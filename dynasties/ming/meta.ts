import type { DynastyData } from '@/platform/types';
import { loadDynastyData, loadDynastyTheme } from '@/platform/utils';
import { MING_THEME } from './theme';
import institutionsData from './data/institutions.json';
import relationsData from './data/relations.json';
import timelinesData from './data/timelines.json';
import figuresData from './data/figures.json';
import eventsData from './data/events.json';

export function getMingDynastyData(): DynastyData {
  // 经 loader 校验：数据完整性成构建期硬门，返回精确类型（无需 as 强转）
  const data = loadDynastyData(
    {
      institutions: institutionsData.institutions,
      relations: relationsData.relations,
      timelines: timelinesData.timelines,
      figures: figuresData.figures,
      events: eventsData.events,
    },
    '明',
  );
  return { ...data, theme: loadDynastyTheme(MING_THEME, '明') };
}

// 页脚结语（明）。沿用重构前文案，视觉零回归。
export const MING_FOOTER_NOTE =
  '以明朝为起点，先把制度骨架讲清楚，再逐步扩展到其他朝代。';
