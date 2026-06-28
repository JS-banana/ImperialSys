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
    syncUrl(null);
  }, [syncUrl]);

  const value = useMemo<SelectionContextValue>(
    () => ({ selectedRef, select, clear }),
    [selectedRef, select, clear],
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
