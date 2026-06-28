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
  page.tsx          — 首页（朝代选择）
  dynasty/ming/     — 明朝；dynasty/tang/ — 唐朝

platform/           — 朝代无关的基础设施（能力层）
  types/  utils/(cn, dataHelpers, validation/Zod)  context/  hooks/
  animation/        — scroll.ts（GSAP 封装）
  components/        — section-registry, shell/, drawer/, cards/

dynasties/          — 朝代自治层（每个朝代是一个独立世界）
  ming/  tang/      — meta / theme / sections / data / components / register
  ↑ 新增朝代 ＝ 数据 + 主题 + 沉浸世界 + 分区叙事 + 招牌场景 + 关系图谱布局，不重写平台

data/               — dynasty-registry（朝代目录，首页用）
```

## 当前状态（2026-06-28）

- **多朝代架构已真实跑通**：明、唐两朝均完整、可静态构建；`lib/` 桥接层已删除（迁入 platform）。
- **进度**：完美体验标准 ✅（ADR 0001-0006）；地基重构方案 ✅（`docs/specs/2026-06-28-architecture-refactor-plan.md`，8 阶段）；**界面/视觉/交互设计 ✅**（`docs/specs/2026-06-28-interface-design-system.md`，A–E 全敲定 + 明/唐 token 真值定稿 + 招牌场景/穿越门户编排，ADR-0007）；**架构实现：P1 质量门 ✅**（commit `4c663a6`→`f3115de`）；**下一步 = P2 主题管线**（接入设计系统 §6 的 token 真值；注意与 `meta.ts`/`page.tsx` 的串行约束）。标准 + 设计系统是单一事实源。

> ⚠️ **旧的 `docs/handoff-*`、`docs/architecture`、`docs/analysis`、`docs/research`、`docs/plans`、`conductor/` 及更早的记忆均已过时，不可作为依据——信代码、信 ADR。** 典型陷阱：**P1 已修**——Zod 校验救活（`platform/utils/loadDynastyData.ts` 构建期硬门，meta 走 loader）、`tsc`/`eslint`/CI 立起（`typecheck`+`ci` 脚本 + `.github/workflows/ci.yml`，baseline 门 error 拦/warning 放）、深链接 set-state-in-effect 改 `useSyncExternalStore`；**仍待**——GSAP `platform/animation/scroll.ts` **死代码**（P6 接入）、每朝代主题色管线**断线**（`--dynasty-*` 写了无人读、唐渲染成明，P2 修）、分区内容**不进 SSR**（P3 修）。

### 重构方案

8 阶段小步路线图见 `docs/specs/2026-06-28-architecture-refactor-plan.md`：**P1 质量门 ✅** → P2 主题管线 → P3 渲染 SSR → P4 路由/manifest → P5 内容原子系统 → P6 动画基建 → P7 关系图谱 → P8 穿越转场。**P2+ 未实现**；界面/视觉设计已完成，实做时 P2/P6/P7/P8 接入 `docs/specs/2026-06-28-interface-design-system.md`（§10 列出研究增补 delta）。

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
| `docs/specs/2026-06-28-architecture-refactor-plan.md` | **地基重构方案**（8 阶段路线图 + 锁定决策；P1 ✅，P2+ 未实现）|
| `docs/specs/2026-06-28-interface-design-system.md` | **界面设计系统**（A 基底 / B 朝代 token 真值 / C 招牌场景 / D 关键界面 / E 微交互；喂架构 P2/P6/P7/P8）|
| `docs/specs/2026-06-28-interface-design-brief.md` | 界面设计启动简报（已完成，历史起点）|
| `docs/adr/0001–0007` | 关键设计决策（温度 / 内容深度 / 朝代差异+穿越 / 关系可视化 / 设备底线 / 内容边界 / **设计令牌分层**）|
| `CONTEXT.md` | 领域语言词表 |

> 旧文档（`docs/handoff-*`、`architecture/`、`analysis/`、`research/`、`plans/`、`conductor/`）为历史快照，已被 `.gitignore` 忽略、不入库、**不可作为依据**。
