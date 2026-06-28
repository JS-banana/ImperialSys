import type { SectionDefinition } from '@/platform/types';
import ImperialCore from './sections/ImperialCore';
import CentralBalance from './sections/CentralBalance';
import Administration from './sections/Administration';
import Oversight from './sections/Oversight';
import Military from './sections/Military';
import SecretPolice from './sections/SecretPolice';

// 静态分区定义：config + component，编译期静态、无副作用。
// page(Server) 据此组合分区进 SSR——取代旧的运行时 section-registry 注册。
export const SECTIONS: SectionDefinition[] = [
  {
    id: 'imperial-core',
    title: '皇权独尊',
    subtitle: '一切军国权力最终汇归于皇帝',
    prologue:
      '自废除丞相后，明朝的制度设计以皇帝为唯一中枢。无论辅政、军政还是特务系统，最终都围绕皇权展开并向其负责。',
    layout: 'featured',
    institutionIds: ['emperor'],
    relationIds: ['r_emp_cabinet', 'r_emp_sili', 'r_emp_jinyi', 'r_emp_wujun'],
    component: ImperialCore,
  },
  {
    id: 'central-balance',
    title: '票拟与批红',
    subtitle: '外朝辅政与内廷批答形成最精巧的权力接口',
    prologue:
      '内阁负责票拟，司礼监负责批红。二者互相依存而又互相牵制，构成明代中枢运转中最具代表性的制度设计。',
    layout: 'split',
    institutionIds: ['cabinet', 'silijian'],
    relationIds: [
      'r_cabinet_sili',
      'r_cabinet_libu', 'r_cabinet_hubu', 'r_cabinet_libu2',
      'r_cabinet_bingbu', 'r_cabinet_xingbu', 'r_cabinet_gongbu',
      'r_sili_dongchang',
    ],
    component: CentralBalance,
  },
  {
    id: 'administration',
    title: '六部执行',
    subtitle: '庞大的国家事务由六部展开为日常治理',
    prologue:
      '六部是中央行政的执行枢纽，覆盖人事、财政、礼制、军事、司法与工程。它们看似分工明确，但始终处在中枢与监察的双重牵引之下。',
    layout: 'grid',
    institutionIds: ['libu', 'hubu', 'libu2', 'bingbu', 'xingbu', 'gongbu'],
    relationIds: [
      'r_duchayuan_libu', 'r_duchayuan_hubu', 'r_duchayuan_bingbu',
      'r_duchayuan_xingbu', 'r_bingbu_wujun',
    ],
    component: Administration,
  },
  {
    id: 'oversight',
    title: '以制权力',
    subtitle: '监察、复核与奏章流转构成外朝的纠偏机制',
    prologue:
      '都察院负责监察弹劾，大理寺负责复核平反，通政司控制奏章入口。它们共同决定了行政权力如何被监督、修正和送入决策链条。',
    layout: 'trio',
    institutionIds: ['duchayuan', 'dalisi', 'tongzhengsi'],
    relationIds: [
      'r_sanjusi_cooperate', 'r_dalisi_xingbu',
      'r_tongzheng_cabinet', 'r_duchayuan_cabinet',
    ],
    component: Oversight,
  },
  {
    id: 'military',
    title: '军政分离',
    subtitle: '发兵权与统兵权被有意拆开，以防武臣坐大',
    prologue:
      '兵部与五军都督府分掌军政与军令。制度看似低效，却体现出明初对军事权力高度警惕的基本思路。',
    layout: 'featured',
    institutionIds: ['wujun'],
    relationIds: ['r_bingbu_wujun'],
    component: Military,
  },
  {
    id: 'secret-police',
    title: '暗处之眼',
    subtitle: '直属皇权的侦缉力量在制度阴影中扩张',
    prologue:
      '锦衣卫与东厂不属于常规官僚体系，却深刻影响朝局。它们既是皇权的延伸，也是制度失衡时最先异化的权力工具。',
    layout: 'split',
    institutionIds: ['jinyiwei', 'dongchang'],
    relationIds: ['r_sili_dongchang', 'r_dongchang_jinyi'],
    component: SecretPolice,
  },
];
