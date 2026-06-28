'use client';
import { registerDynastySections } from '@/platform/components/section-registry';
import ImperialCore from '../sections/ImperialCore';
import CentralBalance from '../sections/CentralBalance';
import Administration from '../sections/Administration';
import Oversight from '../sections/Oversight';
import Military from '../sections/Military';
import SecretPolice from '../sections/SecretPolice';

export function registerMingSections() {
  registerDynastySections('ming', {
    'imperial-core': ImperialCore,
    'central-balance': CentralBalance,
    'administration': Administration,
    'oversight': Oversight,
    'military': Military,
    'secret-police': SecretPolice,
  });
}
