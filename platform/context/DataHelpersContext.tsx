'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createDataHelpers, type DataSource, type DataHelpers } from '../utils/dataHelpers';

const DataHelpersContext = createContext<DataHelpers | null>(null);

interface DataHelpersProviderProps {
  data: DataSource;
  children: ReactNode;
}

/**
 * 提供朝代数据查询工具的 Context Provider
 * 由 DynastyShell 创建，子组件通过 useDataHelpers() 使用
 */
export function DataHelpersProvider({ data, children }: DataHelpersProviderProps) {
  const helpers = useMemo(() => createDataHelpers(data), [data]);
  return (
    <DataHelpersContext.Provider value={helpers}>
      {children}
    </DataHelpersContext.Provider>
  );
}

/**
 * 获取当前朝代的数据查询工具
 * 必须在 DataHelpersProvider 内使用
 */
export function useDataHelpers(): DataHelpers {
  const ctx = useContext(DataHelpersContext);
  if (!ctx) {
    throw new Error('useDataHelpers must be used within a DataHelpersProvider');
  }
  return ctx;
}
