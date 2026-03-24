'use client';

import type { Institution, NarrativeSection, Relation } from '@/lib/types';
import InstitutionCard from './InstitutionCard';
import RelationBand from './RelationBand';
import RelationDiagram from './RelationDiagram';

interface SectionWrapperProps {
  index: number;
  section: NarrativeSection;
  institutions: Institution[];
  intraRelations: Relation[];
  interRelations: Relation[];
  onSelectInstitution: (institution: Institution) => void;
}

const layoutClasses: Record<NarrativeSection['layout'], string> = {
  featured: 'grid-cols-1',
  split: 'grid-cols-1 lg:grid-cols-2',
  trio: 'grid-cols-1 lg:grid-cols-3',
  grid: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
};

export default function SectionWrapper({
  index,
  section,
  institutions,
  intraRelations,
  interRelations,
  onSelectInstitution,
}: SectionWrapperProps) {
  return (
    <section id={section.id} className="scroll-mt-24 py-16">
      <div className="mx-auto max-w-6xl px-8">
        <div className="rounded-[34px] border border-black/8 bg-[rgba(255,255,255,0.38)] px-8 py-9 shadow-[0_18px_40px_rgba(68,50,31,0.06)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs uppercase tracking-[0.36em] text-[var(--ink-subtle)]">
                第 {index + 1} 层 · {section.subtitle}
              </div>
              <h2 className="font-heading text-4xl tracking-[0.2em] text-[var(--ink-strong)]">
                {section.title}
              </h2>
              <p className="text-base leading-8 text-[var(--ink-muted)]">{section.prologue}</p>
            </div>
            <div className="rounded-full border border-[rgba(44,44,44,0.1)] bg-[rgba(245,240,232,0.75)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">
              {institutions.length} 个关键机构
            </div>
          </div>

          <div className={`mt-10 grid gap-6 ${layoutClasses[section.layout]}`}>
            {institutions.map((institution) => (
              <InstitutionCard
                key={institution.id}
                institution={institution}
                onSelect={onSelectInstitution}
              />
            ))}
          </div>

          {section.diagramVariant ? (
            <div className="mt-10">
              <RelationDiagram variant={section.diagramVariant} />
            </div>
          ) : null}

          {intraRelations.length > 0 && !section.diagramVariant ? (
            <div className="mt-10">
              <RelationBand relations={intraRelations} />
            </div>
          ) : null}

          <RelationBand relations={interRelations} />
        </div>
      </div>
    </section>
  );
}
