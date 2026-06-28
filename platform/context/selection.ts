// ─── 内容原子选择：纯词表 + URL/状态纯函数（无 React，可单测 / P5 复用）──
// AtomRef = "<type>:<id>"，统一指代任意可被选中的内容原子。
// P3 仅 institution 有生产者；event/figure/concept 为 P5 内容原子系统预留，类型先就位。

export type AtomType = 'institution' | 'event' | 'figure' | 'concept';
export type AtomRef = `${AtomType}:${string}`;

export function makeAtomRef(type: AtomType, id: string): AtomRef {
  return `${type}:${id}`;
}

export function parseAtomRef(ref: AtomRef): { type: AtomType; id: string } {
  const sep = ref.indexOf(':');
  return { type: ref.slice(0, sep) as AtomType, id: ref.slice(sep + 1) };
}

// 深链接读取：P3 仍用 ?institution=<id>（沿用 P1 契约）；P5 升级为 ?atom=type:id。
export function readDeepLinkRef(search: string): AtomRef | null {
  const institutionId = new URLSearchParams(search).get('institution');
  return institutionId ? makeAtomRef('institution', institutionId) : null;
}

// 选中态写回 URL search（纯）：P3 仅 institution 原子映射到 ?institution=；
// 其余类型暂不写 URL（待 P5）。保留其他查询参数。返回带前导 '?' 的串，空则 ''。
export function applySelectionToSearch(search: string, ref: AtomRef | null): string {
  const params = new URLSearchParams(search);
  params.delete('institution');
  if (ref) {
    const { type, id } = parseAtomRef(ref);
    if (type === 'institution') params.set('institution', id);
  }
  const next = params.toString();
  return next ? `?${next}` : '';
}

// 三态解析：undefined = 用户尚未操作（沿用深链接初值）；null = 用户已关闭；AtomRef = 用户已选。
export function resolveSelectedRef(
  userSelection: AtomRef | null | undefined,
  deepLinkRef: AtomRef | null,
): AtomRef | null {
  return userSelection === undefined ? deepLinkRef : userSelection;
}
