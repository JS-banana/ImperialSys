import type { DepthContract } from './atom';

// 机构类别
export type InstitutionCategory =
  | 'central'
  | 'administrative'
  | 'supervisory'
  | 'military'
  | 'secret';

// 机构内部组织
export interface InternalOrg {
  name: string;
  desc: string;
}

// 职能条目
export interface FunctionItem {
  icon: string;
  title: string;
  description: string;
}

// 机构详情
export interface InstitutionDetail {
  functions: FunctionItem[];
  structure: string;
  internalOrgs: InternalOrg[];
}

// 机构
export interface Institution extends DepthContract {
  id: string;
  name: string;
  shortName: string;
  category: InstitutionCategory;
  level: number;
  summary: string;
  established: string;
  detail: InstitutionDetail;
  position: { x: number; y: number };
}

// 时间线事件
export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

// 人物（一等原子：扁平数组 + institutionIds 多对多）
export interface Figure extends DepthContract {
  id: string;
  name: string;
  title: string;
  period: string;
  evaluation: string;
  story: string;
  tags: string[];
  institutionIds: string[];
}

// 事件（一等原子：跨切面大事件，数字 year 便排序；timelines 叙事节拍另存、不并入）
export interface EventAtom extends DepthContract {
  id: string;
  name: string;
  year: number;
  summary: string;
  institutionIds: string[];
  tags: string[];
}

// 概念（一等原子：贯穿制度的抽象概念，如制衡 / 票拟批红 / 三法司会审 / 军政分离）
export interface ConceptAtom extends DepthContract {
  id: string;
  name: string;
  summary: string;
  institutionIds: string[];
}
