import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

// 受控外链（ADR-0006：靠后、小号脚注式、新标签）——MDX 里唯一的站外出口。
// 颜色读 [data-dynasty] 作用域 CSS 令牌，随朝代变。
function ExternalRefLink({ kind, label, url }: { kind: string; label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs underline decoration-dotted underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
      style={{ color: 'var(--ink-subtle)' }}
    >
      {kind} ↗ {label}
    </a>
  );
}

function Source({ label, url }: { label: string; url: string }) {
  return <ExternalRefLink kind="史料原文" label={label} url={url} />;
}

function FurtherReading({ label, url }: { label: string; url: string }) {
  return <ExternalRefLink kind="延伸阅读" label={label} url={url} />;
}

const components: MDXComponents = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-8 mb-3 text-xl font-semibold" style={{ color: 'var(--ink-strong)' }}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-6 mb-2 text-lg font-medium" style={{ color: 'var(--ink-strong)' }}>
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-4 leading-8" style={{ color: 'var(--ink-muted)' }}>
      {children}
    </p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-4 list-disc space-y-2 pl-6" style={{ color: 'var(--ink-muted)' }}>
      {children}
    </ul>
  ),
  Source,
  FurtherReading,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
