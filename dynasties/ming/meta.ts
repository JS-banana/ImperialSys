import type { DynastyData } from '@/platform/types';
import { MING_THEME } from './theme';
import institutionsData from './data/institutions.json';
import relationsData from './data/relations.json';
import timelinesData from './data/timelines.json';
import figuresData from './data/figures.json';

export function getMingDynastyData(): DynastyData {
  return {
    institutions: institutionsData.institutions as DynastyData['institutions'],
    relations: relationsData.relations as DynastyData['relations'],
    timelines: timelinesData.timelines as DynastyData['timelines'],
    figures: figuresData.figures as DynastyData['figures'],
    theme: MING_THEME,
  };
}
