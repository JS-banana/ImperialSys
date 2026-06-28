import { DynastyShell, DynastySection } from '@/platform/components/shell';
import { createDataHelpers } from '@/platform/utils';
import { getMingDynastyData, MING_FOOTER_NOTE } from '@/dynasties/ming/meta';
import { SECTIONS } from '@/dynasties/ming/sections';
import MingHero from '@/dynasties/ming/components/MingHero';

// Server Component：在构建期把分区组合进 SSR——分区 DOM 真进 out/dynasty/ming.html，
// 给 GSAP 钉屏 / 内容原子一个稳定锚点（取代旧的运行时 section-registry）。
export default function MingPage() {
  const data = getMingDynastyData();
  const helpers = createDataHelpers(data);

  const sectionTree = SECTIONS.map((section, index) => {
    const institutions = helpers.getInstitutionsByIds(section.institutionIds);
    const relations = helpers.getRelationsByIds(section.relationIds ?? []);
    const SectionComponent = section.component;
    return (
      <DynastySection
        key={section.id}
        index={index}
        section={section}
        institutionCount={institutions.length}
      >
        <SectionComponent institutions={institutions} relations={relations} />
      </DynastySection>
    );
  });

  // 给 Nav/ScrollSpy 的纯 config（剥离 component——函数不可跨 Server→Client 边界传递）
  const navSections = SECTIONS.map(({ component, ...config }) => config);

  return (
    <DynastyShell
      dynastyId="ming"
      data={data}
      sections={navSections}
      footerNote={MING_FOOTER_NOTE}
      hero={MingHero}
    >
      {sectionTree}
    </DynastyShell>
  );
}
