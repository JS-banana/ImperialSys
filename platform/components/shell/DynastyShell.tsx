'use client';

import { type ReactNode, useMemo } from 'react';
import type { DynastyData, SectionConfig } from '@/platform/types';
import { useScrollSpy } from '@/platform/hooks/useScrollSpy';
import { DataHelpersProvider } from '@/platform/context/DataHelpersContext';
import { SelectionProvider } from '@/platform/context/SelectionContext';
import StickyNav from './StickyNav';
import ScrollProgress from './ScrollProgress';
import DynastyThemeStyle from './DynastyThemeStyle';
import { DetailDrawer, DeepReadOverlay } from '@/platform/components/drawer';

interface DynastyShellProps {
  dynastyId: string;
  data: DynastyData;
  /** Nav/ScrollSpy 的分区 config（已在 page 端剥离 component，可序列化）*/
  sections: SectionConfig[];
  /** 朝代页脚结语（去明朝化：平台不再硬写「以明朝为起点…」，由各朝代提供）*/
  footerNote: string;
  /** 朝代自定义 Hero 组件（可选），渲染在分区之前。接收 data 作为 props */
  hero?: React.ComponentType<{ data: DynastyData }>;
  /** page(Server) 组合好的分区树——分区 DOM 在此进入 SSR */
  children: ReactNode;
}

/**
 * 朝代外壳（交互层）：Providers + Nav + Progress + Drawer + 主题作用域包裹层。
 * 分区不再由本组件运行时注册/渲染——改由 page(Server) 静态组合后作为 children 传入，
 * 真正进入 SSR。DataHelpers/Selection 均为「本朝代页」级关注点，故留 shell（非 layout）；
 * P8 持久转场覆盖层才上提 layout。
 */
export function DynastyShell({
  dynastyId,
  data,
  sections,
  footerNote,
  hero,
  children,
}: DynastyShellProps) {
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const activeSectionId = useScrollSpy(sectionIds);

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
          <StickyNav sections={sections} activeId={activeSectionId} />
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
            {children}
          </main>

          <footer className="mx-auto mt-8 max-w-6xl px-8 text-center text-sm leading-7 text-[var(--ink-subtle)]">
            {footerNote}
          </footer>

          <DetailDrawer dynastyId={dynastyId} />
          <DeepReadOverlay dynastyId={dynastyId} />
        </div>
      </SelectionProvider>
    </DataHelpersProvider>
  );
}
