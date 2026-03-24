'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CATEGORY_COLORS, RELATION_STYLES } from '@/lib/constants';
import type { RelationDiagramVariant } from '@/lib/types';

interface RelationDiagramProps {
  variant: RelationDiagramVariant;
}

interface DiagramNodeProps {
  label: string;
  x: number;
  y: number;
  tone: keyof typeof CATEGORY_COLORS;
  width?: number;
  external?: boolean;
}

function DiagramNode({ label, x, y, tone, width = 96, external = false }: DiagramNodeProps) {
  const palette = CATEGORY_COLORS[tone];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height="44"
        rx="16"
        fill={external ? 'rgba(255,255,255,0.56)' : palette.bg}
        stroke={palette.border}
        strokeWidth="1.5"
        strokeDasharray={external ? '6 5' : undefined}
      />
      <text
        x={width / 2}
        y="27"
        textAnchor="middle"
        fontSize="15"
        fontFamily="var(--font-heading)"
        fill={palette.text}
        letterSpacing="0.12em"
      >
        {label}
      </text>
    </g>
  );
}

function AnimatedPath({
  d,
  color,
  dash,
  markerEnd,
}: {
  d: string;
  color: string;
  dash?: string;
  markerEnd?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeDasharray={dash}
      markerEnd={markerEnd}
      initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
      whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}

function DiagramFrame({
  title,
  description,
  viewBox,
  children,
}: {
  title: string;
  description: string;
  viewBox: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-black/8 bg-[rgba(255,255,255,0.55)] p-5 shadow-[0_18px_36px_rgba(68,50,31,0.06)]">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-[var(--ink-subtle)]">关系图解</div>
          <h4 className="mt-2 font-heading text-xl tracking-[0.16em] text-[var(--ink-strong)]">{title}</h4>
        </div>
        <p className="max-w-md text-sm leading-6 text-[var(--ink-muted)]">{description}</p>
      </div>
      <svg viewBox={viewBox} className="w-full overflow-visible">
        <defs>
          <marker id="diagram-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#7E3F2F" />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

export default function RelationDiagram({ variant }: RelationDiagramProps) {
  if (variant === 'cabinet-silijian') {
    return (
      <DiagramFrame
        title="票拟与批红"
        description="内阁提出处理意见，司礼监代皇帝批红。外朝无批红权，内廷无票拟权，因此彼此协作又相互钳制。"
        viewBox="0 0 520 170"
      >
        <DiagramNode label="内阁" x={60} y={70} tone="central" width={110} />
        <DiagramNode label="司礼监" x={350} y={70} tone="central" width={110} />
        <AnimatedPath
          d="M170 92 C220 40, 300 40, 350 92"
          color={RELATION_STYLES.check.stroke}
          dash={RELATION_STYLES.check.strokeDasharray}
        />
        <AnimatedPath
          d="M350 118 C300 150, 220 150, 170 118"
          color={RELATION_STYLES.check.stroke}
          dash={RELATION_STYLES.check.strokeDasharray}
        />
        <text x="260" y="64" textAnchor="middle" fontSize="13" fill="#C0392B" letterSpacing="0.16em">
          票拟
        </text>
        <text x="260" y="140" textAnchor="middle" fontSize="13" fill="#C0392B" letterSpacing="0.16em">
          批红
        </text>
      </DiagramFrame>
    );
  }

  if (variant === 'three-judicial-offices') {
    return (
      <DiagramFrame
        title="三法司会审与奏章流转"
        description="都察院、大理寺与刑部围成司法会审环路；通政司则控制奏章入口，将外朝信息导入内阁。"
        viewBox="0 0 620 250"
      >
        <DiagramNode label="刑部" x={195} y={28} tone="administrative" width={100} external />
        <DiagramNode label="都察院" x={84} y={154} tone="supervisory" width={112} />
        <DiagramNode label="大理寺" x={305} y={154} tone="supervisory" width={112} />
        <DiagramNode label="通政司" x={462} y={96} tone="supervisory" width={108} />
        <DiagramNode label="内阁" x={478} y={18} tone="central" width={88} external />
        <AnimatedPath d="M245 72 L160 154" color={RELATION_STYLES.cooperate.stroke} />
        <AnimatedPath d="M295 72 L360 154" color={RELATION_STYLES.cooperate.stroke} />
        <AnimatedPath d="M196 176 L305 176" color={RELATION_STYLES.cooperate.stroke} />
        <AnimatedPath d="M516 96 L522 62" color={RELATION_STYLES.cooperate.stroke} markerEnd="url(#diagram-arrow)" />
        <text x="250" y="104" textAnchor="middle" fontSize="13" fill="#2B6CB0" letterSpacing="0.14em">
          三司会审
        </text>
        <text x="525" y="86" textAnchor="middle" fontSize="12" fill="#8B4D8B" letterSpacing="0.14em">
          奏章上达
        </text>
      </DiagramFrame>
    );
  }

  if (variant === 'military-balance') {
    return (
      <DiagramFrame
        title="军政与军令的双钥匙"
        description="兵部掌发兵与武官铨选，五军都督府掌统兵与卫所日常。两边都不具备完整军权，目的正是防止将帅专断。"
        viewBox="0 0 520 180"
      >
        <DiagramNode label="兵部" x={56} y={68} tone="administrative" width={120} external />
        <DiagramNode label="五军都督府" x={332} y={68} tone="military" width={132} />
        <AnimatedPath
          d="M176 90 C230 44, 296 44, 332 90"
          color={RELATION_STYLES.check.stroke}
          dash={RELATION_STYLES.check.strokeDasharray}
        />
        <AnimatedPath
          d="M332 114 C284 144, 222 144, 176 114"
          color={RELATION_STYLES.check.stroke}
          dash={RELATION_STYLES.check.strokeDasharray}
        />
        <text x="148" y="46" textAnchor="middle" fontSize="12" fill="#2B6CB0" letterSpacing="0.16em">
          军政
        </text>
        <text x="386" y="46" textAnchor="middle" fontSize="12" fill="#2E7D32" letterSpacing="0.16em">
          军令
        </text>
      </DiagramFrame>
    );
  }

  return (
    <DiagramFrame
      title="特务监控链路"
      description="司礼监提督东厂，东厂再反向钳制锦衣卫；而锦衣卫仍直接隶属皇帝，形成交叉重叠的控制网络。"
      viewBox="0 0 560 230"
    >
      <DiagramNode label="皇帝" x={222} y={18} tone="central" width={112} external />
      <DiagramNode label="司礼监" x={372} y={70} tone="central" width={110} external />
      <DiagramNode label="东厂" x={100} y={138} tone="secret" width={98} />
      <DiagramNode label="锦衣卫" x={312} y={138} tone="secret" width={110} />
      <AnimatedPath d="M278 62 L200 138" color={RELATION_STYLES.direct.stroke} dash={RELATION_STYLES.direct.strokeDasharray} markerEnd="url(#diagram-arrow)" />
      <AnimatedPath d="M424 114 L194 154" color={RELATION_STYLES.direct.stroke} dash={RELATION_STYLES.direct.strokeDasharray} markerEnd="url(#diagram-arrow)" />
      <AnimatedPath d="M198 160 L312 160" color={RELATION_STYLES.supervise.stroke} dash={RELATION_STYLES.supervise.strokeDasharray} markerEnd="url(#diagram-arrow)" />
      <text x="214" y="98" textAnchor="middle" fontSize="12" fill="#7E3F2F" letterSpacing="0.16em">
        直属
      </text>
      <text x="314" y="124" textAnchor="middle" fontSize="12" fill="#7E3F2F" letterSpacing="0.16em">
        提督
      </text>
      <text x="255" y="148" textAnchor="middle" fontSize="12" fill="#B85C38" letterSpacing="0.16em">
        监控制衡
      </text>
    </DiagramFrame>
  );
}
