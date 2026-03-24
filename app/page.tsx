'use client';

import { useCallback, useMemo, useState } from 'react';
import DetailDrawer from '@/components/detail/DetailDrawer';
import HeroSection from '@/components/scroll/HeroSection';
import ScrollProgress from '@/components/scroll/ScrollProgress';
import SectionWrapper from '@/components/scroll/SectionWrapper';
import StickyNav from '@/components/scroll/StickyNav';
import { useInstitutionData } from '@/hooks/useInstitutionData';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import type { Institution } from '@/lib/types';

export default function HomePage() {
  const { institutions, sections, getSectionForInstitution } = useInstitutionData();
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const activeSectionId = useScrollSpy(sectionIds);

  const handleNodeSelect = useCallback((institution: Institution | null) => {
    setSelectedInstitution(institution);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedInstitution(null);
  }, []);

  const scrollToInstitutionSection = useCallback(
    (institutionId: string) => {
      const section = getSectionForInstitution(institutionId);

      if (section) {
        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [getSectionForInstitution]
  );

  return (
    <div className="relative pb-20">
      <StickyNav sections={sections} activeId={activeSectionId} />
      <ScrollProgress />

      <HeroSection institutions={institutions} onNavigate={scrollToInstitutionSection} />

      <main className="space-y-2">
        {sections.map((section, index) => (
          <SectionWrapper
            key={section.id}
            index={index}
            section={section}
            institutions={section.institutions}
            intraRelations={section.intraRelations}
            interRelations={section.interRelations}
            onSelectInstitution={(institution) => handleNodeSelect(institution)}
          />
        ))}
      </main>

      <footer className="mx-auto mt-8 max-w-6xl px-8 text-center text-sm leading-7 text-[var(--ink-subtle)]">
        以明朝为起点，先把制度骨架讲清楚，再逐步扩展到其他朝代。
      </footer>

      <DetailDrawer institution={selectedInstitution} open={Boolean(selectedInstitution)} onClose={handleClose} />
    </div>
  );
}
