import { describe, expect, it } from 'vitest';
import institutionsData from '../data/institutions.json';
import relationsData from '../data/relations.json';
import { SECTION_CONFIG } from '../lib/sectionConfig';
import {
  getInstitutionRelations,
  getInstitutionsBySection,
  getSectionForInstitution,
} from '../lib/dataHelpers';

describe('section narrative config', () => {
  it('covers every institution exactly once', () => {
    const allInstitutionIds = institutionsData.institutions.map((institution) => institution.id).sort();
    const configuredIds = SECTION_CONFIG.flatMap((section) => section.institutionIds).sort();

    expect(configuredIds).toEqual(allInstitutionIds);
  });

  it('references only relation ids that exist in the data source', () => {
    const knownRelationIds = new Set(relationsData.relations.map((relation) => relation.id));
    const configuredRelationIds = SECTION_CONFIG.flatMap((section) => [
      ...section.intraRelationIds,
      ...section.interRelationIds,
    ]);

    expect(configuredRelationIds.every((relationId) => knownRelationIds.has(relationId))).toBe(true);
  });
});

describe('section data helpers', () => {
  it('returns section institutions in the configured narrative order', () => {
    const administrativeSection = SECTION_CONFIG.find((section) => section.title === '六部执行');

    expect(administrativeSection).toBeDefined();
    expect(getInstitutionsBySection(administrativeSection!)).toMatchObject([
      { id: 'libu' },
      { id: 'hubu' },
      { id: 'libu2' },
      { id: 'bingbu' },
      { id: 'xingbu' },
      { id: 'gongbu' },
    ]);
  });

  it('collects incoming and outgoing relations for the cabinet', () => {
    const relationMap = getInstitutionRelations('cabinet');

    expect(relationMap.incoming.map((relation) => relation.id)).toEqual([
      'r_emp_cabinet',
      'r_tongzheng_cabinet',
      'r_duchayuan_cabinet',
    ]);
    expect(relationMap.outgoing.map((relation) => relation.id)).toEqual([
      'r_cabinet_sili',
      'r_cabinet_libu',
      'r_cabinet_hubu',
      'r_cabinet_libu2',
      'r_cabinet_bingbu',
      'r_cabinet_xingbu',
      'r_cabinet_gongbu',
    ]);
  });

  it('finds the section that owns a given institution', () => {
    expect(getSectionForInstitution('dongchang')?.title).toBe('暗处之眼');
    expect(getSectionForInstitution('emperor')?.title).toBe('皇权独尊');
  });
});
