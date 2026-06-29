'use client';

import { Suspense, useEffect, useRef, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSelection } from '@/platform/context/SelectionContext';
import { getDeepReadComponent } from '@/platform/content/deep-read-map';

// 模块层稳定组件：渲染传入的 lazy 组件 prop。把动态选定的组件作为 prop 渲染，
// react-compiler 视为常规多态组件渲染，不报「render 期创建组件」。
function MdxSlot({ Component }: { Component: ComponentType }) {
  return <Component />;
}

/**
 * L2 全屏深读遮罩（两层解耦）：读 SelectionContext.deepReadRef（瞬时态，不进 URL），
 * 按 dynastyId + AtomRef 经显式 map 懒载该原子的 MDX 长文，每原子一 chunk 按需拉。
 * 层叠在 L1 抽屉之上（z 高于抽屉）；关闭只收 L2，L1 选中态保留。
 */
export default function DeepReadOverlay({ dynastyId }: { dynastyId: string }) {
  const { deepReadRef, closeDeepRead } = useSelection();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 经显式 map 取该原子在模块层建好的 lazy 组件（稳定 identity，每原子独立 chunk）。
  const LazyContent = deepReadRef ? getDeepReadComponent(dynastyId, deepReadRef) ?? null : null;
  const open = LazyContent !== null;

  useEffect(() => {
    if (!open) return undefined;
    // 记下触发深读的元素（抽屉「深读 L2 ↗」按钮），关闭时复原焦点——免键盘/读屏用户丢上下文。
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation(); // 抢在抽屉 Esc 之前——只收 L2，不连带关 L1
        closeDeepRead();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus(); // 复原焦点到触发按钮
    };
  }, [open, closeDeepRead]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="deep-read"
          className="fixed inset-0 z-[60] overflow-y-auto bg-[var(--paper)]"
          style={{ backgroundImage: 'var(--bg-gradient)' }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/8 bg-[var(--paper)] px-6 py-3">
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--ink-subtle)]">深读 · L2</span>
            <button
              type="button"
              onClick={closeDeepRead}
              aria-label="关闭深读"
              className="inline-flex size-10 items-center justify-center rounded-full border border-black/10 text-[var(--ink-subtle)] transition-colors hover:text-[var(--ink-strong)]"
            >
              <X className="size-4" />
            </button>
          </div>
          <article ref={panelRef} tabIndex={-1} className="mx-auto max-w-2xl px-6 py-10 outline-none">
            <Suspense fallback={<p className="text-[var(--ink-subtle)]">深读载入中…</p>}>
              {LazyContent ? <MdxSlot Component={LazyContent} /> : null}
            </Suspense>
          </article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
