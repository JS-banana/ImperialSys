import type { SectionProps } from '@/platform/types';
import { InstitutionCard } from '@/platform/components/cards';
import RelationDiagram from '@/dynasties/ming/components/RelationDiagram';

export default function Oversight({ institutions }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {institutions.map((inst) => (
          <InstitutionCard
            key={inst.id}
            institution={inst}
          />
        ))}
      </div>

      <div className="mt-10">
        <RelationDiagram variant="three-judicial-offices" />
      </div>
    </>
  );
}
