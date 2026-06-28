'use client';
import { registerDynastySections } from '@/platform/components/section-registry';
import ImperialCenter from '../sections/ImperialCenter';
import SixMinistries from '../sections/SixMinistries';
import OversightInner from '../sections/OversightInner';
import RegionalMilitary from '../sections/RegionalMilitary';

export function registerTangSections() {
  registerDynastySections('tang', {
    'imperial-center': ImperialCenter,
    'six-ministries': SixMinistries,
    'oversight-inner': OversightInner,
    'regional-military': RegionalMilitary,
  });
}
