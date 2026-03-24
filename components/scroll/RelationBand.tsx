'use client';

import { motion } from 'framer-motion';
import type { Relation } from '@/lib/types';
import { RELATION_STYLES } from '@/lib/constants';
import { getInstitutionById } from '@/lib/dataHelpers';

interface RelationBandProps {
  relations: Relation[];
}

export default function RelationBand({ relations }: RelationBandProps) {
  if (relations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      className="mt-12 rounded-[28px] border border-black/8 bg-[rgba(255,255,255,0.45)] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
    >
      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-[var(--ink-subtle)]">
        <span className="h-px w-10 bg-[rgba(44,44,44,0.18)]" />
        层间关系带
      </div>
      <div className="flex flex-wrap gap-3">
        {relations.map((relation, index) => {
          const source = getInstitutionById(relation.source);
          const target = getInstitutionById(relation.target);
          const style = RELATION_STYLES[relation.type];

          return (
            <motion.div
              key={relation.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm"
              style={{ borderColor: `${style.stroke}33`, background: style.soft, color: style.stroke }}
            >
              <span className="font-medium">{source?.shortName ?? relation.source}</span>
              <span className="text-base leading-none">{style.bidirectional ? '⇄' : '→'}</span>
              <span className="tracking-wide">{relation.label}</span>
              <span className="text-base leading-none">{style.bidirectional ? '⇄' : '→'}</span>
              <span className="font-medium">{target?.shortName ?? relation.target}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
