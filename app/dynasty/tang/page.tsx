import { DynastyShell, DynastySection } from '@/platform/components/shell';
import { createDataHelpers } from '@/platform/utils';
import { getTangDynastyData, TANG_FOOTER_NOTE } from '@/dynasties/tang/meta';
import { SECTIONS } from '@/dynasties/tang/sections';
import TangHero from '@/dynasties/tang/components/TangHero';

// Server Component：在构建期把分区组合进 SSR——分区 DOM 真进 out/dynasty/tang.html，
// 给 GSAP 钉屏 / 内容原子一个稳定锚点（取代旧的运行时 section-registry）。
export default function TangPage() {
  const data = getTangDynastyData();
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
      dynastyId="tang"
      data={data}
      sections={navSections}
      footerNote={TANG_FOOTER_NOTE}
      hero={TangHero}
    >
      {sectionTree}
    </DynastyShell>
  );
}
