'use client';

import { motion } from 'framer-motion';
import type { DynastyData } from '@/platform/types';

interface TangHeroProps {
  data: DynastyData;
}

export default function TangHero({ data }: TangHeroProps) {
  return (
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
            唐朝政治制度
          </h1>
          <p className="text-lg tracking-[0.18em] text-[var(--ink-subtle)]">
            三省六部制全景 · 618-907
          </p>
        </div>
        <p className="max-w-2xl text-base leading-8 text-[var(--ink-muted)]">
          唐朝继承并完善了隋朝的三省六部制，是中国古代政治制度成熟的标志。中书出令、门下封驳、尚书执行，三省长官在政事堂共同议政，形成了中国古代最精密的分权制衡体制。
        </p>
      </div>

      <div className="self-end rounded-[30px] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(160deg,rgba(255,252,246,0.9),rgba(245,240,232,0.88))] p-6 shadow-[0_20px_50px_rgba(92,74,30,0.08)]">
        <div className="text-xs uppercase tracking-[0.32em] text-[var(--ink-subtle)]">制度特色</div>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-muted)]">
          <li>三省分权制衡，门下省拥有法定封驳权，可驳回皇帝诏令。</li>
          <li>政事堂集体议政，分散相权又保证决策质量。</li>
          <li>六部二十四司体系完备，是古代行政制度的成熟形态。</li>
          <li>翰林学士从文学侍从崛起为「内相」，体现内廷权力的扩张。</li>
        </ul>
      </div>
    </motion.div>
  );
}
