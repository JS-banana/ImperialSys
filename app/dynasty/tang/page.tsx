import { DynastyShell } from '@/platform/components/shell';
import { getTangDynastyData, TANG_FOOTER_NOTE } from '@/dynasties/tang/meta';
import { TANG_SECTIONS } from '@/dynasties/tang/sections';
import { registerTangSections } from '@/dynasties/tang/components/register';
import TangHero from '@/dynasties/tang/components/TangHero';

export default function TangPage() {
  const data = getTangDynastyData();

  return (
    <DynastyShell
      dynastyId="tang"
      data={data}
      sectionConfigs={TANG_SECTIONS}
      registerSections={registerTangSections}
      footerNote={TANG_FOOTER_NOTE}
      hero={TangHero}
    />
  );
}
