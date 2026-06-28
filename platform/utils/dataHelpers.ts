import type { Institution, TimelineEvent, Figure, EventAtom } from '../types/institution';
import type { Relation } from '../types/relation';
import type { SectionConfig } from '../types/dynasty';

// ─── 数据源接口 ─────────────────────────────────────────────────────

export interface DataSource {
  institutions: Institution[];
  relations: Relation[];
  timelines: Record<string, TimelineEvent[]>;
  figures: Figure[];
  events: EventAtom[];
}

// ─── 创建数据查询工具（工厂模式，支持任意数据源）────────────────

export function createDataHelpers(source: DataSource) {
  const institutionMap = new Map(
    source.institutions.map((inst) => [inst.id, inst])
  );

  const relationBySource = new Map<string, Relation[]>();
  const relationByTarget = new Map<string, Relation[]>();

  for (const rel of source.relations) {
    if (!relationBySource.has(rel.source)) {
      relationBySource.set(rel.source, []);
    }
    relationBySource.get(rel.source)!.push(rel);

    if (!relationByTarget.has(rel.target)) {
      relationByTarget.set(rel.target, []);
    }
    relationByTarget.get(rel.target)!.push(rel);
  }

  return {
    getInstitutions(): Institution[] {
      return source.institutions;
    },

    getRelations(): Relation[] {
      return source.relations;
    },

    getInstitutionById(id: string): Institution | undefined {
      return institutionMap.get(id);
    },

    getInstitutionsByIds(ids: string[]): Institution[] {
      return ids
        .map((id) => institutionMap.get(id))
        .filter((inst): inst is Institution => Boolean(inst));
    },

    getRelationsByIds(ids: string[]): Relation[] {
      const idSet = new Set(ids);
      return source.relations.filter((rel) => idSet.has(rel.id));
    },

    getInstitutionsBySection(section: SectionConfig): Institution[] {
      return this.getInstitutionsByIds(section.institutionIds);
    },

    getSectionForInstitution(
      institutionId: string,
      sections: SectionConfig[]
    ): SectionConfig | undefined {
      return sections.find((s) => s.institutionIds.includes(institutionId));
    },

    getInstitutionRelations(institutionId: string): {
      incoming: Relation[];
      outgoing: Relation[];
    } {
      return {
        incoming: relationByTarget.get(institutionId) ?? [],
        outgoing: relationBySource.get(institutionId) ?? [],
      };
    },

    getSectionRelations(section: SectionConfig): {
      intraRelations: Relation[];
      interRelations: Relation[];
    } {
      const intraIds = new Set(section.relationIds ?? []);
      return {
        intraRelations: source.relations.filter((r) => intraIds.has(r.id)),
        interRelations: [], // 由调用方根据具体需求计算
      };
    },

    getTimelines(institutionId: string): TimelineEvent[] {
      return source.timelines[institutionId] ?? [];
    },

    getFigures(institutionId: string): Figure[] {
      // 扁平原子按 institutionIds 多对多过滤派生（签名不变；同一人物可属多机构）
      return source.figures.filter((figure) => figure.institutionIds.includes(institutionId));
    },

    getEvents(): EventAtom[] {
      return source.events;
    },

    getEventById(id: string): EventAtom | undefined {
      return source.events.find((event) => event.id === id);
    },

    getEventsByInstitution(institutionId: string): EventAtom[] {
      return source.events.filter((event) => event.institutionIds.includes(institutionId));
    },

    getDataSource(): DataSource {
      return source;
    },
  };
}

// ─── 便捷类型 ──────────────────────────────────────────────────────

export type DataHelpers = ReturnType<typeof createDataHelpers>;
