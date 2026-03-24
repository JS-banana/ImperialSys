'use client';

import { useMemo } from 'react';
import { SECTION_CONFIG } from '@/lib/sectionConfig';
import {
  getInstitutionById,
  getInstitutionRelations,
  getInstitutions,
  getInstitutionsBySection,
  getRelations,
  getSectionForInstitution,
  getSectionRelations,
} from '@/lib/dataHelpers';

export function useInstitutionData() {
  return useMemo(
    () => ({
      institutions: getInstitutions(),
      relations: getRelations(),
      sections: SECTION_CONFIG.map((section) => ({
        ...section,
        institutions: getInstitutionsBySection(section),
        ...getSectionRelations(section),
      })),
      getInstitutionById,
      getInstitutionRelations,
      getSectionForInstitution,
    }),
    []
  );
}
