import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DynastyShell, DynastySection } from '@/platform/components/shell';
import { createDataHelpers } from '@/platform/utils';
import { getDynastyIds, getDynastyManifest } from '@/platform/registry';
import { DYNASTY_HEROES } from '@/platform/dynasty-client-map';

// 动态路由：以 [dynastyId] 取代 ming/tang 两个写死目录。
// output:'export' 下由 generateStaticParams 枚举全部朝代 + dynamicParams=false →
// 静态导出仍精确产出 out/dynasty/{ming,tang}.html，未注册 id 走 404。
// Server Component：构建期把分区组合进 SSR（逐一复刻 P3 组合逻辑），
// 给 GSAP 钉屏 / 内容原子一个稳定锚点。

export const dynamicParams = false;

export function generateStaticParams() {
  return getDynastyIds().map((dynastyId) => ({ dynastyId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dynastyId: string }>;
}): Promise<Metadata> {
  const { dynastyId } = await params;
  const manifest = getDynastyManifest(dynastyId);
  if (!manifest) return {};
  return {
    title: `${manifest.meta.name}政治制度可视化`,
    description: manifest.meta.description,
  };
}

export default async function DynastyPage({
  params,
}: {
  params: Promise<{ dynastyId: string }>;
}) {
  const { dynastyId } = await params;
  const manifest = getDynastyManifest(dynastyId);
  if (!manifest) notFound();

  const Hero = DYNASTY_HEROES[dynastyId];
  const data = manifest.getData();
  const helpers = createDataHelpers(data);

  const sectionTree = manifest.sections.map((section, index) => {
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
  const navSections = manifest.sections.map(({ component, ...config }) => config);

  return (
    <DynastyShell
      dynastyId={dynastyId}
      data={data}
      sections={navSections}
      footerNote={manifest.footerNote}
      hero={Hero}
    >
      {sectionTree}
    </DynastyShell>
  );
}
