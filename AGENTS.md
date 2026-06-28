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
- **正处于「完美体验标准已定 → 架构重构」阶段**，标准是新的单一事实源。

> ⚠️ **旧的 `docs/handoff-*`、`docs/architecture`、`docs/analysis`、`docs/research`、`docs/plans`、`conductor/` 及更早的记忆均已过时，不可作为依据——信代码、信 ADR。** 典型陷阱（实际现状）：Zod 校验是**死代码**（零调用，待救活）；GSAP `platform/animation/scroll.ts` 是**死代码**（零引用，待接入）；每朝代主题色管线**断线**（`--dynasty-*` 写了无人读，唐渲染成明）；分区内容**不进 SSR**；`tsc`/`eslint` 坏且被掩盖、无 CI。

### 架构重构 backlog（由标准 commissions，详见 spec）

1. 接通主题管线（朝代主题真正驱动 UI）
2. 平台能力：穿越转场系统
3. 平台能力：关系图谱原语（策展式，绝不裸力导向）
4. 内容原子数据模型 + 救活 Zod 引用完整性 + L2 MDX + 延伸阅读外链字段
5. 渲染/SSR 模型 + Server/Client 边界（修 section-registry+effect、`DynastyShell.tsx:47`）
6. 接入 GSAP；动画 token 体系；reduced-motion 平台级 + 设备三态（桌面完整/移动可读/降级）
7. 平台「去明朝化」（footer / CATEGORY_LABELS / RELATION_LEGEND 下放或泛化）
8. 质量门 / CI（修绿 tsc / eslint、补 typecheck 脚本）

## 开发规范

- 使用中文注释和文档
- 优先使用 Server Component，仅在需要交互时标记 `'use client'`
- 动画属性优先 `transform` / `opacity`（GPU 加速）；动画须有 reduced-motion 降级
- 组件文件 PascalCase，工具/hooks 文件 camelCase
- **设计决策 → `docs/adr/`（ADR）；领域术语 → 根 `CONTEXT.md`；方案 → `docs/specs/`。这三处是单一事实源（已纳入版本控制）。其余 `docs/` 子目录为历史快照、已 gitignore。**

## 文档索引（单一事实源）

| 文档 | 内容 |
|------|------|
| `docs/specs/2026-06-28-experience-standard.md` | **完美体验标准**（北极星：6 维度 + 验收 + 架构 backlog）|
| `docs/adr/0001–0006` | 关键设计决策（温度 / 内容深度 / 朝代差异+穿越 / 关系可视化 / 设备底线 / 内容边界）|
| `CONTEXT.md` | 领域语言词表 |

> 旧文档（`docs/handoff-*`、`architecture/`、`analysis/`、`research/`、`plans/`、`conductor/`）为历史快照，已被 `.gitignore` 忽略、不入库、**不可作为依据**。
