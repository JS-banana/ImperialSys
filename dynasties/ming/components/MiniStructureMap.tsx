'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Institution } from '@/platform/types';
import { CATEGORY_COLORS } from '@/platform/constants';

interface MiniStructureMapProps {
  institutions: Institution[];
  onNavigate: (institutionId: string) => void;
}

const mapPositions: Record<string, { x: number; y: number; width: number }> = {
  emperor: { x: 352, y: 28, width: 96 },
  cabinet: { x: 170, y: 112, width: 92 },
  silijian: { x: 446, y: 112, width: 104 },
  libu: { x: 34, y: 210, width: 74 },
  hubu: { x: 126, y: 210, width: 74 },
  libu2: { x: 218, y: 210, width: 74 },
  bingbu: { x: 310, y: 210, width: 74 },
  xingbu: { x: 402, y: 210, width: 74 },
  gongbu: { x: 494, y: 210, width: 74 },
  duchayuan: { x: 102, y: 310, width: 98 },
  dalisi: { x: 230, y: 310, width: 88 },
  tongzhengsi: { x: 342, y: 310, width: 96 },
  wujun: { x: 474, y: 310, width: 110 },
  jinyiwei: { x: 218, y: 388, width: 96 },
  dongchang: { x: 356, y: 388, width: 90 },
};

const lineDefs = [
  ['emperor', 'cabinet'],
  ['emperor', 'silijian'],
  ['emperor', 'wujun'],
  ['emperor', 'jinyiwei'],
  ['cabinet', 'libu'],
  ['cabinet', 'hubu'],
  ['cabinet', 'libu2'],
  ['cabinet', 'bingbu'],
  ['cabinet', 'xingbu'],
  ['cabinet', 'gongbu'],
  ['duchayuan', 'dalisi'],
  ['dalisi', 'xingbu'],
  ['silijian', 'dongchang'],
  ['dongchang', 'jinyiwei'],
  ['bingbu', 'wujun'],
] as const;

function StructureNode({
  institution,
  onNavigate,
}: {
  institution: Institution;
  onNavigate: (institutionId: string) => void;
}) {
  const position = mapPositions[institution.id];
  const palette = CATEGORY_COLORS[institution.category];

  return (
    <g transform={`translate(${position.x}, ${position.y})`} className="cursor-pointer" onClick={() => onNavigate(institution.id)}>
      <rect
        width={position.width}
        height="36"
        rx="14"
        fill={palette.bg}
        stroke={palette.border}
        strokeWidth="1.6"
      />
      <text
        x={position.width / 2}
        y="22"
        textAnchor="middle"
        fontSize="14"
        fill={palette.text}
        fontFamily="var(--font-heading)"
        letterSpacing="0.12em"
      >
        {institution.name}
      </text>
    </g>
  );
}

export default function MiniStructureMap({ institutions, onNavigate }: MiniStructureMapProps) {
  const reduceMotion = useReducedMotion();
  const institutionMap = new Map(institutions.map((institution) => [institution.id, institution]));
  const orderedInstitutions = Object.keys(mapPositions)
    .map((id) => institutionMap.get(id))
    .filter((inst): inst is Institution => Boolean(inst));

  return (
    <div className="overflow-hidden rounded-[34px] border border-black/8 bg-[rgba(255,255,255,0.58)] px-6 py-6 shadow-[0_24px_50px_rgba(68,50,31,0.08)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--ink-subtle)]">全局架构</div>
          <h3 className="mt-2 font-heading text-2xl tracking-[0.18em] text-[var(--ink-strong)]">中枢权力迷你地图</h3>
        </div>
        <p className="max-w-md text-sm leading-6 text-[var(--ink-muted)]">
          点击节点可直接跳转到对应叙事章节。这里保留关键结构关系，让你在进入细读之前先看到全貌。
        </p>
      </div>

      <svg viewBox="0 0 620 450" className="w-full">
        {lineDefs.map(([sourceId, targetId], index) => {
          const source = mapPositions[sourceId];
          const target = mapPositions[targetId];
          const stroke = sourceId === 'dongchang' ? '#B85C38' : '#6B5A47';
          const sourceX = source.x + source.width / 2;
          const sourceY = source.y + 36;
          const targetX = target.x + target.width / 2;
          const targetY = target.y;

          return (
            <motion.path
              key={`${sourceId}-${targetId}`}
              d={`M${sourceX} ${sourceY} C ${sourceX} ${(sourceY + targetY) / 2}, ${targetX} ${(sourceY + targetY) / 2}, ${targetX} ${targetY}`}
              fill="none"
              stroke={stroke}
              strokeWidth="1.4"
              strokeDasharray={sourceId === 'dongchang' ? '6 4' : undefined}
              // initial/animate 恒定（服务端可渲、SSR 与客户端首帧逐字节一致，杜绝水合不一致）；
              // 仅 transition 降级：reduced-motion 用 duration:0 瞬达终态（无可感运动、不停留隐藏态）。
              initial={{ pathLength: 0, opacity: 0.35 }}
              animate={{ pathLength: 1, opacity: 0.72 }}
              transition={reduceMotion ? { duration: 0 } : { delay: index * 0.04, duration: 0.5, ease: 'easeOut' }}
            />
          );
        })}

        {orderedInstitutions
          .filter((institution) => institutionMap.has(institution.id))
          .map((institution, index) => (
            <motion.g
              key={institution.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.2 + index * 0.035, duration: 0.35 }}
            >
              <StructureNode institution={institution} onNavigate={onNavigate} />
            </motion.g>
          ))}
      </svg>
    </div>
  );
}
