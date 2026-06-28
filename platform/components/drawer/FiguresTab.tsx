'use client';

import { useState } from 'react';
import { CATEGORY_COLORS } from '@/platform/constants';
import { useDataHelpers } from '@/platform/context/DataHelpersContext';
import type { Figure } from '@/platform/types';

interface FiguresTabProps {
  institutionId: string;
}

function FigureCard({
  figure,
  accent,
}: {
  figure: Figure;
  accent: { text: string; border: string };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-[24px] border bg-[rgba(255,255,255,0.45)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
      style={{ borderColor: `${accent.border}26` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 px-4 py-4">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{ background: `${accent.border}18`, color: accent.text }}
        >
          {figure.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold" style={{ color: accent.text }}>
              {figure.name}
            </span>
            <span className="text-xs text-[var(--ink-subtle)]">{figure.title}</span>
          </div>
          <div className="mt-0.5 text-xs uppercase tracking-[0.18em] text-[var(--ink-subtle)]">{figure.period}</div>
          <div className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{figure.evaluation}</div>
        </div>
        <span className="shrink-0 text-xs text-[var(--ink-subtle)]">{expanded ? '收起' : '展开'}</span>
      </div>

      {expanded && (
        <div className="border-t border-black/6 px-4 pb-4 pt-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">典故详情</div>
          <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{figure.story}</p>
          {figure.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {figure.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-1 text-[11px] tracking-[0.14em]"
                  style={{ background: `${accent.border}14`, color: accent.text }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FiguresTab({ institutionId }: FiguresTabProps) {
  const { getInstitutionById, getFigures } = useDataHelpers();
  const figures: Figure[] = getFigures(institutionId);
  const institution = getInstitutionById(institutionId);
  const palette = institution ? CATEGORY_COLORS[institution.category] : CATEGORY_COLORS.central;

  if (figures.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-[rgba(255,255,255,0.45)] text-sm text-[var(--ink-subtle)]">
        暂无代表人物数据
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {figures.map((f) => (
        <FigureCard key={f.id} figure={f} accent={{ text: palette.text, border: palette.border }} />
      ))}
    </div>
  );
}
