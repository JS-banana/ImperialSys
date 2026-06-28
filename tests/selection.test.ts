import { describe, expect, it } from 'vitest';
import {
  makeAtomRef,
  parseAtomRef,
  readDeepLinkRef,
  applySelectionToSearch,
  resolveSelectedRef,
} from '../platform/context/selection';

// ─── AtomRef 词表（P5 内容原子系统复用）─────────────────────────────
describe('AtomRef 词表', () => {
  it('makeAtomRef 拼出 "<type>:<id>"', () => {
    expect(makeAtomRef('institution', 'emperor')).toBe('institution:emperor');
    expect(makeAtomRef('concept', 'piaoni-pihong')).toBe('concept:piaoni-pihong');
  });

  it('parseAtomRef 还原 type/id', () => {
    expect(parseAtomRef('institution:emperor')).toEqual({ type: 'institution', id: 'emperor' });
    expect(parseAtomRef('figure:yu-qian')).toEqual({ type: 'figure', id: 'yu-qian' });
  });

  it('parseAtomRef 容忍 id 内含冒号（只切首个分隔符）', () => {
    expect(parseAtomRef('event:1449:tumu' as never)).toEqual({ type: 'event', id: '1449:tumu' });
  });

  it('make→parse 往返一致', () => {
    const ref = makeAtomRef('institution', 'silijian');
    expect(parseAtomRef(ref)).toEqual({ type: 'institution', id: 'silijian' });
  });
});

// ─── 深链接读取（P3 仍用 ?institution=；P5 升级 ?atom=type:id）─────────
describe('readDeepLinkRef', () => {
  it('?institution=emperor → institution:emperor', () => {
    expect(readDeepLinkRef('?institution=emperor')).toBe('institution:emperor');
  });

  it('无 institution 参数 → null', () => {
    expect(readDeepLinkRef('')).toBeNull();
    expect(readDeepLinkRef('?foo=bar')).toBeNull();
  });
});

// ─── 选中态写回 URL search（纯）──────────────────────────────────────
describe('applySelectionToSearch', () => {
  it('选中机构 → 写 ?institution=<id>', () => {
    expect(applySelectionToSearch('', 'institution:emperor')).toBe('?institution=emperor');
  });

  it('清空 → 删除 institution 参数', () => {
    expect(applySelectionToSearch('?institution=emperor', null)).toBe('');
  });

  it('保留其他查询参数', () => {
    expect(applySelectionToSearch('?tab=x', 'institution:cabinet')).toBe('?tab=x&institution=cabinet');
    expect(applySelectionToSearch('?institution=old&tab=x', null)).toBe('?tab=x');
  });

  it('非 institution 类型暂不写 URL（P3 仅 institution 有 URL 映射）', () => {
    expect(applySelectionToSearch('', 'figure:yu-qian')).toBe('');
  });
});

// ─── 三态解析：undefined=未操作（用深链接）/ null=已关闭 / ref=已选 ─────
describe('resolveSelectedRef', () => {
  it('undefined → 沿用深链接初值', () => {
    expect(resolveSelectedRef(undefined, 'institution:emperor')).toBe('institution:emperor');
    expect(resolveSelectedRef(undefined, null)).toBeNull();
  });

  it('null（用户已关闭）→ null，即便深链接非空', () => {
    expect(resolveSelectedRef(null, 'institution:emperor')).toBeNull();
  });

  it('已选 ref → 该 ref', () => {
    expect(resolveSelectedRef('institution:cabinet', 'institution:emperor')).toBe('institution:cabinet');
  });
});
