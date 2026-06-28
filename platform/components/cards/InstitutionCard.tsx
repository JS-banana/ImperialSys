'use client';

import { ArrowUpRight, Landmark, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Institution } from '@/platform/types';
import { cn } from '@/platform/utils';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/platform/constants';

interface InstitutionCardProps {
  institution: Institution;
  featured?: boolean;
  onSelect: (institution: Institution) => void;
}

export default function InstitutionCard({ institution, featured = false, onSelect }: InstitutionCardProps) {
  const palette = CATEGORY_COLORS[institution.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-[30px] border px-6 py-6 shadow-[0_16px_40px_rgba(68,50,31,0.08)]"
      style={{
        background: featured
          ? 'linear-gradient(145deg, rgba(250,243,224,0.98), rgba(255,249,236,0.92))'
          : `linear-gradient(145deg, ${palette.bg}, rgba(255,255,255,0.72))`,
        borderColor: featured ? 'rgba(184, 134, 11, 0.45)' : `${palette.border}44`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-3xl"
        style={{ background: `${palette.accent}33` }}
      />

      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex min-w-12 -rotate-3 items-center justify-center rounded-sm px-2 py-1 text-[11px] font-semibold tracking-[0.24em] uppercase shadow-sm"
              style={{ background: palette.badgeBg, color: palette.badgeText }}
            >
              {CATEGORY_LABELS[institution.category]}
            </span>
            <div className="text-xs uppercase tracking-[0.32em] text-[var(--ink-subtle)]">
              {institution.established}
            </div>
          </div>
          <div
            className="rounded-full border px-2.5 py-1 text-[11px] tracking-[0.18em]"
            style={{ borderColor: `${palette.border}55`, color: palette.text }}
          >
            L{institution.level}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3
              className={cn('font-heading text-2xl tracking-[0.28em]', featured && 'text-[2rem]')}
              style={{ color: palette.text }}
            >
              {institution.name}
            </h3>
            <div
              className="mt-3 h-px w-24"
              style={{
                background: `linear-gradient(90deg, ${palette.border}, rgba(255,255,255,0))`,
              }}
            />
          </div>
          <p className="text-sm leading-7 text-[var(--ink-muted)]">{institution.summary}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[var(--ink-subtle)]">
            <Landmark className="size-3.5" />
            核心职能
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {institution.detail.functions.slice(0, 4).map((fn) => (
              <div
                key={fn.title}
                className="rounded-2xl border px-3 py-3 text-sm"
                style={{
                  borderColor: `${palette.border}26`,
                  background: 'rgba(255,255,255,0.54)',
                }}
              >
                <div className="flex items-center gap-2 font-medium" style={{ color: palette.text }}>
                  <span className="text-base leading-none">{fn.icon}</span>
                  <span>{fn.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-black/6 pt-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[var(--ink-subtle)]">
              <ScrollText className="size-3.5" />
              内部组织
            </div>
            <p className="max-w-[34rem] text-sm leading-6 text-[var(--ink-muted)]">
              {institution.detail.internalOrgs.length > 0
                ? institution.detail.internalOrgs.map((org) => org.name).join(' · ')
                : '暂无内部组织记录。'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelect(institution)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--vermillion-wash)]"
            style={{ borderColor: palette.border, color: palette.text }}
          >
            查看详情
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
