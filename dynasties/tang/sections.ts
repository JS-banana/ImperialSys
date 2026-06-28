import type { SectionDefinition } from '@/platform/types';
import ImperialCenter from './sections/ImperialCenter';
import SixMinistries from './sections/SixMinistries';
import OversightInner from './sections/OversightInner';
import RegionalMilitary from './sections/RegionalMilitary';

// 静态分区定义：config + component，编译期静态、无副作用。
// page(Server) 据此组合分区进 SSR——取代旧的运行时 section-registry 注册。
export const SECTIONS: SectionDefinition[] = [
  {
    id: 'imperial-center',
    title: '皇权与三省',
    subtitle: '决策、审议与执行的制度化分权',
    prologue:
      '唐朝继承并完善了隋朝的三省六部制。中书省出令、门下省封驳、尚书省执行，三省长官在政事堂共同议政，形成中国古代最成熟的分权制衡体制。',
    layout: 'featured',
    institutionIds: ['emperor', 'zhongshusheng', 'menxiasheng', 'shangshusheng'],
    relationIds: [
      'r_emp_zhongshu', 'r_emp_menxia', 'r_emp_shangshu',
      'r_zhongshu_menxia', 'r_menxia_shangshu', 'r_zhongshu_zhengshitang',
    ],
    component: ImperialCenter,
  },
  {
    id: 'six-ministries',
    title: '六部行政',
    subtitle: '二十四司体系下的国家日常治理',
    prologue:
      '尚书省统领六部，每部四司，共二十四司，覆盖人事、财政、礼制、军事、司法与工程。六部是唐朝行政体系的执行终端，也是中国古代行政制度成熟的标志。',
    layout: 'grid',
    institutionIds: ['libu', 'hubu', 'libu_rite', 'bingbu', 'xingbu', 'gongbu'],
    relationIds: [
      'r_shangshu_libu', 'r_shangshu_hubu', 'r_shangshu_liburite',
      'r_shangshu_bingbu', 'r_shangshu_xingbu', 'r_shangshu_gongbu',
    ],
    component: SixMinistries,
  },
  {
    id: 'oversight-inner',
    title: '监察与内廷',
    subtitle: '御史台的独立监察与翰林院的权力崛起',
    prologue:
      '御史台三院制覆盖中央到地方的监察网络，翰林学士从文学侍从逐步成为「内相」。两者体现了唐朝制度中独立监察与内廷决策的双重张力。',
    layout: 'split',
    institutionIds: ['yushitai', 'hanlin'],
    relationIds: [
      'r_yushitai_sansheng', 'r_yushitai_menxia', 'r_yushitai_shangshu',
      'r_yushitai_xingbu', 'r_hanlin_cabinet_check', 'r_emp_hanlin', 'r_emp_yushitai',
    ],
    component: OversightInner,
  },
  {
    id: 'regional-military',
    title: '藩镇与边疆',
    subtitle: '节度使体制从边防利器到割据之源',
    prologue:
      '节度使最初是唐朝边疆防御的制度创新，集军民财权于一身。安史之乱后藩镇割据成为常态，中央与地方的权力失衡最终瓦解了唐朝的统治根基。',
    layout: 'featured',
    institutionIds: ['jiedushi'],
    relationIds: ['r_emp_jiedushi', 'r_jiedushi_bingbu'],
    component: RegionalMilitary,
  },
];
