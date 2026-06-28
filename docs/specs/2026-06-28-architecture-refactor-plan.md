# ImperialSys 地基重构方案

> 2026-06-28 产出（架构设计 workflow + 内容原子补设计 + 用户决策）。服务于北极星 [完美体验标准](./2026-06-28-experience-standard.md)，决策依据见 `docs/adr/0001-0006`。
> **总纲：先安全网 → 再接通管线 → 再修结构 → 最后铺体验。** 每阶段独立可交付，小步提交，每步 `next build` + diff `out/` 核验。

## 锁定的关键决策（用户已拍板）

| 维度 | 决策 |
|---|---|
| 主题注入 | **方案 C**：theme.ts 扁平令牌 → 服务端序列化 `[data-dynasty]{...}` 作用域 `<style>`（零闪烁、单一真源、同对象喂 CSS+JS）；朝代异形视觉走朝代自有 CSS/组件逃生口 |
| 令牌命名 | 保持现有 `--paper/--ink-strong/--vermillion` 等，仅清 `--vermilion` 拼写重复 |
| body 背景 | 令牌化（`bgGradient`），随朝代变 |
| 类别色 (CATEGORY_COLORS) | **v1 暂平台共享**（唐明类别色暂同）；v2 经 `useCategoryPalette` 间接层 per-dynasty |
| 渲染模型 | **方案 B**：推倒 section-registry 单例 → page(Server) 直接组合分区进 SSR；通用 `SelectionProvider`（可选中任意内容原子） |
| 路由 | 动态 `[dynastyId]` + `generateStaticParams` + 显式 client import map；保留静态 per-page 作为 build 受阻回退 |
| 内容原子 | **现在就做**：通用选择契约 + 内容原子系统作为承诺阶段（P5）|
| L2 深读 | 客户端全屏遮罩 + `?atom=type:id` 深链接（沉浸优先，不路由化）；`@next/mdx` + `next/dynamic` 按原子懒加载 |
| 事件模型 | 混合式：保留 timelines 叙事节拍 + 晋升跨切面大事件为 event 原子 |
| 概念首批 | 制衡 / 票拟批红 / 三法司会审 / 军政分离 |
| 动画 | 装 `@gsap/react`；Motion(组件级 reveal) + GSAP(pin/scrub/timeline) 分工；TS 动画 token；`MotionConfig reducedMotion=user` 全局接管；三态 1024px 阈值 |
| 关系图谱 | 单一 `RelationGraph` 原语；纯人工策展坐标（dagre/elk 仅离线起草）；curve+elbow 路由；绝不裸力导向/不可拖拽 |
| 穿越转场 | GSAP 时间线 + 持久覆盖层；通用门户兜底 + 宋专属门户待素材增量；统一经「世界」出入；深链接不播门户；cover/reveal 各 0.8–1.2s |
| CI | baseline 门（error 拦、warning 放），相位 2 收紧 |
| 门户素材 | 清明上河图等高清画卷**暂无** → 机制先行 + 通用门户兜底，专属门户待素材+授权就位 |

## 阶段路线图

### P1 — 质量门地基（安全网先行）｜风险低｜依赖：无
立起可回归质量门，几乎不碰特性代码。
- 加 `typecheck: tsc --noEmit` + `ci` 脚本；eslint globalIgnores 加 `.agents/** docs/**` → `pnpm typecheck` 复现 2 个 TS2322
- 新增 `platform/utils/loadDynastyData.ts`（跑 `DynastyDataSchema`+superRefine，返回精确类型）；清 4 个死 FileSchema → 坏数据 fixture 被拒
- ming/tang `meta.ts` 改走 loader、删 `as` 强转 → typecheck 干净、next build 绿（数据完整性成构建门）
- `section-data.test.ts` 改走 loader 并参数化遍历明+唐 + 新增 Zod 反例测试 → test 绿覆盖两朝、typecheck 0 错
- 修 `DynastyShell.tsx:47` set-state-in-effect（改 useState 惰性初始化读 URL）→ lint error=0
- 新增 `.github/workflows/ci.yml`（typecheck→lint→test→build）+ 配 jsdom/@testing-library 的 vitest projects → CI 全绿

### P2 — 主题管线接通 + 去明朝化（B+ 前置闸门）｜风险中｜依赖：P1
让 theme.ts 真正驱动 UI，**唐终于与明迥异**；零闪烁、零全局泄漏。
- `DynastyTheme` 5 色 → 语义令牌扁平记录（surface/ink/accent+wash/accentAlt/gold/line/bgGradient/fonts/decorative）；Zod 强制必填
- 补两朝令牌值：**Ming=现明朝色（视觉零回归基线）**，Tang 填绢色/金色差异值
- 新增 `themeToCssVars()`（纯确定性）+ `DynastyThemeStyle` 组件渲染 SSR 作用域 `<style>`；删 `DynastyShell.tsx:53-65` useEffect 注入 → `out/*.html` 的 `<style>` 含令牌（无 FOUC）
- globals `:root` 明朝固定色降为平台中性默认；body 渐变读 `bgGradient`；清拼写重复
- 外层包 `<div data-dynasty>`；theme 经 context 喂 JS → 唐迥异、无泄漏、路由切换不残留
- 去明朝化文案：footer 读 `meta.footerNote`；CATEGORY_LABELS/RELATION_LEGEND 平台中性默认 + theme 覆盖（带 fallback）；删 SITE_CHROME 死代码

### P3 — 渲染模型 SSR + Server/Client 边界（最高风险结构地基）｜风险高｜依赖：P2
分区 DOM 真进 SSR，给 GSAP 钉屏/内容原子稳定锚点。
- `sections.ts` 每项补 component，导出 `SECTIONS: SectionDefinition[]`（编译期静态、无副作用）
- page(Server) 用 `createDataHelpers` 解析后 map `SectionDefinition→DynastySection 外壳+<SectionComponent/>` 传 children → `out/dynasty/ming.html` 含 6 个 `<section>`+锚点 id+data-institution
- 删 `section-registry.ts` + `register.ts×2`；DynastyShell 瘦身为交互层（Providers+Nav+Progress+Drawer+children）
- 新增 `SelectionProvider`（**通用：可选中机构/事件/人物/概念**）；InstitutionCard 改 `useSelection`、去 prop 透传；drawer 从 context 读 → 分区可降 Server Component
- 留 GSAP 滚动编排挂载点 + data-attribute 锚定约定 + 三态分支骨架（不实装时间线）

### P4 — 平台装配收敛 / 动态路由 / manifest / metadata｜风险中｜依赖：P3
新增朝代成本降为「写 manifest + 注册一行」。
- `dynasties/*/index.ts` 导出 manifest（server 段 meta/theme/getData/sectionConfigs + client 段 hero/styles）；新增 `platform/registry.ts` 聚合；删 `data/dynasty-registry.ts`；首页改读 registry。**预留 `signatureScene/transition/portal` 类型字段（供 P7/P8）**
- 新建 `app/dynasty/[dynastyId]/page.tsx` + `generateStaticParams` + `generateMetadata` + `platform/dynasty-client-map.ts`（显式 map）；删 ming/tang 目录 → 静态导出两页、per-page title 正确（export 受阻则降级回静态 per-page）
- `app/layout.tsx` 写死明朝 title 改站点级中性默认

### P5 — 内容原子系统（深究不撞空）｜风险中｜依赖：P1(Zod) + P3(通用 Selection)
见下方「内容原子数据模型」。结构化原子 + 深度契约 + L2 MDX 遮罩 + 延伸阅读受控。

### P6 — 动画基建（双引擎 + token + 三态/reduced-motion）｜风险中｜依赖：P3
转场与关系图谱的共同依赖，必须先行。
- 装 `@gsap/react`；新增 `platform/animation/tokens.ts`（durations/stagger/distance + easing 双表示 + Motion variants 工厂）
- `useGSAP` 重写 `scroll.ts`：删 useScrollReveal/useStaggerReveal（交还 Motion），保留修正 useScrollPin，新增 useScrollParallax/useSceneTimeline，全包进 `gsap.matchMedia()` 三态 → 无泄漏
- 新增 `AnimationProvider`（`<MotionConfig reducedMotion=user>` + useDeviceTier/usePresentationMode full/mobile/reduced）；globals 加 prefers-reduced-motion 兜底；删各组件手写 reduced 分支
- token 化迁移（初值=现数值，零行为变化）；`ScrollProgress` height→scaleY transform；DetailDrawer Tabs 受控 + AnimatePresence（4 Tab 切换淡入淡出）

### P7 — 关系图谱原语（招牌场景视觉）｜风险中｜依赖：P3 + P6
单一 `RelationGraph` 替换两套手写 SVG。
- 新建 `platform/components/graph/*`：边墨色读 RELATION_STYLES、节点读 CATEGORY_COLORS、routeEdge 支持 curve/elbow/arc、聚焦用 getInstitutionRelations、三态（描边/流光/静态终态）→ reduced-motion 直显终态
- ming overview 数据化（`graph-layouts.ts` 归一化坐标，迁入并删 institutions.json 死 position）；MingHero 改用 RelationGraph + `getSectionForInstitution` 跳转（弃失效的 data-institution 探测）→ 22 条边按类型墨色、点击跳转正常
- 4 场景 layout（balance/judicial/military/surveillance）替换 RelationDiagram，删 ~225 行手绘 SVG（RelationBand 留作移动端降级）
- 布局节点 id 接 Zod 校验

### P8 — 穿越转场系统（朝代世界之门）｜风险中｜依赖：P2+P4+P6
机制（平台）与门户场景（朝代）分离。
- 新增 `platform/transition/{TransitionRoot,PortalTransitionProvider,PortalOverlay}`；`app/layout.tsx` 用 client wrapper 包 children（保留 Server metadata），覆盖层跨路由存活
- `usePortalNavigation` 接管导航：cover 时间线→`router.push`→reveal（主题先就位再揭幕）；进入即 scroll-lock + scrollTo(0,0)
- `portal-registry` + 平台 `DefaultPortal`（色洗+印章纹样通用门户）；深链接/硬加载不播门户只播 Hero 入场 → 通用门户兜底、首帧/SEO 不被遮挡。**宋·清明上河图专属门户待素材+授权增量**

---

## 内容原子数据模型（P5 详设）

**核心：** 跨原子引用统一令牌 `AtomRef = "<type>:<id>"`（institution/relation/event/figure/concept）；结构化「深度契约」住 JSON（受 Zod 强校验保引用完整性），L2 散文住 MDX。

- **统一深度契约**（ADR-0006 schema 化）：`summary / institutionalRole / keyMoments[1-3] / links[] / citations[] / furtherReading[]? / deepRead{mdx}?`。`ExternalRef{label,url,source(wikipedia|baidu|ctext|other),kind(source|reading)}` 是**唯一外链出口**，由 MDX 受控组件 `<Source>/<FurtherReading>` 强制「靠后、小号脚注式、新标签」（ADR-0006 沉浸优先）
- **原子 schema**：institution/relation 追加可选契约（老字段全保留，不破坏现有 UI）；**event 新一等原子**（id+数字 year 便排序）；**figure 去重升原子**（于谦/王振/魏忠贤合并，`institutionIds` 多对多，`getFigures(id)` 签名不变）；**concept 新一等原子**（制衡/票拟批红/三法司/军政分离）
- **引用完整性**：扩展 `DynastyDataSchema.superRefine` 建全原子注册表，校验所有 AtomRef/端点/归属/id 唯一；MDX 内联链接由构建期 `scripts/check-mdx-links.ts` 扫描兜底
- **L2 MDX**：`@next/mdx`（编译期）+ 根 `mdx-components.tsx`；内容驻 `dynasties/<id>/content/<type>/<id>.mdx`；`loadDeepRead` 用 `next/dynamic` 模板 import → 每原子一 chunk 按需拉；客户端 `DeepReadOverlay` 全屏遮罩呈现；`?atom=type:id` 深链接复原（升级现有 `?institution=`）
- **加载策略**：仅 L2 MDX 懒加载；结构化原子 JSON 随朝代页 eager（体量小）
- **迁移（小步、非破坏）**：P0 救活校验(测试+prebuild) → P1 figure 去重(helper 签名不变) → P2 event 混合迁移 → P3 深度契约字段(先 optional 后收紧) → P4 L2 MDX 试点(票拟批红/内阁) → P5 concept + 铺开 + 删旧 Record
- **工作量**：架构脚手架 M–L；内容撰写 L（受 ADR-0006 制度视角封顶，独立长尾推进，不阻塞架构）

---

## 跨阶段串行约束（必须遵守，避免互踩）

- **`meta.ts` 接触面**（P1 loader / P2 令牌 / P4 manifest）与 **`page.tsx` 接触面**（P3 组合 / P4 路由）必须**严格串行**：先合 loader 缝 → 渲染模型 → 路由收敛；禁止两阶段同改同文件
- **layout 客户端边界**（P3 Providers vs P8 持久覆盖层）：协调一棵共享的 layout 级 client provider 树，明确哪些 Provider 上提 layout、哪些留 shell（否则转场覆盖层与页面 context 生命周期错配）
- **主题作用域 vs 转场**（P2 data-dynasty per-page vs P8 跨路由覆盖层）：reveal 必须等新页主题 DOM 就绪（揭幕前探测 data-dynasty 已挂载）才揭幕，否则闪错色
- **三态机制单一来源**：P6 的 `usePresentationMode`/`gsap.matchMedia` 是 P7/P8 唯一三态依赖，必须先落地，禁止各自重实现
- **CATEGORY_COLORS 三方重叠**（P2/P4/P7 都碰）：v1 一律基于「平台共享」假设；per-dynasty 化作为独立 v2、先抽 `useCategoryPalette` 间接层

## 跨切面风险（高优）

- meta.ts/page.tsx 并行冲突（high）→ 串行 + 优先合入 + rebase
- 主题重命名引发全站视觉回归（high）→ Ming 令牌=现明朝色基线，先修线路再验唐差异
- 静态导出兼容性未知（SSR 序列化 style 水合、动态路由、GSAP client、转场 prefetch）（medium）→ 纯确定性序列化、显式 import map、GSAP 仅客户端动态 import、每阶段 build+diff out/、动态路由留静态回退
- CATEGORY per-dynasty 触及 ~13 文件（high）→ 分期，v1 不动
- 分区进 SSR 后 hydration mismatch（medium）→ window 只放 effect、进场用 whileInView、build 后 diff out/
- 门户重资产首帧卡顿（high）→ 专属门户增量、覆盖期 `Image.decode()`/预取、仅 transform/opacity、桌面专属

## 目录结构 / 代码规范 / 依赖现代化（2026-06-28 用户确认：并入 P 阶段，不单独前置）

界面设计会话中用户提出「目录乱、代码没强制规范、依赖应用先进方案」，确认**并入架构 P 阶段逐步定**，在此登记落点避免遗漏：

- **代码规范（P1）**：除修绿 tsc/eslint + `typecheck`/`ci` 脚本 + CI 外，补 prettier + import 顺序；新增《代码规范》文档（命名 / 目录约定 / Server-Client 边界 / 测试位置）并由 lint+CI 强制。
- **目标目录树（P3/P4）**：P3 渲染模型 + P4 manifest/路由落定后，产出一张「目标目录树」总图作单一参照；**收口根 `components/`（shadcn）与 `platform/components/` 的双份组件家**（明确 shadcn ui 归处 vs 平台组件归处）。
  - **❓`src/` 目录待决（开发阶段知悉）**：当前无 `src/`，源码（app/platform/dynasties/data/components）全在根，`tsconfig` `@/*` → `./*`。是否迁入 `src/`（Next 官方支持，配置/源码分离更整洁）属机械但全量改动（动 paths + 搬全部源码目录）。**不在设计阶段定，P3/P4 产出目标目录树时一并决策**——用户 2026-06-28 已点出此问题存在。
- **依赖现代化（P6 等）**：`framer-motion` → 官方新包 `motion`（`import "motion/react"`）；按需新增 `@gsap/react`(P6)、`@next/mdx`+`velite`(P5)、`d3-shape`+`elkjs` 离线(P7)。栈主体（Next16 / React19 / Tailwind4 / Zod4 / Base UI / GSAP）已最新，无需大改。
- **工程卫生**：清 `conductor/` 残留；`scratchpad/` 已 gitignore；产物（`*.tsbuildinfo` 等）确认忽略。
- **项目 skills 利用**（`.agents/skills/`）：实做套用 `vercel-react-best-practices`（React/Next 性能）+ `make-interfaces-feel-better`（手感）；视觉用 `frontend-design`；`remotion-best-practices` **不适用**（ADR-0001 已弃 remotion，建议清理该 skill）。

## 下一步

进入**执行**：从 **P1 质量门** 起步（低风险、为后续一切立回归安全网），逐步小步提交。
