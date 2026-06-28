'use client';

import { motion } from 'framer-motion';
import type { SectionConfig } from '@/platform/types';

interface StickyNavProps {
  sections: SectionConfig[];
  activeId: string;
}

export default function StickyNav({ sections, activeId }: StickyNavProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="fixed left-6 top-10 z-30 hidden w-28 xl:block">
      <div className="rounded-[26px] border border-black/8 bg-[rgba(255,255,255,0.62)] px-3 py-4 shadow-[0_12px_30px_rgba(68,50,31,0.08)] backdrop-blur">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mb-4 flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)] transition-colors hover:bg-[rgba(192,57,43,0.08)] hover:text-[var(--vermillion)]"
        >
          ♦ 返回顶部
        </button>
        <nav className="space-y-1">
          {sections.map((section) => {
            const active = section.id === activeId;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollTo(section.id)}
                className="relative flex w-full items-center gap-2 overflow-hidden rounded-full px-3 py-2 text-left text-sm tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:bg-[rgba(192,57,43,0.08)] hover:text-[var(--ink-strong)]"
              >
                {active ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-[rgba(192,57,43,0.12)]"
                  />
                ) : null}
                <span className={`relative z-10 text-base leading-none ${active ? 'text-[var(--vermillion)]' : ''}`}>
                  ·
                </span>
                <span className={`relative z-10 ${active ? 'text-[var(--vermillion)]' : ''}`}>
                  {section.title}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
