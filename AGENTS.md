# ImperialSys — 中国古代政治制度可视化系统

## 项目愿景

以「数字博物馆」为设计理念，用交互式可视化方式展示中国古代历朝政治制度。不是教科书式的文字堆砌，而是让用户通过滚动叙事、交互图表、动画效果，直观理解每个朝代的权力结构与制度设计。

> **北极星 ＝「完美体验标准」**：见 `docs/specs/2026-06-28-experience-standard.md`（6 维度 + 验收标准 + 架构 backlog）。所有架构/UI 决策都服务它。

## 核心理念

- **重交互体验**：用户体验优先于技术偏好。体验温度＝**编辑级克制 + 关键电影感**（Motion 主力 + GSAP 关键滚动编排；不引入 pixijs/remotion）。
- **每个朝代是一个独立的沉浸世界**：不套用统一模板；每朝代有自己的视觉/布局/叙事，由「穿越转场」连接（例：宋＝俯瞰《清明上河图》后抵达宋朝世界）。
- **平台提供能力，朝代定义表达**：共享「看不见的能力/交互语法」（滚动引擎、穿越转场、关系图谱机制、内容原子、抽屉、交互原语）；独立「看得见的世界」（配色/字体/纹样/布局/招牌场景）。
- **微观有料**：宏观丝滑之外，深究任一机构不撞空——分层深读 L0/L1/L2 + 事件/人物/概念内容原子互链。

## 技术栈

- **框架**：Next.js 16 (App Router) + React 19 + TypeScript（`output: 'export'` 静态导出）
- **样式**：Tailwind CSS v4 + shadcn/Base UI
- **动画**：Framer Motion（主力）+ GSAP ScrollTrigger（关键滚动编排/钉屏/视差）。**不引入 pixijs / remotion / Three.js**
- **校验**：Zod v4
- **内容**：结构化数据（JSON/TS）+ L2 深读富文本（MDX，规划中）

## 架构

```
app/                — 路由入口
  page.tsx          — 首页（朝代选择，读 platform/registry）
  dynasty/[dynastyId]/ — 朝代页（动态路由 + generateStaticParams/generateMetadata）

platform/           — 朝代无关的基础设施（能力层）
  types/  utils/(cn, dataHelpers, validation/Zod)  context/  hooks/
  registry.ts       — 朝代注册表（聚合各朝 manifest；键由 meta.id 派生）
  dynasty-client-map.ts — hero 显式 import map（client 组件，output:'export' 用）
  animation/        — scroll.ts（GSAP 封装，死代码待 P6）
  components/        — shell/, drawer/, cards/

dynasties/          — 朝代自治层（每个朝代是一个独立世界）
  ming/  tang/      — index(manifest) / meta / theme / sections / data / components
  ↑ 新增朝代 ＝ manifest + registry/hero-map 各一行 + 数据/主题/世界/叙事，不重写平台
```

## 当前状态（2026-06-29）

- **多朝代架构已真实跑通**：明、唐两朝均完整、可静态构建；`lib/` 桥接层已删除（迁入 platform）。
- **进度**：完美体验标准 ✅（ADR 0001-0006）；地基重构方案 ✅（`docs/specs/2026-06-28-architecture-refactor-plan.md`，8 阶段）；**界面/视觉/交互设计 ✅**（`docs/specs/2026-06-28-interface-design-system.md`，A–E 全敲定 + 明/唐 token 真值定稿 + 招牌场景/穿越门户编排，ADR-0007）；**架构实现：P1 质量门 ✅**（`4c663a6`→`f3115de`）、**P2 主题管线 ✅**（`374517c`→`b75202d`；`DynastyTheme` 语义令牌化 + Zod 必填硬门 + `themeToCssVars` + `DynastyThemeStyle` SSR 作用域 `<style>`，唐与明迥异、Ming 零回归、零全局泄漏，5 路对抗复核通过）、**P3 渲染模型 SSR ✅**（`cd025dd`→`a0d8fab`；通用 `SelectionProvider`（`AtomRef="type:id"`）承接选中态 + 卡片/抽屉读 `useSelection`、分区由 page(Server) 静态组合进 SSR（明 6/唐 4 `<section>` + 机构正文进 `out/*.html`）、**推倒 section-registry 单例**、分区/`DynastySection` 降 Server Component、`data-institution` 锚点；6 维度 16-agent 对抗复核通过——修 reduce-motion 水合不一致 + rest 解构 lint 两处真实发现）、**P4 平台装配/动态路由/manifest/metadata ✅**（`29ff867`→`43fe10e`；新增朝代成本降为「写 manifest + registry/hero-map 各注册一行」——各朝 `dynasties/*/index.ts` 导出 `DynastyManifest`（meta/getData/sections/footerNote + P7/P8 预留占位类型）、`platform/registry.ts` 聚合（键由 `meta.id` 派生，杜绝漂移）、`platform/dynasty-client-map.ts` 显式 hero map；动态路由 `app/dynasty/[dynastyId]/page.tsx`（**复刻 P3 组合** + `generateStaticParams` + `dynamicParams=false` + `generateMetadata` per-dynasty title）取代 ming/tang 写死目录、删 `data/dynasty-registry.ts`；`layout.tsx` 站点级中性 title；`DynastyThemeStyle` 加 `html/body:has([data-dynasty])` 漆底堵 overscroll 明味；顺带修首页 `--accent` 隐形文案 bug；6 维度 9-agent 对抗复核通过——3 发现全 low 全确认（id 三处一致性张力），已收敛 registry 派生 + 2 条 id/hero 一致性测试硬门）、**P5 内容原子系统 ✅**（`11d48f2`→`f5e33c5`；五类原子（机构/关系/人物/事件/概念）统一深度契约 `DepthContract`（institutionalRole/keyMoments/links/citations/furtherReading，全 optional）+ Zod superRefine 全原子注册表（id 唯一 / institutionIds 解析 / links 命中 / ExternalRef host 白名单）构建期硬门；figure 扁平升原子（Record→数组 + institutionIds 多对多，合并 3 隐性重复人物）、event/concept 一等原子 + helper；`?atom=type:id` 一次性深链接（删 `?institution=`，字面冒号）+ `DetailDrawer` 按 type 路由（institution Tabs 不动 / figure / event / concept 最小视图）+ `AtomLinks` 互链 chip（links 跨原子 + institutionIds 横跳）；L2 全屏深读 `DeepReadOverlay`（`@next/mdx` + 显式字面量 import map，每原子懒载 chunk，两层解耦：L2 不进 URL）——内阁 + 票拟批红试点，「新增 L2 = map 加一行」；7 维度 58-agent 对抗复核通过——4 确认发现已修/登记：concept links 去重（剔机构自引）+ L2 关闭复原焦点（⑤b 遗留）已修，dialog 语义/focus-trap 延后 P6 a11y 统一）；**下一步 = P6 动画基建**（装 `@gsap/react` + `platform/animation/tokens.ts` + `useGSAP` 重写 `scroll.ts` 死代码 + `AnimationProvider`（`MotionConfig reducedMotion=user` + 三态 `usePresentationMode` full/mobile/reduced）；依赖 P3 SSR 锚点）。标准 + 设计系统是单一事实源。

> ⚠️ **旧的 `docs/handoff-*`、`docs/architecture`、`docs/analysis`、`docs/research`、`docs/plans`、`conductor/` 及更早的记忆均已过时，不可作为依据——信代码、信 ADR。** 典型陷阱：**P1/P2/P3/P4/P5 已修**——P1：Zod 救活（`platform/utils/loadDynastyData.ts` 构建期硬门，meta 走 loader）、`tsc`/`eslint`/CI 立起、深链接改 `useSyncExternalStore`；P2：主题管线接通（`theme.ts` 语义令牌化 + `themeToCssVars` + `DynastyThemeStyle` 渲染 `[data-dynasty]{…}` SSR 作用域 `<style>`，**删 `--dynasty-*` 全局注入**、唐迥异、`--ring`/`::selection` 改 `color-mix(var(--vermillion))` 跟色）；P3：**渲染模型 SSR**——分区由 page(Server) 静态组合进 `out/*.html`（不再运行时注册），**已删 `section-registry.ts` + `register.ts×2`**；分区/`DynastySection` 降 Server Component（卡片/图谱仍 client 岛屿）+ 新增**通用 `SelectionProvider`**（`platform/context/SelectionContext.tsx` + 纯 `selection.ts`：`AtomRef="type:id"`，URL 深链接 P3 仍 `?institution=`、P5 升 `?atom=`，卡片/抽屉读 `useSelection`）+ `data-institution` 锚点；分区进 SSR 后用 `whileInView`/恒定 `initial` 防水合不一致（reduce-motion 仅降级 `transition`）；P4：动态路由 `[dynastyId]`（`generateStaticParams`+`dynamicParams=false`+`generateMetadata`）复刻 P3 组合取代写死目录、`manifest`/`registry`（键由 `meta.id` 派生）/`dynasty-client-map`（hero 显式）三件套、`html/body:has([data-dynasty])` SSR 漆底、站点级中性 title、首页 `--accent`→`--vermillion`；P5：五类原子统一深度契约 + Zod 全原子注册表硬门、`?atom=type:id`（删 `?institution=`）+ 抽屉按 type 路由 + `AtomLinks` 互链、L2 MDX（显式 import map / 每原子懒载 chunk / L2 不进 URL）内阁+票拟批红试点。**仍待**——GSAP `platform/animation/scroll.ts` **死代码**（P6 = 下一步接入）；**遗留 low（已知、延后）**——P4 已用 `html/body:has([data-dynasty])` 漆底堵住 overscroll 露出的明味；未消费的 shadcn `--card/--popover/--secondary/--accent` 仍 `:root` 平台默认（当前零视觉影响），完整 `data-dynasty` 上提 `html`（含派生令牌跟色）随 P8 layout client 边界 + 持久转场覆盖层一并做（P8 本就负责 html 级主题/转场协调）；唐 Hero 亮金 `#E3C36B` 待招牌阶段；`decorative`/`density` 已存数据待 P6 消费；P5 遗留：抽屉/遮罩 `role=dialog`/`aria-modal`/`aria-labelledby` + focus-trap（L2 focus-restore 已修，余项与 focus-trap 同处、延后 P6 a11y 统一）、部分 event/concept 原子仅深链接可达（无反向 backlink，by-design——经 `links` chip 正向可达即可）、唐无 event/concept 种子（长尾）、MDX 内联外链无构建期白名单（`scripts/check-mdx-links.ts` 未建，登记延后）；去明文案的 `CATEGORY_LABELS/RELATION_LEGEND` per-dynasty 覆盖机制**有意未做**（现标签明唐通用、图例零消费者；待真有朝代需异标签时按 ADR-0007 进 `meta` 不进 `theme`）；`dynasties/*/sections/index.ts` 与 `components/index.ts` barrel、`DynastySection` 的 `layoutClasses` 为**基线既有孤儿**（非 P3/P4 引入，待独立清理提交，勿夹带；`DynastyModule`/`DynastyConfig` 孤儿接口已于 P4 随 manifest 重构一并删除）。

### 重构方案

8 阶段小步路线图见 `docs/specs/2026-06-28-architecture-refactor-plan.md`：**P1 质量门 ✅** → **P2 主题管线 ✅** → **P3 渲染 SSR ✅** → **P4 路由/manifest ✅** → **P5 内容原子系统 ✅** → P6 动画基建 → P7 关系图谱 → P8 穿越转场。**P6+ 未实现**；界面/视觉设计已完成，实做时 P6/P7/P8 接入 `docs/specs/2026-06-28-interface-design-system.md`（§10 列出研究增补 delta）。

## 开发规范

- 使用中文注释和文档
- 优先使用 Server Component，仅在需要交互时标记 `'use client'`
- 动画属性优先 `transform` / `opacity`（GPU 加速）；动画须有 reduced-motion 降级
- 组件文件 PascalCase，工具/hooks 文件 camelCase
- **设计决策 → `docs/adr/`（ADR）；领域术语 → 根 `CONTEXT.md`；方案 → `docs/specs/`。这三处是单一事实源（已纳入版本控制）。其余 `docs/` 子目录为历史快照、已 gitignore。**

## 文档索引（单一事实源）

| 文档 | 内容 |
|------|------|
| `docs/specs/2026-06-28-experience-standard.md` | **完美体验标准**（北极星：6 维度 + 验收）|
| `docs/specs/2026-06-28-architecture-refactor-plan.md` | **地基重构方案**（8 阶段路线图 + 锁定决策；P1–P5 ✅，P6+ 未实现）|
| `docs/specs/2026-06-28-content-atom-system.md` | **内容原子系统**（P5 spec：5 类原子数据模型 + 统一深度契约 + 外链边界 + ①–⑦ 切片表）|
| `docs/specs/2026-06-28-interface-design-system.md` | **界面设计系统**（A 基底 / B 朝代 token 真值 / C 招牌场景 / D 关键界面 / E 微交互；喂架构 P2/P6/P7/P8）|
| `docs/specs/2026-06-28-interface-design-brief.md` | 界面设计启动简报（已完成，历史起点）|
| `docs/adr/0001–0007` | 关键设计决策（温度 / 内容深度 / 朝代差异+穿越 / 关系可视化 / 设备底线 / 内容边界 / **设计令牌分层**）|
| `CONTEXT.md` | 领域语言词表 |

> 旧文档（`docs/handoff-*`、`architecture/`、`analysis/`、`research/`、`plans/`、`conductor/`）为历史快照，已被 `.gitignore` 忽略、不入库、**不可作为依据**。
