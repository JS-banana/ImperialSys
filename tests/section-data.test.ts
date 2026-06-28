import { describe, expect, it } from 'vitest';
import { createDataHelpers, loadDynastyData } from '../platform/utils';
import { SECTIONS as MING_SECTIONS } from '../dynasties/ming/sections';
import { SECTIONS as TANG_SECTIONS } from '../dynasties/tang/sections';
import mingInstitutions from '../dynasties/ming/data/institutions.json';
import mingRelations from '../dynasties/ming/data/relations.json';
import mingTimelines from '../dynasties/ming/data/timelines.json';
import mingFigures from '../dynasties/ming/data/figures.json';
import tangInstitutions from '../dynasties/tang/data/institutions.json';
import tangRelations from '../dynasties/tang/data/relations.json';
import tangTimelines from '../dynasties/tang/data/timelines.json';
import tangFigures from '../dynasties/tang/data/figures.json';

// 每个朝代：原始 JSON（未校验、宽类型）+ 分区叙事配置。
// loadDynastyData 在收集期就跑全量校验——任何一朝数据坏掉，整套测试直接报错（即数据完整性门）。
const DYNASTIES = [
  {
    name: '明',
    sections: MING_SECTIONS,
    raw: {
      institutions: mingInstitutions.institutions,
      relations: mingRelations.relations,
      timelines: mingTimelines.timelines,
      figures: mingFigures.figures,
    },
  },
  {
    name: '唐',
    sections: TANG_SECTIONS,
    raw: {
      institutions: tangInstitutions.institutions,
      relations: tangRelations.relations,
      timelines: tangTimelines.timelines,
      figures: tangFigures.figures,
    },
  },
] as const;

describe.each(DYNASTIES)('$name · 分区叙事与数据完整性', ({ name, sections, raw }) => {
  const data = loadDynastyData(raw, name);

  it('通过 Zod 引用完整性校验（机构/关系非空）', () => {
    expect(data.institutions.length).toBeGreaterThan(0);
    expect(data.relations.length).toBeGreaterThan(0);
  });

  it('每个机构恰好被一个分区覆盖一次', () => {
    const allInstitutionIds = data.institutions.map((institution) => institution.id).sort();
    const configuredIds = sections.flatMap((section) => section.institutionIds).sort();

    expect(configuredIds).toEqual(allInstitutionIds);
  });

  it('分区引用的 relationId 都存在于数据源', () => {
    const knownRelationIds = new Set(data.relations.map((relation) => relation.id));
    const configuredRelationIds = sections.flatMap((section) => section.relationIds ?? []);

    expect(configuredRelationIds.every((relationId) => knownRelationIds.has(relationId))).toBe(true);
  });

  it('能为任意机构定位其所属分区', () => {
    const findSection = (institutionId: string) =>
      sections.find((section) => section.institutionIds.includes(institutionId));

    for (const institution of data.institutions) {
      expect(findSection(institution.id)).toBeDefined();
    }
  });
});

// ─── 明朝特有的行为回归（叙事顺序 / 关系收集），通过 loader 喂精确类型 ───

describe('明 · 数据查询行为', () => {
  const data = loadDynastyData(
    {
      institutions: mingInstitutions.institutions,
      relations: mingRelations.relations,
      timelines: mingTimelines.timelines,
      figures: mingFigures.figures,
    },
    '明',
  );
  const helpers = createDataHelpers(data);

  it('按配置的叙事顺序返回分区机构', () => {
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

  it('为内阁收集进出关系', () => {
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
});

// ─── 反例：坏数据必须被 loadDynastyData 拒绝（救活 Zod 死代码的核心断言）───

describe('loadDynastyData 反例（坏数据被拒）', () => {
  const validInstitution = {
    id: 'a',
    name: '甲',
    shortName: '甲',
    category: 'central',
    level: 1,
    summary: '',
    established: '1368',
    detail: { functions: [], structure: '', internalOrgs: [] },
    position: { x: 0, y: 0 },
  };
  const ok = { institutions: [validInstitution], relations: [], timelines: {}, figures: {} };

  it('合法最小数据集通过', () => {
    expect(() => loadDynastyData(ok)).not.toThrow();
  });

  it('拒绝未知机构类别（枚举越界）', () => {
    expect(() =>
      loadDynastyData({ ...ok, institutions: [{ ...validInstitution, category: 'bogus' }] }),
    ).toThrow();
  });

  it('拒绝悬空 relation target（superRefine 引用完整性）', () => {
    expect(() =>
      loadDynastyData({
        ...ok,
        relations: [
          { id: 'r1', source: 'a', target: 'ghost', type: 'command', label: '', description: '' },
        ],
      }),
    ).toThrow();
  });

  it('拒绝悬空 relation source（superRefine 引用完整性）', () => {
    expect(() =>
      loadDynastyData({
        ...ok,
        relations: [
          { id: 'r1', source: 'ghost', target: 'a', type: 'command', label: '', description: '' },
        ],
      }),
    ).toThrow();
  });

  it('拒绝孤儿 timeline 键（指向不存在的机构）', () => {
    expect(() =>
      loadDynastyData({ ...ok, timelines: { ghost: [{ year: '1368', event: '', description: '' }] } }),
    ).toThrow();
  });

  it('拒绝孤儿 figure 键（指向不存在的机构）', () => {
    const figure = {
      id: 'f1', name: '某人', title: '', period: '', evaluation: '', story: '', tags: ['x'],
    };
    expect(() => loadDynastyData({ ...ok, figures: { ghost: [figure] } })).toThrow();
  });

  it('拒绝重复机构 id（uniqueness）', () => {
    expect(() =>
      loadDynastyData({ ...ok, institutions: [validInstitution, { ...validInstitution }] }),
    ).toThrow(/重复/);
  });

  it('拒绝多余字段（strictObject）', () => {
    expect(() =>
      loadDynastyData({ ...ok, institutions: [{ ...validInstitution, extra: '不该有' }] }),
    ).toThrow();
  });
});
