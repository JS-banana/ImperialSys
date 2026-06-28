import type { Institution, TimelineEvent, Figure } from './institution';
import type { Relation } from './relation';
import type { ComponentType } from 'react';

// ─── 分区布局 ──────────────────────────────────────────────────────

export type SectionLayout = 'featured' | 'split' | 'grid' | 'trio';

// ─── 分区配置（纯数据，可序列化，Server 端使用）───────────────────

export interface SectionConfig {
  id: string;
  title: string;
  subtitle: string;
  prologue: string;
  layout: SectionLayout;
  institutionIds: string[];
  relationIds?: string[];
}

// ─── 分区组件 Props ─────────────────────────────────────────────────

export interface SectionProps {
  institutions: Institution[];
  relations: Relation[];
  onSelectInstitution: (inst: Institution) => void;
}

// ─── 分区定义（含组件引用，仅 Client 端使用）─────────────────────

export interface SectionDefinition extends SectionConfig {
  component: ComponentType<SectionProps>;
}

// ─── 朝代主题（纯数据，可序列化）────────────────────────────────

export interface DynastyTheme {
  colors: {
    paper: string;
    ink: string;
    accent: string;
    accentAlt: string;
    gold: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  decorative?: {
    backgroundPattern?: string;
    particleEffect?: string;
  };
}

// ─── 朝代原始数据（不含 theme）───────────────────────────────────

export interface DynastyRawData {
  institutions: Institution[];
  relations: Relation[];
  timelines: Record<string, TimelineEvent[]>;
  figures: Record<string, Figure[]>;
}

// ─── 朝代数据包（Server -> Client 传递用，可序列化）────────────

export interface DynastyData extends DynastyRawData {
  theme: DynastyTheme;
}

// ─── 朝代元数据 ─────────────────────────────────────────────────────

export interface DynastyMeta {
  id: string;
  name: string;
  period: string;
  description: string;
}

// ─── 朝代完整模块（Client 端使用，含组件引用）───────────────────

export interface DynastyModule {
  meta: DynastyMeta;
  theme: DynastyTheme;
  sections: SectionDefinition[];
  rawData: DynastyRawData;
}

// ─── 朝代注册配置（用于 registry）────────────────────────────────

export interface DynastyConfig {
  id: string;
  name: string;
  period: string;
  description: string;
}
