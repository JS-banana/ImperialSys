import type { RelationType, InstitutionCategory } from './types';

// 关系线样式映射
export const RELATION_STYLES: Record<
  RelationType,
  {
    stroke: string;
    soft: string;
    strokeDasharray?: string;
    animated: boolean;
    label: string;
    bidirectional: boolean;
  }
> = {
  command: {
    stroke: '#8A6637',
    soft: 'rgba(138, 102, 55, 0.12)',
    animated: false,
    label: '统辖',
    bidirectional: false,
  },
  supervise: {
    stroke: '#B85C38',
    soft: 'rgba(184, 92, 56, 0.12)',
    strokeDasharray: '9 5',
    animated: false,
    label: '监督',
    bidirectional: false,
  },
  check: {
    stroke: '#C0392B',
    soft: 'rgba(192, 57, 43, 0.12)',
    strokeDasharray: '6 4',
    animated: false,
    label: '制衡',
    bidirectional: true,
  },
  cooperate: {
    stroke: '#2B6CB0',
    soft: 'rgba(43, 108, 176, 0.12)',
    animated: false,
    label: '协作',
    bidirectional: true,
  },
  direct: {
    stroke: '#7E3F2F',
    soft: 'rgba(126, 63, 47, 0.12)',
    strokeDasharray: '10 5',
    animated: false,
    label: '直属',
    bidirectional: false,
  },
};

// 机构类别颜色
export const CATEGORY_COLORS: Record<
  InstitutionCategory,
  {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  }
> = {
  central: {
    bg: '#FAF3E0',
    border: '#B8860B',
    text: '#5C4A1E',
    badgeBg: '#B8860B',
    badgeText: '#FFF6D8',
    accent: '#D6A542',
  },
  administrative: {
    bg: '#EBF2FA',
    border: '#2B6CB0',
    text: '#1A3A5C',
    badgeBg: '#2B6CB0',
    badgeText: '#EEF6FF',
    accent: '#6D9FD6',
  },
  supervisory: {
    bg: '#F3EBF3',
    border: '#8B4D8B',
    text: '#4A2B4A',
    badgeBg: '#8B4D8B',
    badgeText: '#F9F1F9',
    accent: '#B07BB0',
  },
  military: {
    bg: '#E8F5E9',
    border: '#2E7D32',
    text: '#1B4D1E',
    badgeBg: '#2E7D32',
    badgeText: '#EFF9F0',
    accent: '#6BA56E',
  },
  secret: {
    bg: '#FBEAE5',
    border: '#8B2500',
    text: '#5C1A0D',
    badgeBg: '#8B2500',
    badgeText: '#FFF1EA',
    accent: '#B96541',
  },
};

// 关系线图例（用于 Legend 组件）
export const RELATION_LEGEND = [
  { type: 'command'   as RelationType, label: '统属/上下级', example: '皇帝 → 六部' },
  { type: 'direct'    as RelationType, label: '直属/密奏',   example: '皇帝 → 锦衣卫' },
  { type: 'supervise' as RelationType, label: '监督/弹劾',   example: '都察院 → 六部' },
  { type: 'check'     as RelationType, label: '制衡/牵制',   example: '内阁 ↔ 司礼监' },
  { type: 'cooperate' as RelationType, label: '协作/会审',   example: '三司会审' },
] as const;

// 机构类别图例
export const CATEGORY_LEGEND = [
  { category: 'central'        as InstitutionCategory, label: '中枢决策' },
  { category: 'administrative' as InstitutionCategory, label: '行政执行' },
  { category: 'supervisory'    as InstitutionCategory, label: '监察司法' },
  { category: 'military'       as InstitutionCategory, label: '军事系统' },
  { category: 'secret'         as InstitutionCategory, label: '特务系统' },
] as const;

export const CATEGORY_LABELS: Record<InstitutionCategory, string> = {
  central: '中枢',
  administrative: '六部',
  supervisory: '监察',
  military: '军事',
  secret: '特务',
};

export const SITE_CHROME = {
  paper: '#F5F0E8',
  paperDark: '#EDE5D8',
  ink: '#2C2C2C',
  inkLight: '#5C5C5C',
  vermilion: '#C0392B',
  gold: '#B8860B',
} as const;
