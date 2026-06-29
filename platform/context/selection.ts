// ─── 内容原子选择：纯词表 + URL/状态纯函数（无 React，可单测 / P5 复用）──
// AtomRef = "<type>:<id>"，统一指代任意可被选中的内容原子。
// P5 ⑥：深链接统一为 ?atom=type:id（一次性切换，删旧 ?institution=），全类型可选中。

export type AtomType = 'institution' | 'event' | 'figure' | 'concept';
export type AtomRef = `${AtomType}:${string}`;

const ATOM_TYPES: readonly AtomType[] = ['institution', 'event', 'figure', 'concept'];

export function makeAtomRef(type: AtomType, id: string): AtomRef {
  return `${type}:${id}`;
}

export function parseAtomRef(ref: AtomRef): { type: AtomType; id: string } {
  const sep = ref.indexOf(':');
  return { type: ref.slice(0, sep) as AtomType, id: ref.slice(sep + 1) };
}

// 是否合法 AtomRef 串：有已知 type 前缀且 id 非空。守住深链接入口免吞垃圾。
function isAtomRef(value: string): value is AtomRef {
  const sep = value.indexOf(':');
  if (sep <= 0 || sep === value.length - 1) return false;
  return (ATOM_TYPES as readonly string[]).includes(value.slice(0, sep));
}

// 深链接读取：P5 ⑥ 统一 ?atom=type:id（全类型）。非法/旧参数一律 null。
export function readDeepLinkRef(search: string): AtomRef | null {
  const atom = new URLSearchParams(search).get('atom');
  return atom && isAtomRef(atom) ? atom : null;
}

// 选中态写回 URL search（纯）：P5 ⑥ 任意类型原子写 ?atom=type:id，删旧 ?institution=。
// 保留其他查询参数；冒号用字面量（URLSearchParams 默认把 ':' 编码成 %3A，这里还原成干净深链接）。
// 返回带前导 '?' 的串，空则 ''。
export function applySelectionToSearch(search: string, ref: AtomRef | null): string {
  const params = new URLSearchParams(search);
  params.delete('atom');
  if (ref) params.set('atom', ref);
  const next = params.toString().replace(/%3A/gi, ':');
  return next ? `?${next}` : '';
}

// 三态解析：undefined = 用户尚未操作（沿用深链接初值）；null = 用户已关闭；AtomRef = 用户已选。
export function resolveSelectedRef(
  userSelection: AtomRef | null | undefined,
  deepLinkRef: AtomRef | null,
): AtomRef | null {
  return userSelection === undefined ? deepLinkRef : userSelection;
}
