import { DynastyShell } from '@/platform/components/shell';
import { getMingDynastyData } from '@/dynasties/ming/meta';
import { MING_SECTIONS } from '@/dynasties/ming/sections';
import { registerMingSections } from '@/dynasties/ming/components/register';
import MingHero from '@/dynasties/ming/components/MingHero';

export default function MingPage() {
  const data = getMingDynastyData();

  return (
    <DynastyShell
      dynastyId="ming"
      data={data}
      sectionConfigs={MING_SECTIONS}
      registerSections={registerMingSections}
      hero={MingHero}
    />
  );
}
