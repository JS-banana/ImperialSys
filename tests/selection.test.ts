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

// ─── 深链接读取（P5：?atom=type:id，全类型；旧 ?institution= 已废）────────
describe('readDeepLinkRef', () => {
  it('?atom=institution:emperor → institution:emperor', () => {
    expect(readDeepLinkRef('?atom=institution:emperor')).toBe('institution:emperor');
  });

  it('全类型可读（figure/event/concept）', () => {
    expect(readDeepLinkRef('?atom=figure:yu_qian')).toBe('figure:yu_qian');
    expect(readDeepLinkRef('?atom=event:tumu_crisis')).toBe('event:tumu_crisis');
    expect(readDeepLinkRef('?atom=concept:piaoni-pihong')).toBe('concept:piaoni-pihong');
  });

  it('无 atom / 旧 ?institution= / 非法格式 → null', () => {
    expect(readDeepLinkRef('')).toBeNull();
    expect(readDeepLinkRef('?foo=bar')).toBeNull();
    expect(readDeepLinkRef('?institution=emperor')).toBeNull(); // 旧参数已一次性切换废弃
    expect(readDeepLinkRef('?atom=garbage')).toBeNull(); // 无 type 前缀
    expect(readDeepLinkRef('?atom=bogus:x')).toBeNull(); // 非法 type
  });
});

// ─── 选中态写回 URL search（纯，全类型 ?atom=type:id 字面冒号）──────────
describe('applySelectionToSearch', () => {
  it('选中任意原子 → 写 ?atom=type:id（字面冒号，不百分号编码）', () => {
    expect(applySelectionToSearch('', 'institution:emperor')).toBe('?atom=institution:emperor');
    expect(applySelectionToSearch('', 'figure:yu_qian')).toBe('?atom=figure:yu_qian');
    expect(applySelectionToSearch('', 'event:tumu_crisis')).toBe('?atom=event:tumu_crisis');
  });

  it('清空 → 删除 atom 参数', () => {
    expect(applySelectionToSearch('?atom=institution:emperor', null)).toBe('');
  });

  it('保留其他查询参数', () => {
    expect(applySelectionToSearch('?tab=x', 'institution:cabinet')).toBe('?tab=x&atom=institution:cabinet');
    expect(applySelectionToSearch('?atom=institution:old&tab=x', null)).toBe('?tab=x');
  });

  it('round-trip：write→read 还原同一 ref（全类型）', () => {
    const refs = ['institution:cabinet', 'figure:yu_qian', 'event:tumu_crisis', 'concept:piaoni-pihong'] as const;
    for (const ref of refs) {
      expect(readDeepLinkRef(applySelectionToSearch('', ref))).toBe(ref);
    }
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
