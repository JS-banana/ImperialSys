'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  type AtomRef,
  applySelectionToSearch,
  readDeepLinkRef,
  resolveSelectedRef,
} from './selection';

// useSyncExternalStore 的空订阅：深链接初值只读一次，不订阅 URL 变化。
const subscribeToNothing = () => () => {};

interface SelectionContextValue {
  /** 当前选中的内容原子（null = 无选中）*/
  selectedRef: AtomRef | null;
  /** 选中一个原子（写回 URL 深链接）*/
  select: (ref: AtomRef) => void;
  /** 清空选中（删除 URL 深链接）*/
  clear: () => void;
  /** 当前打开 L2 深读的原子（null = 未打开）。瞬时态，不进 URL——两层解耦 */
  deepReadRef: AtomRef | null;
  /** 打开某原子的 L2 全屏深读 */
  openDeepRead: (ref: AtomRef) => void;
  /** 关闭 L2 深读（L1 选中态保留）*/
  closeDeepRead: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

/**
 * 通用选择 Provider：承接任意内容原子的选中态（机构/事件/人物/概念）。
 * 深链接走 useSyncExternalStore（getServerSnapshot=null）——SSR/水合期返回 null，
 * 与静态 HTML 的关闭态一致；挂载后切到 URL 派生值，既无 set-state-in-effect，也无水合不一致。
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const deepLinkRef = useSyncExternalStore(
    subscribeToNothing,
    () => readDeepLinkRef(window.location.search),
    () => null,
  );

  const [userSelection, setUserSelection] = useState<AtomRef | null | undefined>(undefined);
  const selectedRef = resolveSelectedRef(userSelection, deepLinkRef);

  // L2 深读瞬时态：不进 URL（两层解耦），故与深链接派生的 selectedRef 分开管理。
  const [deepReadRef, setDeepReadRef] = useState<AtomRef | null>(null);

  const syncUrl = useCallback((ref: AtomRef | null) => {
    const url = new URL(window.location.href);
    url.search = applySelectionToSearch(url.search, ref);
    window.history.replaceState(null, '', url.toString());
  }, []);

  const select = useCallback(
    (ref: AtomRef) => {
      setUserSelection(ref);
      syncUrl(ref);
    },
    [syncUrl],
  );

  const clear = useCallback(() => {
    setUserSelection(null);
    setDeepReadRef(null); // 关 L1 顺带关其上的 L2
    syncUrl(null);
  }, [syncUrl]);

  const openDeepRead = useCallback((ref: AtomRef) => setDeepReadRef(ref), []);
  const closeDeepRead = useCallback(() => setDeepReadRef(null), []);

  const value = useMemo<SelectionContextValue>(
    () => ({ selectedRef, select, clear, deepReadRef, openDeepRead, closeDeepRead }),
    [selectedRef, select, clear, deepReadRef, openDeepRead, closeDeepRead],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return ctx;
}
