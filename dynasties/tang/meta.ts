import type { DynastyData } from '@/platform/types';
import { loadDynastyData } from '@/platform/utils';
import { TANG_THEME } from './theme';
import institutionsData from './data/institutions.json';
import relationsData from './data/relations.json';
import timelinesData from './data/timelines.json';
import figuresData from './data/figures.json';

export function getTangDynastyData(): DynastyData {
  // 经 loader 校验：数据完整性成构建期硬门，返回精确类型（无需 as 强转）
  const data = loadDynastyData(
    {
      institutions: institutionsData.institutions,
      relations: relationsData.relations,
      timelines: timelinesData.timelines,
      figures: figuresData.figures,
    },
    '唐',
  );
  return { ...data, theme: TANG_THEME };
}
