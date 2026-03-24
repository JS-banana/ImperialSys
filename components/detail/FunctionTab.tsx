'use client';

import type { Institution } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';

interface FunctionTabProps {
  institution: Institution;
}

export default function FunctionTab({ institution }: FunctionTabProps) {
  const { detail, established, summary } = institution;
  const palette = CATEGORY_COLORS[institution.category];

  return (
    <div className="space-y-6">
      <div
        className="rounded-[24px] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        style={{ background: palette.bg, borderColor: `${palette.border}33` }}
      >
        <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">设立时间</div>
        <div className="mt-2 font-heading text-2xl tracking-[0.14em]" style={{ color: palette.text }}>
          {established} 年
        </div>
        <div className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">{summary}</div>
      </div>

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">核心职能</div>
        <div className="space-y-3">
          {detail.functions.map((fn) => (
            <div
              key={fn.title}
              className="rounded-[22px] border px-4 py-4"
              style={{ background: 'rgba(255,255,255,0.5)', borderColor: `${palette.border}20` }}
            >
              <div className="flex gap-3">
                <span className="mt-0.5 text-xl leading-none">{fn.icon}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: palette.text }}>
                    {fn.title}
                  </div>
                  <div className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">{fn.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail.structure && (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">机构结构</div>
          <p className="rounded-[22px] border border-black/6 bg-[rgba(255,255,255,0.45)] px-4 py-4 text-sm leading-7 text-[var(--ink-muted)]">
            {detail.structure}
          </p>
        </div>
      )}

      {detail.internalOrgs.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[var(--ink-subtle)]">内部组织</div>
          <div className="space-y-2">
            {detail.internalOrgs.map((org) => (
              <div key={org.name} className="flex gap-3 rounded-[18px] border border-black/6 bg-[rgba(255,255,255,0.45)] px-4 py-3 text-sm">
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]"
                  style={{ background: `${palette.border}14`, color: palette.text }}
                >
                  {org.name}
                </span>
                <span className="leading-7 text-[var(--ink-muted)]">{org.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
