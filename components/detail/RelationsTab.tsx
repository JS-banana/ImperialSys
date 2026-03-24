'use client';

import { getInstitutionById, getInstitutionRelations } from '@/lib/dataHelpers';
import { RELATION_STYLES } from '@/lib/constants';

interface RelationsTabProps {
  institutionId: string;
}

function RelationBlock({
  title,
  relationIds,
  institutionId,
}: {
  title: string;
  relationIds: ReturnType<typeof getInstitutionRelations>['incoming'];
  institutionId: string;
}) {
  if (relationIds.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">{title}</div>
      <div className="space-y-3">
        {relationIds.map((relation) => {
          const source = getInstitutionById(relation.source);
          const target = getInstitutionById(relation.target);
          const style = RELATION_STYLES[relation.type];
          const directionLabel =
            relation.source === institutionId
              ? `${source?.name ?? relation.source} → ${target?.name ?? relation.target}`
              : `${source?.name ?? relation.source} → ${target?.name ?? relation.target}`;

          return (
            <article
              key={relation.id}
              className="rounded-[22px] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
              style={{ borderColor: `${style.stroke}2c`, background: style.soft }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]"
                  style={{ background: `${style.stroke}18`, color: style.stroke }}
                >
                  {style.label}
                </span>
                <span className="text-sm font-medium text-[var(--ink-strong)]">{directionLabel}</span>
              </div>
              <div className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{relation.description}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function RelationsTab({ institutionId }: RelationsTabProps) {
  const relationMap = getInstitutionRelations(institutionId);

  if (relationMap.incoming.length === 0 && relationMap.outgoing.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-[rgba(255,255,255,0.45)] px-4 py-10 text-sm text-[var(--ink-subtle)]">
        暂无关系网络数据
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RelationBlock title="向外作用" relationIds={relationMap.outgoing} institutionId={institutionId} />
      <RelationBlock title="受到作用" relationIds={relationMap.incoming} institutionId={institutionId} />
    </div>
  );
}
