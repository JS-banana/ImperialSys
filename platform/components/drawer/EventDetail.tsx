'use client';

import type { EventAtom } from '@/platform/types';
import { makeAtomRef } from '@/platform/context/selection';
import AtomLinks from './AtomLinks';

/**
 * 事件原子最小视图（L1）：纪要 + 标签 + 涉及机构互链 chip。
 * 跨切面大事件晋升一等原子后的「可看」入口；timelines 叙事节拍另存、不并入此处。
 */
export default function EventDetail({ event }: { event: EventAtom }) {
  return (
    <div className="space-y-5">
      {/* summary 已作抽屉头部 subtitle，正文不重复；此处只补标签 + 涉及机构。*/}
      {event.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--vermillion-wash)] px-2.5 py-1 text-[11px] tracking-[0.14em] text-[var(--ink-strong)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/* 深度契约 links（关联）由抽屉头部统一渲染；此处只补事件特有的「涉及机构」横跳。*/}
      <AtomLinks
        label="涉及机构"
        refs={event.institutionIds.map((id) => makeAtomRef('institution', id))}
      />
    </div>
  );
}
