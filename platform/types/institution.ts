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
export interface Institution {
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

// 人物
export interface Figure {
  id: string;
  name: string;
  title: string;
  period: string;
  evaluation: string;
  story: string;
  tags: string[];
}
