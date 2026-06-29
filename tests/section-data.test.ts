import { describe, expect, it } from 'vitest';
import { createDataHelpers, loadDynastyData } from '../platform/utils';
import { SECTIONS as MING_SECTIONS } from '../dynasties/ming/sections';
import { SECTIONS as TANG_SECTIONS } from '../dynasties/tang/sections';
import mingInstitutions from '../dynasties/ming/data/institutions.json';
import mingRelations from '../dynasties/ming/data/relations.json';
import mingTimelines from '../dynasties/ming/data/timelines.json';
import mingFigures from '../dynasties/ming/data/figures.json';
import mingEvents from '../dynasties/ming/data/events.json';
import mingConcepts from '../dynasties/ming/data/concepts.json';
import tangInstitutions from '../dynasties/tang/data/institutions.json';
import tangRelations from '../dynasties/tang/data/relations.json';
import tangTimelines from '../dynasties/tang/data/timelines.json';
import tangFigures from '../dynasties/tang/data/figures.json';
import tangEvents from '../dynasties/tang/data/events.json';
import tangConcepts from '../dynasties/tang/data/concepts.json';

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
      events: mingEvents.events,
      concepts: mingConcepts.concepts,
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
      events: tangEvents.events,
      concepts: tangConcepts.concepts,
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
      events: mingEvents.events,
      concepts: mingConcepts.concepts,
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

  it('内阁深度契约可读（④ 种子：role / links / citations / furtherReading）', () => {
    const cabinet = helpers.getInstitutionById('cabinet');
    expect(cabinet?.institutionalRole).toContain('票拟');
    expect(cabinet?.keyMoments?.length).toBeGreaterThan(0);
    expect(cabinet?.links).toContain('figure:zhang_juzheng');
    expect(cabinet?.citations?.[0]?.source).toBe('ctext');
    expect(cabinet?.furtherReading?.[0]?.source).toBe('wikipedia');
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
  const ok = { institutions: [validInstitution], relations: [], timelines: {}, figures: [] };

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

  it('拒绝 figure 悬空 institutionId（指向不存在的机构）', () => {
    const figure = {
      id: 'f1', name: '某人', title: '', period: '', evaluation: '', story: '', tags: ['x'],
      institutionIds: ['ghost'],
    };
    expect(() => loadDynastyData({ ...ok, figures: [figure] })).toThrow();
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

// ─── 全原子注册表：事件/概念原子 + 外链强白名单 + 互链 AtomRef 解析（P5 ①）───

describe('全原子注册表（event/concept/外链/互链）反例', () => {
  const inst = {
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
  const base = { institutions: [inst], relations: [], timelines: {}, figures: [] };
  const validEvent = {
    id: 'e1',
    name: '土木堡之变',
    year: 1449,
    summary: '英宗北征大败被俘',
    institutionIds: ['a'],
    tags: ['军事'],
  };

  it('接受带 event 原子的数据集（events 数组已接入 schema）', () => {
    expect(() => loadDynastyData({ ...base, events: [validEvent] })).not.toThrow();
  });

  it('拒绝 event 悬空 institutionId（不指向存在机构）', () => {
    expect(() =>
      loadDynastyData({ ...base, events: [{ ...validEvent, institutionIds: ['ghost'] }] }),
    ).toThrow();
  });

  it('拒绝重复 event id（per-type 全局唯一）', () => {
    expect(() =>
      loadDynastyData({ ...base, events: [validEvent, { ...validEvent, name: '夺门之变' }] }),
    ).toThrow(/重复|唯一/);
  });

  it('接受带深度契约字段（institutionalRole/keyMoments/links/citations/furtherReading）的 event', () => {
    const enriched = {
      ...validEvent,
      institutionalRole: '体现皇权与文官的张力',
      keyMoments: ['也先兵临北京', '于谦主战'],
      links: ['institution:a'],
      citations: [{ label: '明实录', url: 'https://ctext.org/wiki.pl?if=gb&res=123', source: 'ctext' }],
      furtherReading: [{ label: '维基：土木堡之变', url: 'https://zh.wikipedia.org/wiki/土木之变', source: 'wikipedia' }],
    };
    expect(() => loadDynastyData({ ...base, events: [enriched] })).not.toThrow();
  });

  it('拒绝悬空 link AtomRef（互链指向不存在的原子）', () => {
    expect(() =>
      loadDynastyData({ ...base, events: [{ ...validEvent, links: ['institution:ghost'] }] }),
    ).toThrow();
  });

  it('拒绝外链 host 与 source 不符（强白名单：source=ctext 但 host=evil）', () => {
    expect(() =>
      loadDynastyData({
        ...base,
        events: [
          { ...validEvent, citations: [{ label: '伪源', url: 'https://evil.com/x', source: 'ctext' }] },
        ],
      }),
    ).toThrow();
  });

  it('接受 other 源的 https 外链（白名单不过度拒绝）', () => {
    expect(() =>
      loadDynastyData({
        ...base,
        events: [
          { ...validEvent, furtherReading: [{ label: '研究', url: 'https://example.org/paper', source: 'other' }] },
        ],
      }),
    ).not.toThrow();
  });

  const validConcept = { id: 'c1', name: '制衡', summary: '权力相互牵制的制度设计', institutionIds: ['a'] };

  it('接受带 concept 原子的数据集（concepts 数组已接入 schema）', () => {
    expect(() => loadDynastyData({ ...base, concepts: [validConcept] })).not.toThrow();
  });

  it('拒绝 concept 悬空 institutionId（共享原子注册表校验）', () => {
    expect(() =>
      loadDynastyData({ ...base, concepts: [{ ...validConcept, institutionIds: ['ghost'] }] }),
    ).toThrow();
  });

  it('拒绝 keyMoments 超过 3 条（ADR-0006 关键片段 1-3）', () => {
    expect(() =>
      loadDynastyData({
        ...base,
        events: [{ ...validEvent, keyMoments: ['一', '二', '三', '四'] }],
      }),
    ).toThrow();
  });

  // ── ④ 深度契约铺到 institution / relation ──
  const contract = {
    institutionalRole: '中枢票拟',
    keyMoments: ['三杨辅政确立票拟'],
    links: ['institution:a'],
    citations: [{ label: '明史', url: 'https://ctext.org/wiki.pl?if=gb&res=1', source: 'ctext' }],
    furtherReading: [{ label: '维基', url: 'https://zh.wikipedia.org/wiki/内阁', source: 'wikipedia' }],
  };

  it('接受带深度契约的 institution（契约字段已接入）', () => {
    expect(() => loadDynastyData({ ...base, institutions: [{ ...inst, ...contract }] })).not.toThrow();
  });

  it('拒绝 institution 悬空 link', () => {
    expect(() =>
      loadDynastyData({ ...base, institutions: [{ ...inst, links: ['institution:ghost'] }] }),
    ).toThrow();
  });

  it('拒绝 institution 外链 host 与 source 不符', () => {
    expect(() =>
      loadDynastyData({
        ...base,
        institutions: [{ ...inst, citations: [{ label: '伪', url: 'https://evil.com', source: 'ctext' }] }],
      }),
    ).toThrow();
  });

  it('接受带深度契约的 relation + 拒绝其悬空 link', () => {
    const rel = { id: 'r1', source: 'a', target: 'a', type: 'check', label: '', description: '' };
    expect(() => loadDynastyData({ ...base, relations: [{ ...rel, links: ['institution:a'] }] })).not.toThrow();
    expect(() =>
      loadDynastyData({ ...base, relations: [{ ...rel, links: ['concept:ghost'] }] }),
    ).toThrow();
  });
});

// ─── ② figure 扁平升原子（Record→数组 + 多对多 institutionIds）───

describe('② figure 扁平升原子（多对多）', () => {
  const ming = loadDynastyData(
    {
      institutions: mingInstitutions.institutions,
      relations: mingRelations.relations,
      timelines: mingTimelines.timelines,
      figures: mingFigures.figures,
      events: mingEvents.events,
      concepts: mingConcepts.concepts,
    },
    '明',
  );
  const helpers = createDataHelpers(ming);

  it('getFigures 保持机构维度（内阁三人不变、签名不变）', () => {
    expect(helpers.getFigures('cabinet').map((f) => f.id)).toEqual([
      'zhang_juzheng',
      'yang_shiqi',
      'yan_song',
    ]);
  });

  it('同一 figure 原子跨机构出现（王振 ∈ 司礼监 ∩ 东厂，同一 id）', () => {
    expect(helpers.getFigures('silijian').map((f) => f.id)).toContain('wang_zhen');
    expect(helpers.getFigures('dongchang').map((f) => f.id)).toContain('wang_zhen');
  });

  it('于谦合并：都察院与兵部共享同一原子（旧 yu_qian_bingbu 桩已并）', () => {
    expect(helpers.getFigures('duchayuan').map((f) => f.id)).toContain('yu_qian');
    expect(helpers.getFigures('bingbu').map((f) => f.id)).toContain('yu_qian');
    // 旧的合成后缀 id 不再存在
    expect(ming.figures.map((f) => f.id)).not.toContain('yu_qian_bingbu');
  });

  it('getFigureById 按 id 取单个 figure（⑥ 抽屉路由用；不存在→undefined）', () => {
    expect(helpers.getFigureById('yu_qian')?.name).toBe('于谦');
    expect(helpers.getFigureById('nope')).toBeUndefined();
  });

  it('拒绝重复 figure id（扁平后全局唯一）', () => {
    const f = {
      id: 'f1', name: '某', title: '', period: '', evaluation: '', story: '', tags: ['x'],
      institutionIds: ['a'],
    };
    const inst = {
      id: 'a', name: '甲', shortName: '甲', category: 'central', level: 1, summary: '',
      established: '1', detail: { functions: [], structure: '', internalOrgs: [] },
      position: { x: 0, y: 0 },
    };
    expect(() =>
      loadDynastyData({ institutions: [inst], relations: [], timelines: {}, figures: [f, { ...f, name: '乙' }] }),
    ).toThrow(/重复|唯一/);
  });
});

// ─── ③ event 一等原子（helper + 种子数据）───

describe('③ event 一等原子', () => {
  const ming = loadDynastyData(
    {
      institutions: mingInstitutions.institutions,
      relations: mingRelations.relations,
      timelines: mingTimelines.timelines,
      figures: mingFigures.figures,
      events: mingEvents.events,
      concepts: mingConcepts.concepts,
    },
    '明',
  );
  const helpers = createDataHelpers(ming);

  it('getEvents 返回全部种子事件', () => {
    expect(helpers.getEvents().map((e) => e.id)).toEqual(['hu_weiyong_case', 'tumu_crisis', 'duomen_coup']);
  });

  it('getEventById 按 id 取单个事件', () => {
    expect(helpers.getEventById('tumu_crisis')?.name).toBe('土木堡之变');
    expect(helpers.getEventById('nope')).toBeUndefined();
  });

  it('getEventsByInstitution 按机构多对多过滤（土木堡 ∈ 司礼监）', () => {
    expect(helpers.getEventsByInstitution('silijian').map((e) => e.id)).toContain('tumu_crisis');
    expect(helpers.getEventsByInstitution('emperor').map((e) => e.id)).toContain('hu_weiyong_case');
  });
});

// ─── ⑦ concept 一等原子（helper + 种子数据）───

describe('⑦ concept 一等原子', () => {
  const ming = loadDynastyData(
    {
      institutions: mingInstitutions.institutions,
      relations: mingRelations.relations,
      timelines: mingTimelines.timelines,
      figures: mingFigures.figures,
      events: mingEvents.events,
      concepts: mingConcepts.concepts,
    },
    '明',
  );
  const helpers = createDataHelpers(ming);

  it('getConcepts 返回全部种子概念', () => {
    expect(helpers.getConcepts().map((c) => c.id)).toEqual([
      'zhiheng',
      'piaoni-pihong',
      'sanfasi-huishen',
      'junzheng-fenli',
    ]);
  });

  it('getConceptById 按 id 取单个概念（不存在→undefined）', () => {
    expect(helpers.getConceptById('piaoni-pihong')?.name).toBe('票拟批红');
    expect(helpers.getConceptById('nope')).toBeUndefined();
  });

  it('cabinet 互链含 concept:piaoni-pihong（概念在抽屉可达）', () => {
    expect(helpers.getInstitutionById('cabinet')?.links).toContain('concept:piaoni-pihong');
  });
});
