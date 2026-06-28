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

export const FigureSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string(),
  title: z.string(),
  period: z.string(),
  evaluation: z.string(),
  story: z.string(),
  tags: z.array(z.string()).min(1),
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
    figures: z.record(z.string(), z.array(FigureSchema)),
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

    // 检查 figure key 是否指向有效机构
    for (const key of Object.keys(data.figures)) {
      if (!institutionIds.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `figures 的键 "${key}" 不是有效的机构 ID（有效 ID: ${[...institutionIds].join(', ')})`,
          path: ['figures', key],
        });
      }
    }
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
