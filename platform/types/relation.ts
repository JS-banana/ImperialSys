import type { DepthContract } from './atom';

// 关系类型
export type RelationType =
  | 'command'
  | 'supervise'
  | 'check'
  | 'cooperate'
  | 'direct';

// 关系
export interface Relation extends DepthContract {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  label: string;
  description: string;
}
