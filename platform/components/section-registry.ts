'use client';
import type { ComponentType } from 'react';
import type { SectionProps } from '@/platform/types/dynasty';

type SectionComponentMap = Record<string, ComponentType<SectionProps>>;

const SECTION_REGISTRY: Record<string, SectionComponentMap> = {};

export function registerDynastySections(
  dynastyId: string,
  components: SectionComponentMap
) {
  SECTION_REGISTRY[dynastyId] = components;
}

export function getSectionComponent(
  dynastyId: string,
  sectionId: string
): ComponentType<SectionProps> | undefined {
  return SECTION_REGISTRY[dynastyId]?.[sectionId];
}
