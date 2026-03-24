'use client';

import { motion } from 'framer-motion';
import type { Institution } from '@/lib/types';
import MiniStructureMap from './MiniStructureMap';

interface HeroSectionProps {
  institutions: Institution[];
  onNavigate: (institutionId: string) => void;
}

export default function HeroSection({ institutions, onNavigate }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(184,134,11,0.18),transparent_62%)]" />
      <div className="mx-auto max-w-6xl px-8 pb-16 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-[rgba(255,255,255,0.5)] px-4 py-2 text-xs uppercase tracking-[0.34em] text-[var(--ink-subtle)]">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--gold)]" />
              数字化展厅
            </div>
            <div className="space-y-4">
              <h1 className="font-heading text-5xl tracking-[0.28em] text-[var(--ink-strong)] xl:text-[4rem]">
                明朝政治制度
              </h1>
              <p className="text-lg tracking-[0.18em] text-[var(--ink-subtle)]">
                中枢权力架构全景 · 1368-1644
              </p>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[var(--ink-muted)]">
              这不是一张可以拖拽缩放的编辑器画布，而是一条有叙事节奏的参观路线。你会先看到明朝权力结构的全景，再沿着皇权、中枢、六部、监察、军事与特务系统逐层深入。
            </p>
          </div>

          <div className="self-end rounded-[30px] border border-[rgba(184,134,11,0.18)] bg-[linear-gradient(160deg,rgba(255,252,246,0.9),rgba(245,240,232,0.88))] p-6 shadow-[0_20px_50px_rgba(92,74,30,0.08)]">
            <div className="text-xs uppercase tracking-[0.32em] text-[var(--ink-subtle)]">阅读方式</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-muted)]">
              <li>先在总览图中建立结构感知，再进入每一层的制度叙事。</li>
              <li>重点关系以层间关系带和层内图解双重呈现，避免只剩下碎片化卡片。</li>
              <li>点击任何机构都能打开详情抽屉，继续查看职能、关系、演变与人物。</li>
            </ul>
          </div>
        </motion.div>

        <MiniStructureMap institutions={institutions} onNavigate={onNavigate} />

        <div className="mt-8 text-center text-sm tracking-[0.26em] text-[var(--ink-subtle)]">
          向下滚动探索 ↓
        </div>
      </div>
    </section>
  );
}
