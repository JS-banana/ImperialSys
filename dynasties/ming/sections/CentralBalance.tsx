'use client';

import type { SectionProps } from '@/platform/types';
import { InstitutionCard } from '@/platform/components/cards';
import { RelationBand } from '@/platform/components/shell';
import RelationDiagram from '@/dynasties/ming/components/RelationDiagram';

export default function CentralBalance({ institutions, relations }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {institutions.map((inst) => (
          <InstitutionCard
            key={inst.id}
            institution={inst}
          />
        ))}
      </div>

      <div className="mt-10">
        <RelationDiagram variant="cabinet-silijian" />
      </div>

      {relations.length > 0 && <RelationBand relations={relations} />}
    </>
  );
}
