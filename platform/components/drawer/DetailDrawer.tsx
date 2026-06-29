'use client';

import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FunctionTab from './FunctionTab';
import TimelineTab from './TimelineTab';
import FiguresTab from './FiguresTab';
import RelationsTab from './RelationsTab';
import FigureDetail from './FigureDetail';
import EventDetail from './EventDetail';
import ConceptDetail from './ConceptDetail';
import AtomLinks from './AtomLinks';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/platform/constants';
import { useSelection } from '@/platform/context/SelectionContext';
import { parseAtomRef } from '@/platform/context/selection';
import { useDataHelpers } from '@/platform/context/DataHelpersContext';
import { hasDeepRead } from '@/platform/content/deep-read-map';

/**
 * 详情抽屉：从通用 SelectionContext 读选中态，按 AtomRef 的 type 路由到各原子视图。
 * P5 ⑥：institution（机构 Tabs，不变）/ figure / event 均可选中可看；深读 L2 按钮对任意
 * 命中 MDX map 的原子开放；头部互链 chip 兑现「可被任意处互链」。concept 路由待 ⑦。
 */
export default function DetailDrawer({ dynastyId }: { dynastyId: string }) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { selectedRef, clear, deepReadRef, openDeepRead } = useSelection();
  const helpers = useDataHelpers();

  // L2 遮罩开着时，Esc 归 L2（见 DeepReadOverlay），抽屉不连带关闭——用 ref 读最新值免 effect 重挂。
  const deepReadOpenRef = useRef(false);
  useEffect(() => {
    deepReadOpenRef.current = deepReadRef !== null;
  }, [deepReadRef]);

  // 按 type 解析选中原子（解析不到 → null，抽屉关）。concept 待 ⑦。
  const resolved = useMemo(() => {
    if (!selectedRef) return null;
    const { type, id } = parseAtomRef(selectedRef);
    if (type === 'institution') {
      const institution = helpers.getInstitutionById(id);
      return institution ? ({ kind: 'institution', institution } as const) : null;
    }
    if (type === 'figure') {
      const figure = helpers.getFigureById(id);
      return figure ? ({ kind: 'figure', figure } as const) : null;
    }
    if (type === 'event') {
      const event = helpers.getEventById(id);
      return event ? ({ kind: 'event', event } as const) : null;
    }
    if (type === 'concept') {
      const concept = helpers.getConceptById(id);
      return concept ? ({ kind: 'concept', concept } as const) : null;
    }
    return null;
  }, [selectedRef, helpers]);

  const open = resolved !== null;
  const onClose = clear;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (deepReadOpenRef.current) return; // L2 遮罩开着 → Esc 归 L2，不关抽屉
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
  }, [selectedRef, onClose, open]);

  if (!resolved || !selectedRef) {
    return null;
  }

  // ── 头部 chrome（按 kind 派生）+ 正文（按 kind 路由）──────────────────
  const palette = resolved.kind === 'institution' ? CATEGORY_COLORS[resolved.institution.category] : null;
  const headerBg = palette
    ? `linear-gradient(160deg, ${palette.bg}, rgba(255,255,255,0.88))`
    : 'linear-gradient(160deg, var(--vermillion-wash), rgba(255,255,255,0.9))';
  const titleColor = palette ? palette.text : 'var(--ink-strong)';

  let eyebrow: ReactNode = null;
  let title = '';
  let subtitle = '';
  let links: string[] = [];
  let body: ReactNode = null;

  if (resolved.kind === 'institution') {
    const inst = resolved.institution;
    eyebrow = (
      <>
        <span
          className="inline-flex -rotate-3 items-center justify-center rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.24em]"
          style={{ background: palette!.badgeBg, color: palette!.badgeText }}
        >
          {CATEGORY_LABELS[inst.category]}
        </span>
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--ink-subtle)]">{inst.established}</span>
      </>
    );
    title = inst.name;
    subtitle = inst.summary;
    links = inst.links ?? [];
    body = (
      <Tabs key={inst.id} defaultValue="function" className="h-full">
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
            <FunctionTab institution={inst} />
          </TabsContent>
          <TabsContent value="relations" className="m-0">
            <RelationsTab institutionId={inst.id} />
          </TabsContent>
          <TabsContent value="timeline" className="m-0">
            <TimelineTab institutionId={inst.id} />
          </TabsContent>
          <TabsContent value="figures" className="m-0">
            <FiguresTab institutionId={inst.id} />
          </TabsContent>
        </div>
      </Tabs>
    );
  } else if (resolved.kind === 'figure') {
    const fig = resolved.figure;
    eyebrow = (
      <>
        <span className="text-sm font-medium text-[var(--ink-muted)]">{fig.title}</span>
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--ink-subtle)]">{fig.period}</span>
      </>
    );
    title = fig.name;
    subtitle = fig.evaluation;
    links = fig.links ?? [];
    body = <FigureDetail figure={fig} />;
  } else if (resolved.kind === 'event') {
    const ev = resolved.event;
    eyebrow = (
      <span className="text-xs uppercase tracking-[0.22em] text-[var(--ink-subtle)]">
        {ev.year < 0 ? `公元前 ${-ev.year}` : `${ev.year} 年`}
      </span>
    );
    title = ev.name;
    subtitle = ev.summary;
    links = ev.links ?? [];
    body = <EventDetail event={ev} />;
  } else {
    const concept = resolved.concept;
    eyebrow = (
      <span className="text-xs uppercase tracking-[0.22em] text-[var(--ink-subtle)]">概念</span>
    );
    title = concept.name;
    subtitle = concept.summary;
    links = concept.links ?? [];
    body = <ConceptDetail concept={concept} />;
  }

  const canDeepRead = hasDeepRead(dynastyId, selectedRef);

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
            key={selectedRef}
            ref={drawerRef}
            tabIndex={-1}
            initial={reduceMotion ? false : { x: '100%', opacity: 0.45 }}
            animate={reduceMotion ? undefined : { x: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { x: '100%', opacity: 0.45 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[min(480px,92vw)] flex-col border-l border-black/8 bg-[var(--paper)] shadow-[-16px_0_48px_rgba(68,50,31,0.14)] outline-none"
          >
            <div className="border-b border-black/8 px-6 py-5" style={{ background: headerBg }}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">{eyebrow}</div>
                  <div>
                    <h2 className="font-heading text-3xl tracking-[0.22em]" style={{ color: titleColor }}>
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{subtitle}</p>
                    {canDeepRead ? (
                      <button
                        type="button"
                        onClick={() => openDeepRead(selectedRef)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[0.03]"
                        style={{ color: 'var(--accent)' }}
                      >
                        深读 L2 ↗
                      </button>
                    ) : null}
                    <AtomLinks label="关联" refs={links} />
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

            <div
              className={`min-h-0 flex-1 px-4 pb-4 pt-4${
                resolved.kind === 'institution' ? '' : ' overflow-y-auto'
              }`}
            >
              {body}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
