# ImperialSys — 中国古代政治制度可视化系统

## 项目愿景

以「数字博物馆」为设计理念，用交互式可视化方式展示中国古代历朝政治制度。不是教科书式的文字堆砌，而是让用户通过滚动叙事、交互图表、动画效果，直观理解每个朝代的权力结构和制度设计。

## 核心理念

- **重交互体验**：用户体验优先于技术偏好。善用成熟动画方案（Motion、GSAP、CSS 动画），打造丝滑的博物馆级体验
- **每个朝代独立**：不套用统一模板。每个朝代有自己的数据、布局、视觉风格、叙事结构
- **平台提供能力，朝代定义表达**：动画系统、交互原语、数据工具是平台层共享的；分区结构、视觉风格、叙事逻辑是朝代自治的

## 技术栈

- **框架**：Next.js 16 (App Router) + React 19 + TypeScript
- **样式**：Tailwind CSS v4 + shadcn/Base UI
- **动画**：Framer Motion（已有）+ GSAP ScrollTrigger（按需引入）
- **校验**：Zod v4
- **部署**：Vercel 静态导出

## 架构

```
app/                — 路由入口
  page.tsx          — 首页（朝代选择）
  dynasty/ming/     — 明朝页面

platform/           — 朝代无关的基础设施
  types/            — 通用类型（institution, relation, dynasty）
  utils/            — cn, dataHelpers(工厂模式), validation(Zod)
  hooks/            — useScrollSpy
  components/
    section-registry.ts  — Section 组件注册表
    shell/          — DynastyShell, StickyNav, ScrollProgress, DynastySection, RelationBand
    drawer/         — DetailDrawer + 4 Tab
    cards/          — InstitutionCard

dynasties/          — 朝代自治层（每个朝代独立维护）
  ming/             — 明朝
    meta.ts         — getMingDynastyData()
    theme.ts        — 视觉主题
    sections.ts     — 分区配置
    data/           — JSON 数据
    sections/       — 分区组件
    components/     — 专属组件 + register.ts
```

### 核心设计

- **Server/Client 边界**：SectionConfig（纯数据可序列化）+ 客户端组件注册表。函数和组件不能通过 Server → Client props 传递
- **数据校验**：Zod schema 覆盖全部 4 个 JSON + 跨文件引用完整性检查
- **动画技术栈**：Motion（主力）+ GSAP ScrollTrigger（按需，Pinning/时间线编排）。p5.js 和 Remotion 不引入

## 当前状态

**明朝 Phase 1-5 架构重构已完成。** 详细 handoff 见 `docs/handoff-2026-06-06.md`

待办：
1. 动画体验升级（引入 GSAP ScrollTrigger）
2. 补齐 timelines 数据（7 个机构缺失）
3. 桥接层清理（lib/ 目录逐步迁入 platform）
4. 新朝代扩展（参照 dynasties/ming/ 结构）
5. 深链接支持

## 开发规范

- 使用中文注释和文档
- 优先使用 Server Component，仅在需要交互时标记 `'use client'`
- Server → Client 的 props 必须可序列化（不能传函数/组件）
- 动画属性只用 `transform` 和 `opacity`（GPU 加速）
- 组件文件 PascalCase，工具/hooks 文件 camelCase
- 文档输出到 `docs/` 对应子目录（architecture/ analysis/ research/）

## 文档索引

| 文档 | 内容 |
|------|------|
| `docs/handoff-2026-06-06.md` | 项目 Handoff（架构、状态、待办） |
| `docs/architecture/multi-dynasty-architecture.md` | 架构设计方案 |
| `docs/analysis/2026-06-06-project-review.md` | 项目审查报告 |
| `docs/research/animation-interaction-libraries.md` | 动画/交互技术研究 |
| `docs/plans/` | 历史规划文档（已归档） |
