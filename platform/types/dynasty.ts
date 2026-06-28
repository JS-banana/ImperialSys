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

// ─── 分区组件 Props（纯可序列化数据；选中态由 SelectionContext 承接）──
// 不含回调：分区在 Server 端组合，函数 prop 无法跨 Server→Client 边界传递。
// 卡片/抽屉通过 useSelection 读写选中态。

export interface SectionProps {
  institutions: Institution[];
  relations: Relation[];
}

// ─── 分区定义（含组件引用，仅 Client 端使用）─────────────────────

export interface SectionDefinition extends SectionConfig {
  component: ComponentType<SectionProps>;
}

// ─── 朝代密度站位（在共享间距阶梯上选档，非另起阶梯）──────────────
export type DynastyDensity = 'compact' | 'default' | 'airy';

// ─── 朝代主题（表达令牌 + 站位，纯数据可序列化）──────────────────
// 见 ADR-0007（令牌分层）+ 设计系统 §6.0 语义槽位契约：
// 只携带「表达令牌（色/字/纹样/氛围）+ 站位选择」；结构令牌（间距/圆角/阴影级数/
// 字阶比例/动效）住平台、不进 theme。Zod 强制必填，构建期硬门。
export interface DynastyTheme {
  /** 宣纸底三阶 */
  surface: { paper: string; bright: string; dark: string };
  /** 墨三阶 */
  ink: { strong: string; muted: string; subtle: string };
  /** 招牌主色 + 低透染 */
  accent: string;
  accentWash: string;
  /** 辅强调（点睛，克制少用）*/
  accentAlt: string;
  /** 金点缀 */
  gold: string;
  /** 描边墨（细发丝线）*/
  line: string;
  /** body 氛围渐变（完整 background-image 值）*/
  bgGradient: string;
  /** 字体角色（朝代各自把字体家族映射到这些角色）*/
  fonts: {
    display: string;
    heading: string;
    body: string;
    reading: string;
    caption: string;
  };
  /** 纹样/质感（语义 id，P6/P8 消费）*/
  decorative: { pattern: string; particle: string };
  /** 站位：密度档（×0.85/×1.0/×1.15，P6 作用于结构阶梯）*/
  density: DynastyDensity;
  /** 站位：阴影暖度 tint */
  shadowTint: string;
  /** 站位：描边墨色基（本朝 ink 派生 line）*/
  lineInk: string;
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
