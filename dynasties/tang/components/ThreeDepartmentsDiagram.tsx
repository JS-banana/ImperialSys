'use client';

import { motion } from 'framer-motion';

/**
 * 唐朝三省制衡关系图
 * 展示中书省（出令）→ 门下省（封驳）→ 尚书省（执行）的三角制衡关系
 */
export default function ThreeDepartmentsDiagram() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-[rgba(255,255,255,0.5)] px-6 py-6 shadow-[0_16px_40px_rgba(68,50,31,0.06)]">
      <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--ink-subtle)]">
        三省制衡图解
      </div>

      <svg viewBox="0 0 500 320" className="w-full max-w-lg mx-auto">
        <defs>
          <marker id="tang-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          </marker>
        </defs>

        {/* 中书省 - 左上 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <rect x="40" y="30" width="140" height="70" rx="16" fill="#FAF3E0" stroke="#D4AF37" strokeWidth="2" />
          <text x="110" y="58" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#5C4A1E">中书省</text>
          <text x="110" y="78" textAnchor="middle" fontSize="11" fill="#8B7355">出令 · 起草诏令</text>
        </motion.g>

        {/* 门下省 - 右上 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <rect x="320" y="30" width="140" height="70" rx="16" fill="#FAF3E0" stroke="#D4AF37" strokeWidth="2" />
          <text x="390" y="58" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#5C4A1E">门下省</text>
          <text x="390" y="78" textAnchor="middle" fontSize="11" fill="#8B7355">封驳 · 审核诏令</text>
        </motion.g>

        {/* 尚书省 - 底部 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <rect x="180" y="220" width="140" height="70" rx="16" fill="#FAF3E0" stroke="#D4AF37" strokeWidth="2" />
          <text x="250" y="248" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#5C4A1E">尚书省</text>
          <text x="250" y="268" textAnchor="middle" fontSize="11" fill="#8B7355">执行 · 统领六部</text>
        </motion.g>

        {/* 中书 → 门下：出令 */}
        <motion.path
          d="M180,65 L320,65"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          markerEnd="url(#tang-arrow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
        <text x="250" y="55" textAnchor="middle" fontSize="10" fill="#D4AF37">出令</text>

        {/* 门下 → 尚书：执行 */}
        <motion.path
          d="M390,100 L320,220"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          markerEnd="url(#tang-arrow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
        <text x="380" y="160" textAnchor="middle" fontSize="10" fill="#D4AF37">执行</text>

        {/* 尚书 → 中书：反馈 */}
        <motion.path
          d="M180,220 L110,100"
          fill="none"
          stroke="#8B7355"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          markerEnd="url(#tang-arrow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
        <text x="120" y="165" textAnchor="middle" fontSize="10" fill="#8B7355">反馈</text>

        {/* 门下 → 中书：封驳（退回） */}
        <motion.path
          d="M320,85 L180,85"
          fill="none"
          stroke="#C0392B"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#tang-arrow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.6 }}
        />
        <text x="250" y="100" textAnchor="middle" fontSize="10" fill="#C0392B">封驳</text>

        {/* 政事堂标注 */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <circle cx="250" cy="140" r="28" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 3" />
          <text x="250" y="137" textAnchor="middle" fontSize="10" fill="#D4AF37">政事堂</text>
          <text x="250" y="150" textAnchor="middle" fontSize="9" fill="#8B7355">共议</text>
        </motion.g>
      </svg>
    </div>
  );
}
