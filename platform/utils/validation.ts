import { z } from 'zod';

// ─── Primitive Schemas ───────────────────────────────────────────────

export const InstitutionCategorySchema = z.enum(
  ['central', 'administrative', 'supervisory', 'military', 'secret']
);

export const RelationTypeSchema = z.enum(
  ['command', 'supervise', 'check', 'cooperate', 'direct']
);

// ─── Institution ─────────────────────────────────────────────────────

export const FunctionItemSchema = z.strictObject({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const InternalOrgSchema = z.strictObject({
  name: z.string(),
  desc: z.string(),
});

export const InstitutionDetailSchema = z.strictObject({
  functions: z.array(FunctionItemSchema),
  structure: z.string(),
  internalOrgs: z.array(InternalOrgSchema),
});

export const PositionSchema = z.strictObject({
  x: z.number(),
  y: z.number(),
});

export const InstitutionSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string(),
  category: InstitutionCategorySchema,
  level: z.number().int().min(1),
  summary: z.string(),
  established: z.string(),
  detail: InstitutionDetailSchema,
  position: PositionSchema,
});

// ─── Relation ────────────────────────────────────────────────────────

export const RelationSchema = z.strictObject({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  type: RelationTypeSchema,
  label: z.string(),
  description: z.string(),
});

// ─── TimelineEvent ───────────────────────────────────────────────────

export const TimelineEventSchema = z.strictObject({
  year: z.string(),
  event: z.string(),
  description: z.string(),
});

// ─── Figure ──────────────────────────────────────────────────────────

// figure：人物升一等原子（扁平数组 + institutionIds 多对多，取代旧 Record<instId, Figure[]>）。
export const FigureSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string(),
  title: z.string(),
  period: z.string(),
  evaluation: z.string(),
  story: z.string(),
  tags: z.array(z.string()).min(1),
  institutionIds: z.array(z.string().min(1)).min(1),
});

// ─── 外链 / 深度契约（ADR-0006）─────────────────────────────────────
// ExternalRef：唯一站外出口。host 强白名单（与 source 一致）见 DynastyDataSchema.superRefine。
export const ExternalRefSchema = z
  .strictObject({
    label: z.string().min(1),
    url: z.url(),
    source: z.enum(['wikipedia', 'baidu', 'ctext', 'other']),
  })
  .superRefine((ref, ctx) => {
    // 强白名单：须 https 且 host 与 source 一致（ADR-0006 权威源固化成硬门）。
    let parsed: URL;
    try {
      parsed = new URL(ref.url);
    } catch {
      return; // z.url() 已保格式，理论不达
    }
    const host = parsed.host.toLowerCase();
    const https = parsed.protocol === 'https:';
    const hostOk =
      ref.source === 'wikipedia'
        ? host === 'wikipedia.org' || host.endsWith('.wikipedia.org')
        : ref.source === 'baidu'
          ? host === 'baike.baidu.com'
          : ref.source === 'ctext'
            ? host === 'ctext.org' || host.endsWith('.ctext.org')
            : true; // other：任意 host，仅须 https
    if (!https || !hostOk) {
      ctx.addIssue({
        code: 'custom',
        message: `外链 "${ref.url}" 与 source "${ref.source}" 不符（须 https，且 host 属该源白名单）`,
        path: ['url'],
      });
    }
  });

// 深度契约：全 optional（先 optional 后收紧）。可铺到任意原子。
// links 互链站内原子（AtomRef "type:id"，注册表解析见 superRefine）；
// citations/furtherReading 为站外史料/延伸阅读（克制靠后，ADR-0006）。
const depthContractShape = {
  institutionalRole: z.string().optional(),
  keyMoments: z.array(z.string()).min(1).max(3).optional(),
  links: z.array(z.string()).optional(),
  citations: z.array(ExternalRefSchema).optional(),
  furtherReading: z.array(ExternalRefSchema).optional(),
};

// ─── 内容原子（event / concept，P5）──────────────────────────────────
// event：跨切面大事件升一等原子（数字 year 便排序）；timelines 叙事节拍另存、不动。

export const EventAtomSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  year: z.number().int(),
  summary: z.string(),
  institutionIds: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string()).min(1),
  ...depthContractShape,
});

// concept：贯穿制度的抽象概念（制衡 / 票拟批红 / 三法司会审 / 军政分离）。
export const ConceptAtomSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string(),
  institutionIds: z.array(z.string().min(1)).min(1),
  ...depthContractShape,
});

// ─── DynastyTheme（表达令牌 + 站位）──────────────────────────────────
// 见 ADR-0007 / 设计系统 §6.0。全字段必填 = 构建期硬门：缺槽位即构建失败，
// 杜绝「写了一半的主题」静默渲染成明朝色（断线根因之一）。
export const DynastyThemeSchema = z.strictObject({
  surface: z.strictObject({
    paper: z.string().min(1),
    bright: z.string().min(1),
    dark: z.string().min(1),
  }),
  ink: z.strictObject({
    strong: z.string().min(1),
    muted: z.string().min(1),
    subtle: z.string().min(1),
  }),
  accent: z.string().min(1),
  accentWash: z.string().min(1),
  accentAlt: z.string().min(1),
  gold: z.string().min(1),
  line: z.string().min(1),
  bgGradient: z.string().min(1),
  fonts: z.strictObject({
    display: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
    reading: z.string().min(1),
    caption: z.string().min(1),
  }),
  decorative: z.strictObject({
    pattern: z.string().min(1),
    particle: z.string().min(1),
  }),
  density: z.enum(['compact', 'default', 'airy']),
  shadowTint: z.string().min(1),
  lineInk: z.string().min(1),
});

// ─── Combined DynastyData with Cross-Reference Checks ────────────────

export const DynastyDataSchema = z
  .strictObject({
    institutions: z.array(InstitutionSchema),
    relations: z.array(RelationSchema),
    timelines: z.record(z.string(), z.array(TimelineEventSchema)),
    figures: z.array(FigureSchema),
    events: z.array(EventAtomSchema).default([]),
    concepts: z.array(ConceptAtomSchema).default([]),
  })
  .superRefine((data, ctx) => {
    // 机构 id 唯一性：下方引用校验用 Set(ids) 当真值源，重复 id 会被静默去重、
    // 令 relation/timeline/figure 的引用校验失真，故先在此拒绝重复
    const seenInstitutionIds = new Set<string>();
    data.institutions.forEach((inst, index) => {
      if (seenInstitutionIds.has(inst.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `机构 id "${inst.id}" 重复（机构 id 必须唯一）`,
          path: ['institutions', index, 'id'],
        });
      }
      seenInstitutionIds.add(inst.id);
    });

    const institutionIds = new Set(data.institutions.map((i) => i.id));

    // 全原子注册表：互链 AtomRef "type:id" 须命中其一（institution/figure/event/concept）
    const atomRefs = new Set<string>([
      ...data.institutions.map((i) => `institution:${i.id}`),
      ...data.figures.map((f) => `figure:${f.id}`),
      ...data.events.map((e) => `event:${e.id}`),
      ...data.concepts.map((c) => `concept:${c.id}`),
    ]);

    // 检查 relation 的 source/target 是否指向有效机构
    for (const rel of data.relations) {
      if (!institutionIds.has(rel.source)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `关系 "${rel.id}" 的 source "${rel.source}" 不是有效的机构 ID（有效 ID: ${[...institutionIds].join(', ')})`,
          path: ['relations', data.relations.indexOf(rel), 'source'],
        });
      }
      if (!institutionIds.has(rel.target)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `关系 "${rel.id}" 的 target "${rel.target}" 不是有效的机构 ID（有效 ID: ${[...institutionIds].join(', ')})`,
          path: ['relations', data.relations.indexOf(rel), 'target'],
        });
      }
    }

    // 检查 timeline key 是否指向有效机构
    for (const key of Object.keys(data.timelines)) {
      if (!institutionIds.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `timelines 的键 "${key}" 不是有效的机构 ID（有效 ID: ${[...institutionIds].join(', ')})`,
          path: ['timelines', key],
        });
      }
    }

    // 内容原子（figure / event / concept）统一校验：id 同类型唯一 + institutionIds 指向存在机构
    // + links 命中全原子注册表。新增原子类型时复用此函数即可。
    const checkAtomRefs = (
      atoms: ReadonlyArray<{ id: string; institutionIds: string[]; links?: string[] }>,
      labelCn: string,
      key: 'figures' | 'events' | 'concepts',
    ) => {
      const seen = new Set<string>();
      atoms.forEach((atom, index) => {
        if (seen.has(atom.id)) {
          ctx.addIssue({
            code: 'custom',
            message: `${labelCn} id "${atom.id}" 重复（同类型原子 id 必须唯一）`,
            path: [key, index, 'id'],
          });
        }
        seen.add(atom.id);

        atom.institutionIds.forEach((instId, j) => {
          if (!institutionIds.has(instId)) {
            ctx.addIssue({
              code: 'custom',
              message: `${labelCn} "${atom.id}" 的 institutionId "${instId}" 不是有效的机构 ID`,
              path: [key, index, 'institutionIds', j],
            });
          }
        });

        (atom.links ?? []).forEach((link, j) => {
          if (!atomRefs.has(link)) {
            ctx.addIssue({
              code: 'custom',
              message: `${labelCn} "${atom.id}" 的 link "${link}" 未命中任何原子（注册表无此 AtomRef）`,
              path: [key, index, 'links', j],
            });
          }
        });
      });
    };

    checkAtomRefs(data.figures, '人物', 'figures');
    checkAtomRefs(data.events, '事件', 'events');
    checkAtomRefs(data.concepts, '概念', 'concepts');
  });

// ─── Inferred Types ──────────────────────────────────────────────────

export type ValidatedInstitution = z.infer<typeof InstitutionSchema>;
export type ValidatedRelation = z.infer<typeof RelationSchema>;
export type ValidatedTimelineEvent = z.infer<typeof TimelineEventSchema>;
export type ValidatedFigure = z.infer<typeof FigureSchema>;
export type ValidatedDynastyData = z.infer<typeof DynastyDataSchema>;
export type ValidatedDynastyTheme = z.infer<typeof DynastyThemeSchema>;
export type ValidatedInstitutionCategory = z.infer<typeof InstitutionCategorySchema>;
export type ValidatedRelationType = z.infer<typeof RelationTypeSchema>;
export type ValidatedFunctionItem = z.infer<typeof FunctionItemSchema>;
export type ValidatedInternalOrg = z.infer<typeof InternalOrgSchema>;
export type ValidatedInstitutionDetail = z.infer<typeof InstitutionDetailSchema>;
