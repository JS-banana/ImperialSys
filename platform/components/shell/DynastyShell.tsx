'use client';

import { type ReactNode, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { DynastyData, Institution, SectionConfig } from '@/platform/types';
import { useScrollSpy } from '@/platform/hooks/useScrollSpy';
import { getSectionComponent } from '@/platform/components/section-registry';
import { createDataHelpers, type DataHelpers } from '@/platform/utils';
import { DataHelpersProvider } from '@/platform/context/DataHelpersContext';
import StickyNav from './StickyNav';
import ScrollProgress from './ScrollProgress';
import DynastySection from './DynastySection';
import DynastyThemeStyle from './DynastyThemeStyle';
import { DetailDrawer } from '@/platform/components/drawer';

// useSyncExternalStore 的空订阅：深链接初值只读一次，不订阅 URL 变化
const subscribeToNothing = () => () => {};

/**
 * 仅客户端：从 ?institution=xxx 读取深链接机构。
 * SSR / 水合期返回 null（与静态 HTML 的抽屉关闭态一致），避免水合不一致。
 */
function readDeepLinkInstitution(dataHelpers: DataHelpers): Institution | null {
  if (typeof window === 'undefined') return null;
  const institutionId = new URLSearchParams(window.location.search).get('institution');
  return institutionId ? dataHelpers.getInstitutionById(institutionId) ?? null : null;
}

interface DynastyShellProps {
  dynastyId: string;
  data: DynastyData;
  sectionConfigs: SectionConfig[];
  registerSections: () => void;
  /** 朝代自定义 Hero 组件（可选），渲染在分区之前。接收 data 作为 props */
  hero?: React.ComponentType<{ data: DynastyData }>;
}

export function DynastyShell({
  dynastyId,
  data,
  sectionConfigs,
  registerSections,
  hero,
}: DynastyShellProps) {
  // 创建朝代数据查询工具（从 props 数据实例化，不依赖全局状态）
  const dataHelpers = useMemo(() => createDataHelpers(data), [data]);

  // 注册朝代 Section 组件
  useEffect(() => {
    registerSections();
  }, [registerSections]);

  // 深链接：?institution=xxx 决定初始选中机构。
  // useSyncExternalStore 在 SSR / 水合期返回 null（与静态 HTML 抽屉关闭态一致），
  // 挂载后切到 URL 派生值——既无 set-state-in-effect 级联渲染，也无水合不一致。
  const deepLinkInstitution = useSyncExternalStore(
    subscribeToNothing,
    () => readDeepLinkInstitution(dataHelpers),
    () => null,
  );

  // undefined = 用户尚未操作（沿用深链接初值）；null = 用户已关闭；Institution = 用户已选。
  const [userSelection, setUserSelection] = useState<Institution | null | undefined>(undefined);
  const selectedInstitution =
    userSelection === undefined ? deepLinkInstitution : userSelection;

  const sectionIds = useMemo(() => sectionConfigs.map((s) => s.id), [sectionConfigs]);
  const activeSectionId = useScrollSpy(sectionIds);

  const handleSelectInstitution = useCallback((inst: Institution | null) => {
    setUserSelection(inst);
    // 更新 URL 深链接
    const url = new URL(window.location.href);
    if (inst) {
      url.searchParams.set('institution', inst.id);
    } else {
      url.searchParams.delete('institution');
    }
    window.history.replaceState(null, '', url.toString());
  }, []);

  const handleClose = useCallback(() => {
    handleSelectInstitution(null);
  }, [handleSelectInstitution]);

  return (
    <DataHelpersProvider data={data}>
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
                  onSelectInstitution={handleSelectInstitution}
                />
              </DynastySection>
            );
          })}
        </main>

        <footer className="mx-auto mt-8 max-w-6xl px-8 text-center text-sm leading-7 text-[var(--ink-subtle)]">
          以明朝为起点，先把制度骨架讲清楚，再逐步扩展到其他朝代。
        </footer>

        <DetailDrawer
          institution={selectedInstitution}
          open={Boolean(selectedInstitution)}
          onClose={handleClose}
        />
      </div>
    </DataHelpersProvider>
  );
}
