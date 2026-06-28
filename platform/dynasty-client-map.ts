import type { ComponentType } from 'react';
import type { DynastyData } from '@/platform/types';
import MingHero from '@/dynasties/ming/components/MingHero';
import TangHero from '@/dynasties/tang/components/TangHero';

/**
 * 朝代 hero 显式 import map（client 组件）。
 *
 * hero 是 client 组件，须按 dynastyId 取用。output:'export' 下禁用变量 dynamic import
 * （`import(\`@/dynasties/${id}/...\`)` 不可静态解析）——故用此编译期静态 map 显式登记。
 * 与 platform/registry.ts（纯服务端数据）刻意分离：让 registry 不把 client hero 拖进
 * 首页 / generateStaticParams 的模块图。新增朝代时在此加一行。
 */
export const DYNASTY_HEROES: Record<string, ComponentType<{ data: DynastyData }>> = {
  ming: MingHero,
  tang: TangHero,
};
