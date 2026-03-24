// 机构类别
export type InstitutionCategory =
  | 'central'
  | 'administrative'
  | 'supervisory'
  | 'military'
  | 'secret';

// 关系类型
export type RelationType =
  | 'command'
  | 'supervise'
  | 'check'
  | 'cooperate'
  | 'direct';

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

// 关系
export interface Relation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  label: string;
  description: string;
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

// 数据文件结构
export interface InstitutionsData {
  institutions: Institution[];
}

export interface RelationsData {
  relations: Relation[];
}

export interface TimelinesData {
  timelines: Record<string, TimelineEvent[]>;
}

export interface FiguresData {
  figures: Record<string, Figure[]>;
}

export type SectionLayout = 'featured' | 'split' | 'grid' | 'trio';

export type RelationDiagramVariant =
  | 'cabinet-silijian'
  | 'three-judicial-offices'
  | 'military-balance'
  | 'secret-surveillance';

export interface NarrativeSection {
  id: string;
  title: string;
  navLabel: string;
  subtitle: string;
  prologue: string;
  layout: SectionLayout;
  institutionIds: string[];
  intraRelationIds: string[];
  interRelationIds: string[];
  diagramVariant?: RelationDiagramVariant;
}
