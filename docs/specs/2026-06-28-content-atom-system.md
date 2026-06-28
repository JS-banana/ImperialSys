# ImperialSys P5 — 内容原子系统：数据模型 + 外链边界 spec

> 2026-06-28 产出（spec-driven-development）。服务北极星 [完美体验标准](./2026-06-28-experience-standard.md)「微观有料 / 深究不撞空」；落点见 [地基重构方案](./2026-06-28-architecture-refactor-plan.md) P5 节 +「内容原子数据模型」整节；内容边界遵 [ADR-0006](../adr/0006-content-depth-boundary.md)、令牌分层遵 [ADR-0007](../adr/0007-design-token-layering.md)。
>
> **总纲：非破坏优先、数据/校验层增量、每切片 `pnpm run ci` 绿 + diff `out/`、保住 P1–P4 全部不变量。** 原子统一接进 `loadDynastyData` / `DynastyDataSchema` / `DynastyData`，**不旁路第二条数据管线**。

## Objective（成功定义）

让「深究任一机构不撞空」：每个原子（机构/关系/事件/人物/概念）填同一**深度契约**、可被任意处互链、可深链接、可下钻 L2 全屏深读，外链克制靠后。

**验收（北极星映射）**：
- 任一展品（机构）→ L1 抽屉 4 Tab → 「深读 ↗」→ L2 全屏 MDX 长文，全链路不撞空（至少试点内阁打通）。
- figure/event/concept 升一等原子，可单独选中、`?atom=type:id` 复原、互链跳转。
- 坏数据（悬空 AtomRef / 悬空 institutionId / 重复 id / 非权威外链）**构建期被 Zod 拒**。
- 明零回归（`--vermillion #C0392B`）、唐迥异（绢黄 `#FAF3E2`/深红朱 `#9E2B2B`）、两页 SSG 齐全。

## 锁定决策（含 2026-06-28 用户拍板）

| 维度 | 决策 | 理由 |
|---|---|---|
| **L2 深读寻址** | **两层解耦**（用户拍板）：`?atom=type:id` 只复原 **L1**；L2 全屏深读是**独立瞬时态**，由 L1 抽屉内「深读 ↗」按钮触发，**不进 URL**。 | L1/L2 职责清晰、URL 只承载一层选中态、深链接行为可预测；放弃「分享直达 L2」换简单与可预测。 |
| **外链校验** | **强白名单**（用户拍板）：`ExternalRef.source∈{wikipedia,baidu,ctext,other}`；superRefine 校验 URL host 与 source 一致（`wikipedia→*.wikipedia.org`、`baidu→baike.baidu.com`、`ctext→ctext.org`），`other` 仅允许 https。 | 把 ADR-0006「权威源」固化成构建期硬门，与全原子注册表同处。 |
| **深链接迁移** | **一次性切换** `?institution=` → `?atom=type:id`，删旧读写。 | 站点未发布（dev 未 push、无外部链接），无历史链接需兼容；YAGNI。 |
| **figure 形态** | `figures: Record<instId, Figure[]>` → **扁平 `Figure[]` + `institutionIds[]` 多对多**；`getFigures(instId)` 由 `.filter(f=>f.institutionIds.includes(instId))` 派生，**签名不变**，`FiguresTab` 零改。 | ⚠️ 校实修正：现数据**有**隐性重复——用合成 id 后缀（`wang_zhen_dongchang`/`wei_zhongxian_dc`/`yu_qian_bingbu`）变相复制了同一人（于谦/王振/魏忠贤），因 Record 无法表达跨机构 figure。② **合并这 3 人**为多机构原子（drop 桩 + union institutionIds + **零内容改写**），唐 19 人无重复直铺。代价：bingbu 卡片 2 人微顺序变（于谦前置）。 |
| **event 模型** | 混合式：**新增 `events: EventAtom[]`**（`id`+数字 `year`+`institutionIds[]`），`timelines` **原封不动**（叙事节拍留存）。 | 晋升跨切面大事件为一等原子，不破坏现有 timeline 渲染。 |
| **deepRead 事实源** | L2 存在性**纯由「显式 MDX 模块 map」派生**（map 里有 ref 即有 L2）；JSON 契约**不存 `deepRead` 字段**。 | 复刻 P4「派生而非重复」教训，杜绝 JSON↔map 漂移（P4 收敛 id 三处一致性同理）。 |
| **MDX 试点** | slice ⑤ 试点**内阁（institution L2）**；票拟批红等 concept L2 留 slice ⑦。 | 一次只打通一条 MDX 管线，机构深读最自然。 |
| **契约字段** | P5 全程 **optional**（先 optional 后收紧）。 | 内容撰写受 ADR-0006 制度视角封顶，是长尾，不阻塞架构；老字段全保留不破坏 UI。 |
| **MDX 构建** | `createMDX`（无插件/仅字符串插件，turbopack 安全）+ `pageExtensions` + 根 `mdx-components.tsx`；按原子懒加载用**显式字面量 import map**（**禁变量 dynamic import**）。 | context7 核实：`next/dynamic` 路径「cannot be a template string or variable」；`@next/mdx` 编译期 + 客户端 code-splitting 与 `output:'export'` 兼容；Next16 默认 turbopack，**绝不加自定义 webpack 配置**（会让 build 失败）。 |

## 数据模型

**核心令牌**：`AtomRef = "<type>:<id>"`，`type∈{institution,event,figure,concept}`（`platform/context/selection.ts` 已通用，P3 预建）。结构化「深度契约」住 JSON（Zod 强校验保引用完整性），L2 散文住 MDX。原子 id **按朝代作用域**（明唐都有 `emperor`），同类型内 id 全局唯一。

### 原子 schema（接进 `DynastyDataSchema`）

```
DynastyDataSchema = strictObject({
  institutions: InstitutionSchema[],                    // 既有 + 可选契约
  relations:    RelationSchema[],                       // 既有 + 可选契约
  timelines:    Record<instId, TimelineEventSchema[]>,  // 原封不动
  figures:      FigureAtomSchema[],          // ② 扁平化（曾是 Record）
  events:       EventAtomSchema[],           // ③ 新增（默认 []）
  concepts:     ConceptAtomSchema[],         // ⑦ 新增（默认 []）
}).superRefine(全原子引用完整性)              // ① 扩展
```

- **FigureAtomSchema**（②）：既有 `id/name/title/period/evaluation/story/tags(min1)` + **`institutionIds: string[](min1)`**。（深度契约 optional 字段随 ④ 与 institution/relation 一并铺，连同契约类型定义；② 只做结构扁平，最小化形变面。）
- **EventAtomSchema**（③）：`id/name(min1)/year:number().int()/summary/institutionIds(min1)/tags(min1)` + `…DepthContract?`。`year` 数字便排序（负=公元前）。
- **ConceptAtomSchema**（⑦）：`id/name(min1)/summary/institutionIds(min1)` + `…DepthContract?`。
- **Institution/Relation**（④）：追加全部 optional 契约字段，**老字段全留**（institution 复用既有 `summary`）。

### 统一深度契约（ADR-0006 schema 化，全 optional）

```
DepthContract = {
  institutionalRole?: string,              // 在制度中的角色
  keyMoments?:  string[].min(1).max(3),    // 1-3 个体现制度运作的关键片段
  links?:       AtomRef[],                 // 互链其他原子（站内深究）
  citations?:   ExternalRef[](kind=source),    // 史料引文
  furtherReading?: ExternalRef[](kind=reading),// 延伸阅读
}
// L2 深读不进契约：存在性由 MDX map 派生（见加载策略）
```

### ExternalRef（唯一外链出口，强白名单）

```
ExternalRefSchema = strictObject({
  label: string.min(1),
  url:   <url 格式校验，实做核对 zod4 idiom z.url()/z.string().url()>,
  source: enum['wikipedia','baidu','ctext','other'],
  kind:   enum['source','reading'],
})
// superRefine host 白名单（强校验）：
//   wikipedia → host 以 .wikipedia.org 结尾（或 ===wikipedia.org）
//   baidu     → host === baike.baidu.com
//   ctext     → host === ctext.org（或以其结尾）
//   other     → protocol === https:
```

### 引用完整性（`superRefine` 全原子注册表，①）

保留 P1 既有四查（机构 id 唯一 / relation source·target / timeline 键 / figure 键），**扩展**为：

1. **建全原子注册表**：`Set<AtomRef>` 聚合所有 `institution:* / figure:* / event:* / concept:*`。
2. **同类型 id 唯一**（figure/event/concept id 各自全局唯一；机构 id 既有）。
3. **`links` AtomRef 解析**：每个 `links[]` 元素须命中注册表，否则拒（悬空互链）。
4. **`institutionIds` 解析**：figure/event/concept 的 `institutionIds[]` 须全是存在机构，否则拒。
5. **ExternalRef host 白名单**：`citations/furtherReading` 每条按上表校验，否则拒。
6. （figure 扁平化后）relation/timeline 既有查不变；旧 figure 键查随 ② 改为 institutionIds 解析。

MDX 内联链接由构建期 `scripts/check-mdx-links.ts` 扫描兜底（⑤/⑦ 增量）。

## 外链边界（ADR-0006 沉浸优先）

- **唯一出口**：站内一律用 `AtomRef` 互链（`links`）；站外只走 `ExternalRef`，由 MDX 受控组件 `<Source>/<FurtherReading>` 渲染。
- **受控呈现**（根 `mdx-components.tsx` 强制）：靠后（仅 L2 末尾）、小号脚注式「史料原文 ↗ / 延伸阅读 ↗」、`target=_blank rel=noopener`、绝不在 L0/L1/早期放显眼「去站外」按钮。
- **散文受制度视角封顶**：不写人物八卦/通史细节；超制度视角才外链。

## MDX 深读管线（⑤）

- **构建**：装 `@next/mdx` + `@mdx-js/react`（+ types）；`next.config.ts` 用 `createMDX({})`（无插件）包裹 + `pageExtensions:['js','jsx','ts','tsx','md','mdx']`；**不加 webpack 配置**。
- **受控组件**：根 `mdx-components.tsx` 导出 `useMDXComponents()`，注入 `<Source>/<FurtherReading>`（吃 `ExternalRef`，落 ADR-0006 样式）+ 排版默认。
- **内容驻地**：`dynasties/<id>/content/<type>/<atomId>.mdx`（试点 `dynasties/ming/content/institution/cabinet.mdx`）。
- **显式 MDX 模块 map**（复刻 `DYNASTY_HEROES`，**禁变量 import**）：`platform/content/deep-read-map.ts` 导出 `Record<dynastyId, Record<AtomRef, () => Promise<{default: ComponentType}>>>`，每值字面量 `() => import('@/dynasties/ming/content/institution/cabinet.mdx')` → 每原子一 chunk、懒加载、可静态解析。新增 L2 = 加一行。
- **DeepReadOverlay**（client，全屏遮罩，两层解耦）：读 `deepReadRef`（瞬时态，**不进 URL**），按 `dynastyId+AtomRef` 查 map → `React.lazy`/`next/dynamic` 懒载 → 渲染 MDX；Esc/关闭清态。L1 抽屉「深读 ↗」按钮**仅当 ref 命中 map** 才显示。
- **加载策略**：仅 L2 MDX 懒加载（每原子 chunk）；结构化原子 JSON 随朝代页 eager（体量小）。

## 深链接 `?atom=type:id`（⑥，一次性切换）

- `selection.ts`（纯模块）升级：`readDeepLinkRef` 读 `?atom=`、`applySelectionToSearch` 对**所有类型**写 `?atom=type:id`，**删 `?institution=` 读写**。
- `SelectionContext` 的 `useSyncExternalStore(getServerSnapshot=null)` 模式**不回退**（防水合不一致）；`replaceState` 同步不变。
- **DeepReadOverlay 不进 URL**（两层解耦）：`?atom=` 只复原 L1 抽屉/卡片选中态。
- `DetailDrawer` 按 atom type 路由：`institution:*`→现机构抽屉（不变）；`figure:*/event:*/concept:*`→各自视图（最小可视）。

## 渲染/抽屉接线（不破坏 P3/P4）

- **保住组合契约**：`page.tsx` 的 `manifest.getData()→createDataHelpers→sections.map(<DynastySection>{<SectionComponent/>}</DynastySection>)`、nav 剥 `component` —— **P5 只给原子加数据/契约/helper，不动这套组合**。
- **`manifest.getData()` 调用契约不动**（动态路由依赖）；新原子经 `loadDynastyData` 自然流入 `DynastyData`。
- **dataHelpers 扩展**（签名增量，不破坏既有）：`getFigures(instId)` 派生不变 + 新 `getFigureById/getEventById/getEvents/getConceptById/getEventsByInstitution?`。
- **SelectionContext 扩展**：加瞬时 `deepReadRef`/`openDeepRead`/`closeDeepRead`（**不进 URL**，与 `selection.ts` 纯 URL 模块隔离）。

## Testing Strategy（TDD 适用边界）

- ✅ **TDD 合身**（`tests/*.test.ts`，照 `section-data.test.ts` 反例范式）：
  - superRefine 全原子引用完整性：坏 ExternalRef host / 坏 AtomRef 格式 / 悬空 link / 悬空 institutionId / 重复 figure·event·concept id —— 逐条 `toThrow`。
  - `dataHelpers` 纯逻辑：`getFigures` 派生等价、`getEventById/getConceptById/getEvents`。
  - MDX map 覆盖断言：map 每个键是合法 AtomRef 且指向存在原子；（可选）每个 L2 原子在 map 有条目。
  - id 一致性硬门（比照 `registry.test.ts`）：deep-read map 键覆盖。
- ⚠️ **走 `next build` + diff `out/` + 人工核验**（TDD 测不到）：`@next/mdx` 静态导出、每原子 chunk 真按需拉、`DeepReadOverlay` 懒载/遮罩、`?atom=` 深链接复原、两页齐全、明零回归唐迥异。
- **底线**：每切片 `pnpm run ci` 绿才提交；export/MDX 受阻 → 降级（eager import / 非懒加载遮罩），登记 handoff。

## 切片计划（① → ⑦，非破坏增量）

> 每切片：`/tdd` 驱动逻辑 → `pnpm run ci` 绿 → `next build` + diff `out/` → 小步提交（只提交本次、不夹带）。substantive 切片用 workflow 对抗式证伪复核。

| # | 目标 | 验证标准 | 触及文件 | 边界 |
|---|---|---|---|---|
| **①** | 救活校验 + 全原子注册表 + ExternalRef 强白名单 + AtomRef 链解析（schema 骨架，容忍空数组） | 反例测试全红→全绿；真实数据零改仍绿 | `platform/utils/validation.ts`、`tests/section-data.test.ts`（+反例） | 不改数据/UI；events/concepts 默认 `[]` |
| **②** | figure 扁平升原子（多对多 `institutionIds`）+ 合并 3 隐性重复人物，`getFigures` 派生签名不变 | 反例（悬空 institutionId / 重复 figure id）拒；`FiguresTab` 零改、抽屉仍渲染 figure；getFigures 全机构 old↔new 对比仅 3 合并处变、零内容损；build diff | `validation.ts`、`platform/types/*`、`dataHelpers.ts`、明唐 `figures.json`、tests | 形态从 Record→数组，**唯此一处数据形变**；仅结构（深度契约留 ④）|
| **③** | event 一等原子（数字 year）+ helper + 种子事件；timelines 不动 | event 引用完整性反例拒；`getEventById/getEvents` 测试；build 两页齐全 | `validation.ts`、`types`、`dataHelpers.ts`、明唐 `events.json`(新)、tests | 最小可视即可，富展示随 ⑥ |
| **④** | 统一深度契约 optional 字段进 institution/relation + 种子若干 | links/citations/furtherReading 反例拒；老 UI 零回归；build diff | `validation.ts`、`types`、明唐数据、tests | 全 optional，不收紧 |
| **⑤** | L2 MDX 试点（内阁）+ 受控外链组件 + 显式 map + DeepReadOverlay（两层解耦） | **build + diff `out/`：cabinet.mdx chunk 落地、两页齐全、明零回归唐迥异**；map 覆盖断言；「深读 ↗」按钮仅 L2 原子显示 | `next.config.ts`、`mdx-components.tsx`(新)、`platform/content/deep-read-map.ts`(新)、`DeepReadOverlay`(新)、`DetailDrawer`、`SelectionContext`、`dynasties/ming/content/`、`package.json` | **头号风险切片**；受阻降级 eager；不加 webpack 配置 |
| **⑥** | `?atom=type:id` 一次性切换 + DetailDrawer 按 type 路由 | 选 figure→`?atom=figure:id`→reload 复原（round-trip 测试）；`useSyncExternalStore` 不回退；build diff | `selection.ts`、`SelectionContext`、`DetailDrawer`、tests | 删 `?institution=`；L2 不进 URL |
| **⑦** | concept 一等原子（制衡/票拟批红/三法司/军政分离）+ 铺开 + 删旧残留 + 票拟批红 L2 | 全 5 类原子 superRefine 覆盖；build diff；多 agent 对抗复核；写 P6 handoff | `validation.ts`、`types`、`dataHelpers.ts`、明唐 `concepts.json`(新)、内容 MDX、tests | 删任何旧 Record 残留孤儿（仅本切片引入的） |

## Boundaries（不要踩）

- **保住 P1–P4 不变量**：动态路由组合逻辑 / `manifest.getData()` 调用契约 / 通用 `SelectionProvider` / registry 键派生 + id 一致性硬门 / 每步 ci 绿 + diff out/（见 handoff「必须保住」）。
- **ADR-0006**：外链只走 `ExternalRef` + 受控组件「靠后、小号、新标签」；散文制度视角封顶。
- **ADR-0004**：勿引入 React Flow/force-directed。**ADR-0001**：勿引入 pixijs/remotion/Three.js。
- **`CATEGORY_COLORS` v1 不动**（P2/P4/P7 三方重叠）。
- **串行约束**：P5 动 `validation.ts`(superRefine) + `loadDynastyData` + `DynastyData` 类型 + `dataHelpers` + `selection.ts` + 新 MDX/overlay 件，属数据/校验层增量，与 P4 路由层基本不重叠；**别动 `manifest.getData` 调用契约与 P3/P4 分区组合**。
- **基线既有孤儿勿夹带清理**（`sections/index.ts`、`components/index.ts` barrel、`layoutClasses`）——独立提交。

## 未决 / 延后

- 契约字段「后收紧」（optional→required）留 P5 之后内容铺满时。
- `scripts/check-mdx-links.ts` MDX 内联链接扫描随 ⑤/⑦ 增量。
- per-dynasty `CATEGORY_LABELS/RELATION_LEGEND` 覆盖仍**有意未做**（ADR-0007）。
- concept/event 的富视觉展示（非最小可视）可随 P6/P7 增强。
