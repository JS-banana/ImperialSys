import Link from 'next/link';
import { getDynastyMetaList } from '@/platform/registry';

export default function HomePage() {
  const dynasties = getDynastyMetaList();

  return (
    <div className="min-h-screen bg-[var(--paper,#F5F0E8)]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(184,134,11,0.15),transparent_62%)]" />
        <div className="relative mx-auto max-w-4xl px-8 pb-24 pt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-[rgba(255,255,255,0.5)] px-4 py-2 text-xs uppercase tracking-[0.34em] text-[var(--ink-subtle,#5C5C5C)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--gold,#B8860B)]" />
            数字化展厅
          </div>

          <h1 className="mt-8 font-heading text-5xl tracking-[0.28em] text-[var(--ink-strong,#2C2C2C)] xl:text-[4rem]">
            中国古代政治制度
          </h1>

          <p className="mt-6 text-lg tracking-[0.18em] text-[var(--ink-subtle,#5C5C5C)]">
            可视化 · 交互式 · 叙事驱动
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[var(--ink-muted,#5C5C5C)]">
            不是教科书式的文字堆砌，而是让你通过滚动叙事、交互图表、动画效果，直观理解每个朝代的权力结构和制度设计。
          </p>
        </div>
      </section>

      {/* Dynasty Grid */}
      <section className="mx-auto max-w-5xl px-8 pb-24">
        <h2 className="mb-12 text-center font-heading text-2xl tracking-[0.2em] text-[var(--ink-strong,#2C2C2C)]">
          选择朝代
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dynasties.map((dynasty) => (
            <Link
              key={dynasty.id}
              href={`/dynasty/${dynasty.id}`}
              className="group block rounded-[24px] border border-black/8 bg-[rgba(255,255,255,0.5)] p-8 shadow-[0_12px_32px_rgba(68,50,31,0.06)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(68,50,31,0.12)] hover:-translate-y-1"
            >
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle,#5C5C5C)]">
                {dynasty.period}
              </div>
              <h3 className="mt-4 font-heading text-3xl tracking-[0.18em] text-[var(--ink-strong,#2C2C2C)] transition-colors group-hover:text-[var(--vermillion,#C0392B)]">
                {dynasty.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-muted,#5C5C5C)]">
                {dynasty.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--vermillion,#C0392B)]">
                进入展厅
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}

          {/* Placeholder for future dynasties */}
          <div className="flex items-center justify-center rounded-[24px] border border-dashed border-black/15 bg-[rgba(255,255,255,0.2)] p-8 text-center">
            <div>
              <div className="text-3xl text-[var(--ink-subtle,#5C5C5C)]">…</div>
              <p className="mt-3 text-sm text-[var(--ink-subtle,#5C5C5C)]">
                更多朝代正在筹备中
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-4xl px-8 pb-12 text-center text-sm leading-7 text-[var(--ink-subtle,#5C5C5C)]">
        以可视化方式重建历史制度的内在逻辑，让每一次探索都成为对权力设计的理解之旅。
      </footer>
    </div>
  );
}
