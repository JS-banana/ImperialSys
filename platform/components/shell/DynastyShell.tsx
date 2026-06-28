'use client';

import { useEffect, useMemo } from 'react';
import type { DynastyData, SectionConfig } from '@/platform/types';
import { useScrollSpy } from '@/platform/hooks/useScrollSpy';
import { getSectionComponent } from '@/platform/components/section-registry';
import { createDataHelpers } from '@/platform/utils';
import { DataHelpersProvider } from '@/platform/context/DataHelpersContext';
import { SelectionProvider } from '@/platform/context/SelectionContext';
import StickyNav from './StickyNav';
import ScrollProgress from './ScrollProgress';
import DynastySection from './DynastySection';
import DynastyThemeStyle from './DynastyThemeStyle';
import { DetailDrawer } from '@/platform/components/drawer';

interface DynastyShellProps {
  dynastyId: string;
  data: DynastyData;
  sectionConfigs: SectionConfig[];
  registerSections: () => void;
  /** 朝代页脚结语（去明朝化：平台不再硬写「以明朝为起点…」，由各朝代提供）*/
  footerNote: string;
  /** 朝代自定义 Hero 组件（可选），渲染在分区之前。接收 data 作为 props */
  hero?: React.ComponentType<{ data: DynastyData }>;
}

export function DynastyShell({
  dynastyId,
  data,
  sectionConfigs,
  registerSections,
  footerNote,
  hero,
}: DynastyShellProps) {
  // 创建朝代数据查询工具（从 props 数据实例化，不依赖全局状态）
  const dataHelpers = useMemo(() => createDataHelpers(data), [data]);

  // 注册朝代 Section 组件（P3 Slice B 将以 page 端静态组合取代本运行时注册）
  useEffect(() => {
    registerSections();
  }, [registerSections]);

  const sectionIds = useMemo(() => sectionConfigs.map((s) => s.id), [sectionConfigs]);
  const activeSectionId = useScrollSpy(sectionIds);

  // 选中态 + 深链接由通用 SelectionProvider 承接；DataHelpers/Selection 均为「本朝代页」
  // 级别的关注点，故留在 shell（非 layout）；P8 持久转场覆盖层才上提 layout。
  return (
    <DataHelpersProvider data={data}>
      <SelectionProvider>
        {/* 服务端序列化朝代主题为作用域 <style>，零闪烁、单一真源 */}
        <DynastyThemeStyle dynastyId={dynastyId} theme={data.theme} />
        {/* data-dynasty 子树：主题令牌在此生效；包裹层自画 paper 底 + bgGradient，
            完整复刻原 body 绘制（盖住 body，避免半透明渐变双重叠加） */}
        <div
          data-dynasty={dynastyId}
          className="relative min-h-screen bg-background pb-20"
          style={{ backgroundImage: 'var(--bg-gradient)' }}
        >
          <StickyNav sections={sectionConfigs} activeId={activeSectionId} />
          <ScrollProgress />

          <main className="space-y-2">
            {hero && (
              <div className="mx-auto max-w-6xl px-8 pt-8">
                {(() => {
                  const HeroComponent = hero;
                  return <HeroComponent data={data} />;
                })()}
              </div>
            )}
            {sectionConfigs.map((config, index) => {
              const SectionComponent = getSectionComponent(dynastyId, config.id);
              if (!SectionComponent) return null;

              const sectionInstitutions = dataHelpers.getInstitutionsByIds(config.institutionIds);
              const sectionRelations = dataHelpers.getRelationsByIds(config.relationIds ?? []);

              return (
                <DynastySection
                  key={config.id}
                  index={index}
                  section={config}
                  institutionCount={sectionInstitutions.length}
                >
                  <SectionComponent
                    institutions={sectionInstitutions}
                    relations={sectionRelations}
                  />
                </DynastySection>
              );
            })}
          </main>

          <footer className="mx-auto mt-8 max-w-6xl px-8 text-center text-sm leading-7 text-[var(--ink-subtle)]">
            {footerNote}
          </footer>

          <DetailDrawer />
        </div>
      </SelectionProvider>
    </DataHelpersProvider>
  );
}
