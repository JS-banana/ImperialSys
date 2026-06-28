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

// ─── Combined DynastyData with Cross-Reference Checks ────────────────

export const DynastyDataSchema = z
  .strictObject({
    institutions: z.array(InstitutionSchema),
    relations: z.array(RelationSchema),
    timelines: z.record(z.string(), z.array(TimelineEventSchema)),
    figures: z.record(z.string(), z.array(FigureSchema)),
  })
  .superRefine((data, ctx) => {
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
export type ValidatedInstitutionCategory = z.infer<typeof InstitutionCategorySchema>;
export type ValidatedRelationType = z.infer<typeof RelationTypeSchema>;
export type ValidatedFunctionItem = z.infer<typeof FunctionItemSchema>;
export type ValidatedInternalOrg = z.infer<typeof InternalOrgSchema>;
export type ValidatedInstitutionDetail = z.infer<typeof InstitutionDetailSchema>;
