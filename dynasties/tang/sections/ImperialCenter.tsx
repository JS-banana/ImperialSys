'use client';

import type { SectionProps } from '@/platform/types';
import { InstitutionCard } from '@/platform/components/cards';
import { RelationBand } from '@/platform/components/shell';
import ThreeDepartmentsDiagram from '../components/ThreeDepartmentsDiagram';

export default function ImperialCenter({ institutions, relations }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {institutions.map((inst) => (
          <InstitutionCard
            key={inst.id}
            institution={inst}
            featured={inst.id === 'emperor'}
          />
        ))}
      </div>

      <div className="mt-10">
        <ThreeDepartmentsDiagram />
      </div>

      {relations.length > 0 && <RelationBand relations={relations} />}
    </>
  );
}
