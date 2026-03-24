import institutionsData from '../data/institutions.json';
import relationsData from '../data/relations.json';
import { SECTION_CONFIG } from './sectionConfig';
import type {
  Institution,
  InstitutionsData,
  NarrativeSection,
  Relation,
  RelationsData,
} from './types';

const institutionList = (institutionsData as InstitutionsData).institutions;
const relationList = (relationsData as RelationsData).relations;

const institutionMap = new Map(institutionList.map((institution) => [institution.id, institution]));

export function getInstitutions(): Institution[] {
  return institutionList;
}

export function getRelations(): Relation[] {
  return relationList;
}

export function getInstitutionsByIds(ids: string[]): Institution[] {
  return ids
    .map((id) => institutionMap.get(id))
    .filter((institution): institution is Institution => Boolean(institution));
}

export function getRelationsByIds(ids: string[]): Relation[] {
  const idSet = new Set(ids);

  return relationList.filter((relation) => idSet.has(relation.id));
}

export function getInstitutionById(id: string): Institution | undefined {
  return institutionMap.get(id);
}

export function getInstitutionsBySection(section: NarrativeSection): Institution[] {
  return getInstitutionsByIds(section.institutionIds);
}

export function getSectionForInstitution(institutionId: string): NarrativeSection | undefined {
  return SECTION_CONFIG.find((section) => section.institutionIds.includes(institutionId));
}

export function getInstitutionRelations(institutionId: string): {
  incoming: Relation[];
  outgoing: Relation[];
} {
  return {
    incoming: relationList.filter((relation) => relation.target === institutionId),
    outgoing: relationList.filter((relation) => relation.source === institutionId),
  };
}

export function getSectionRelations(section: NarrativeSection): {
  intraRelations: Relation[];
  interRelations: Relation[];
} {
  return {
    intraRelations: getRelationsByIds(section.intraRelationIds),
    interRelations: getRelationsByIds(section.interRelationIds),
  };
}
