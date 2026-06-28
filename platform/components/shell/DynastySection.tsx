import type { ReactNode } from 'react';
import type { SectionConfig } from '@/platform/types';

interface DynastySectionProps {
  index: number;
  section: SectionConfig;
  institutionCount: number;
  children: ReactNode;
}

const layoutClasses: Record<SectionConfig['layout'], string> = {
  featured: 'grid-cols-1',
  split: 'grid-cols-1 lg:grid-cols-2',
  trio: 'grid-cols-1 lg:grid-cols-3',
  grid: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
};

export { layoutClasses };

export default function DynastySection({
  index,
  section,
  institutionCount,
  children,
}: DynastySectionProps) {
  return (
    <section id={section.id} className="scroll-mt-24 py-16">
      <div className="mx-auto max-w-6xl px-8">
        <div className="rounded-[34px] border border-black/8 bg-[rgba(255,255,255,0.38)] px-8 py-9 shadow-[0_18px_40px_rgba(68,50,31,0.06)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs uppercase tracking-[0.36em] text-[var(--ink-subtle)]">
                第 {index + 1} 层 · {section.subtitle}
              </div>
              <h2 className="font-heading text-4xl tracking-[0.2em] text-[var(--ink-strong)]">
                {section.title}
              </h2>
              <p className="text-base leading-8 text-[var(--ink-muted)]">{section.prologue}</p>
            </div>
            <div className="rounded-full border border-[rgba(44,44,44,0.1)] bg-[rgba(245,240,232,0.75)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">
              {institutionCount} 个关键机构
            </div>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
