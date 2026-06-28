'use client';

import type { DynastyData } from '@/platform/types';
import HeroContent from './HeroContent';
import MiniStructureMap from './MiniStructureMap';

interface MingHeroProps {
  data: DynastyData;
}

export default function MingHero({ data }: MingHeroProps) {
  return (
    <>
      <HeroContent />
      <MiniStructureMap
        institutions={data.institutions}
        onNavigate={(id) => {
          // 滚动到所属 section
          const sections = document.querySelectorAll('section[id]');
          for (const section of sections) {
            if (section.querySelector(`[data-institution="${id}"]`)) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              return;
            }
          }
        }}
      />
    </>
  );
}
