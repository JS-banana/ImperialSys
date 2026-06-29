'use client';

import { useDataHelpers } from '@/platform/context/DataHelpersContext';
import { useSelection } from '@/platform/context/SelectionContext';
import { parseAtomRef, type AtomRef, type AtomType } from '@/platform/context/selection';

const TYPE_LABEL: Record<AtomType, string> = {
  institution: '机构',
  figure: '人物',
  event: '事件',
  concept: '概念',
};

interface ResolvedLink {
  ref: AtomRef;
  type: AtomType;
  name: string;
}

/**
 * 互链 chip：把一组 AtomRef 渲染成可点 chip，点击 select 该原子（站内下钻/横跳）。
 * P5「可被任意处互链」的统一出口——抽屉头部消费机构/人物/事件的 links 与 institutionIds。
 * 解析不到名字的 ref（如 ⑦ 之前的 concept）静默跳过，绝不渲染空 chip。
 */
export default function AtomLinks({ label, refs }: { label: string; refs: string[] }) {
  const { select } = useSelection();
  const helpers = useDataHelpers();

  const items: ResolvedLink[] = refs.flatMap((raw) => {
    const ref = raw as AtomRef;
    const { type, id } = parseAtomRef(ref);
    const name =
      type === 'institution'
        ? helpers.getInstitutionById(id)?.name
        : type === 'figure'
          ? helpers.getFigureById(id)?.name
          : type === 'event'
            ? helpers.getEventById(id)?.name
            : undefined; // concept 待 ⑦ 接 getConceptById
    return name ? [{ ref, type, name }] : [];
  });

  if (items.length === 0) return null;

  return (
    <div className="mt-3 space-y-1.5">
      <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink-subtle)]">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map(({ ref, type, name }) => (
          <button
            key={ref}
            type="button"
            onClick={() => select(ref)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[rgba(255,255,255,0.5)] px-2.5 py-1 text-xs text-[var(--ink-strong)] transition-colors hover:bg-[var(--vermillion-wash)]"
          >
            <span className="text-[10px] tracking-[0.14em] text-[var(--ink-subtle)]">{TYPE_LABEL[type]}</span>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
