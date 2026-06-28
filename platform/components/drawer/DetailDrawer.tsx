'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FunctionTab from './FunctionTab';
import TimelineTab from './TimelineTab';
import FiguresTab from './FiguresTab';
import RelationsTab from './RelationsTab';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/platform/constants';
import { useSelection } from '@/platform/context/SelectionContext';
import { parseAtomRef } from '@/platform/context/selection';
import { useDataHelpers } from '@/platform/context/DataHelpersContext';

/**
 * 详情抽屉：从通用 SelectionContext 读选中态、从 DataHelpers 解析机构。
 * P3 仅消费 institution 原子；其余原子类型（event/figure/concept）由 P5 内容原子系统接管。
 */
export default function DetailDrawer() {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { selectedRef, clear } = useSelection();
  const helpers = useDataHelpers();

  const institution = useMemo(() => {
    if (!selectedRef) return null;
    const { type, id } = parseAtomRef(selectedRef);
    return type === 'institution' ? helpers.getInstitutionById(id) ?? null : null;
  }, [selectedRef, helpers]);

  const open = institution !== null;
  const onClose = clear;

  useEffect(() => {
    if (!open || !institution) {
      return undefined;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => drawerRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [institution, onClose, open]);

  if (!institution) {
    return null;
  }

  const palette = CATEGORY_COLORS[institution.category];

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="drawer-overlay"
            type="button"
            aria-label="关闭详情抽屉"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[rgba(44,36,28,0.3)] backdrop-blur-[2px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
          />

          <motion.aside
            key={institution.id}
            ref={drawerRef}
            tabIndex={-1}
            initial={reduceMotion ? false : { x: '100%', opacity: 0.45 }}
            animate={reduceMotion ? undefined : { x: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { x: '100%', opacity: 0.45 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[min(480px,92vw)] flex-col border-l border-black/8 bg-[var(--paper)] shadow-[-16px_0_48px_rgba(68,50,31,0.14)] outline-none"
          >
            <div
              className="border-b border-black/8 px-6 py-5"
              style={{
                background: `linear-gradient(160deg, ${palette.bg}, rgba(255,255,255,0.88))`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex -rotate-3 items-center justify-center rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.24em]"
                      style={{ background: palette.badgeBg, color: palette.badgeText }}
                    >
                      {CATEGORY_LABELS[institution.category]}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-[var(--ink-subtle)]">
                      {institution.established}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl tracking-[0.22em]" style={{ color: palette.text }}>
                      {institution.name}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{institution.summary}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[rgba(255,255,255,0.65)] text-[var(--ink-subtle)] transition-colors hover:text-[var(--ink-strong)]"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 px-4 pb-4 pt-4">
              <Tabs key={institution.id} defaultValue="function" className="h-full">
                <TabsList
                  variant="line"
                  className="w-full gap-1 rounded-[18px] border border-black/8 bg-[rgba(255,255,255,0.45)] p-1"
                >
                  <TabsTrigger value="function" className="rounded-[14px] text-xs">
                    职能与结构
                  </TabsTrigger>
                  <TabsTrigger value="relations" className="rounded-[14px] text-xs">
                    关系网络
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="rounded-[14px] text-xs">
                    历史演变
                  </TabsTrigger>
                  <TabsTrigger value="figures" className="rounded-[14px] text-xs">
                    代表人物
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 h-[calc(100%-3.5rem)] overflow-y-auto pr-1">
                  <TabsContent value="function" className="m-0">
                    <FunctionTab institution={institution} />
                  </TabsContent>
                  <TabsContent value="relations" className="m-0">
                    <RelationsTab institutionId={institution.id} />
                  </TabsContent>
                  <TabsContent value="timeline" className="m-0">
                    <TimelineTab institutionId={institution.id} />
                  </TabsContent>
                  <TabsContent value="figures" className="m-0">
                    <FiguresTab institutionId={institution.id} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
