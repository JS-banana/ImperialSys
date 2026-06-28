// 让 TS 认得 `import X from './x.mdx'`：@next/mdx 编译期把 MDX 转成 React 组件。
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
