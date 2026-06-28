import { describe, expect, it } from 'vitest';
import institutionsData from '../dynasties/ming/data/institutions.json';
import relationsData from '../dynasties/ming/data/relations.json';
import { MING_SECTIONS } from '../dynasties/ming/sections';
import { createDataHelpers } from '../platform/utils/dataHelpers';

const helpers = createDataHelpers({
  institutions: institutionsData.institutions,
  relations: relationsData.relations,
  timelines: {},
  figures: {},
});

describe('section narrative config', () => {
  it('covers every institution exactly once', () => {
    const allInstitutionIds = institutionsData.institutions.map((institution) => institution.id).sort();
    const configuredIds = MING_SECTIONS.flatMap((section) => section.institutionIds).sort();

    expect(configuredIds).toEqual(allInstitutionIds);
  });

  it('references only relation ids that exist in the data source', () => {
    const knownRelationIds = new Set(relationsData.relations.map((relation) => relation.id));
    const configuredRelationIds = MING_SECTIONS.flatMap((section) => section.relationIds ?? []);

    expect(configuredRelationIds.every((relationId) => knownRelationIds.has(relationId))).toBe(true);
  });
});

describe('section data helpers', () => {
  it('returns section institutions in the configured narrative order', () => {
    const administrativeSection = MING_SECTIONS.find((section) => section.title === '六部执行');

    expect(administrativeSection).toBeDefined();
    expect(helpers.getInstitutionsByIds(administrativeSection!.institutionIds)).toMatchObject([
      { id: 'libu' },
      { id: 'hubu' },
      { id: 'libu2' },
      { id: 'bingbu' },
      { id: 'xingbu' },
      { id: 'gongbu' },
    ]);
  });

  it('collects incoming and outgoing relations for the cabinet', () => {
    const relationMap = helpers.getInstitutionRelations('cabinet');

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
    const findSection = (institutionId: string) =>
      MING_SECTIONS.find((s) => s.institutionIds.includes(institutionId));

    expect(findSection('dongchang')?.title).toBe('暗处之眼');
    expect(findSection('emperor')?.title).toBe('皇权独尊');
  });
});
