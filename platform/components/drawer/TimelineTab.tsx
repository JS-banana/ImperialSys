'use client';

import { CATEGORY_COLORS } from '@/platform/constants';
import { useDataHelpers } from '@/platform/context/DataHelpersContext';
import type { TimelineEvent } from '@/platform/types';

interface TimelineTabProps {
  institutionId: string;
}

export default function TimelineTab({ institutionId }: TimelineTabProps) {
  const { getInstitutionById, getTimelines } = useDataHelpers();
  const events: TimelineEvent[] = getTimelines(institutionId);
  const institution = getInstitutionById(institutionId);
  const palette = institution ? CATEGORY_COLORS[institution.category] : CATEGORY_COLORS.central;

  if (events.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-[rgba(255,255,255,0.45)] text-sm text-[var(--ink-subtle)]">
        暂无历史演变数据
      </div>
    );
  }

  return (
    <div className="relative px-2">
      <div className="absolute bottom-0 left-12 top-0 w-px" style={{ background: `${palette.border}33` }} />

      <div className="space-y-6">
        {events.map((ev) => (
          <div key={`${ev.year}-${ev.event}`} className="relative flex gap-5">
            <div className="flex w-24 shrink-0 flex-col items-end">
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em]"
                style={{ background: `${palette.border}14`, color: palette.text }}
              >
                {ev.year}
              </span>
              <div
                className="relative z-10 mr-[-1px] mt-2 h-3 w-3 rounded-full border-2 border-[var(--paper)]"
                style={{ background: palette.border }}
              />
            </div>

            <div className="flex-1 rounded-[22px] border border-black/6 bg-[rgba(255,255,255,0.45)] px-4 py-4">
              <div className="text-sm font-semibold" style={{ color: palette.text }}>
                {ev.event}
              </div>
              <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
