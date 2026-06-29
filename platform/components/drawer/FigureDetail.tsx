'use client';

import type { Figure } from '@/platform/types';
import { makeAtomRef } from '@/platform/context/selection';
import AtomLinks from './AtomLinks';

/**
 * 人物原子最小视图（L1）：评价 + 典故 + 标签 + 所属机构互链 chip。
 * 富展示（年表/关系定位）随 P6/P7；此处先让 figure 原子「可看」并能横跳回机构。
 */
export default function FigureDetail({ figure }: { figure: Figure }) {
  return (
    <div className="space-y-5">
      {/* evaluation 已作抽屉头部 subtitle，正文不重复；此处只补典故 + 标签 + 所属机构。*/}
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink-subtle)]">典故</div>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{figure.story}</p>
      </div>

      {figure.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {figure.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--vermillion-wash)] px-2.5 py-1 text-[11px] tracking-[0.14em] text-[var(--ink-strong)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/* 深度契约 links（关联）由抽屉头部统一渲染；此处只补人物特有的「所属机构」横跳。*/}
      <AtomLinks
        label="所属机构"
        refs={figure.institutionIds.map((id) => makeAtomRef('institution', id))}
      />
    </div>
  );
}
