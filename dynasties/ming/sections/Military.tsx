'use client';

import type { SectionProps } from '@/platform/types';
import { InstitutionCard } from '@/platform/components/cards';
import RelationDiagram from '@/dynasties/ming/components/RelationDiagram';

export default function Military({ institutions, onSelectInstitution }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {institutions.map((inst) => (
          <InstitutionCard
            key={inst.id}
            institution={inst}
            onSelect={onSelectInstitution}
          />
        ))}
      </div>

      <div className="mt-10">
        <RelationDiagram variant="military-balance" />
      </div>
    </>
  );
}
