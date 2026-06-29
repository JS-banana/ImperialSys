'use client';

import type { ConceptAtom } from '@/platform/types';
import { makeAtomRef } from '@/platform/context/selection';
import AtomLinks from './AtomLinks';

/**
 * 概念原子最小视图（L1）：制度角色 + 相关机构互链 chip。
 * summary 已作抽屉头部 subtitle；深度（如票拟批红）走 L2 全屏深读，不在此堆叠。
 */
export default function ConceptDetail({ concept }: { concept: ConceptAtom }) {
  return (
    <div className="space-y-5">
      {concept.institutionalRole ? (
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink-subtle)]">制度角色</div>
          <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{concept.institutionalRole}</p>
        </div>
      ) : null}

      {/* 深度契约 links（关联）由抽屉头部统一渲染；此处只补概念特有的「相关机构」横跳。*/}
      <AtomLinks
        label="相关机构"
        refs={concept.institutionIds.map((id) => makeAtomRef('institution', id))}
      />
    </div>
  );
}
