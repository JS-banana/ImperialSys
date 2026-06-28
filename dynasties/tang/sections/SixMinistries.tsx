'use client';

import type { SectionProps } from '@/platform/types';
import { InstitutionCard } from '@/platform/components/cards';
import { RelationBand } from '@/platform/components/shell';

export default function SixMinistries({ institutions, relations, onSelectInstitution }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {institutions.map((inst) => (
          <InstitutionCard
            key={inst.id}
            institution={inst}
            onSelect={onSelectInstitution}
          />
        ))}
      </div>

      {relations.length > 0 && <RelationBand relations={relations} />}
    </>
  );
}
