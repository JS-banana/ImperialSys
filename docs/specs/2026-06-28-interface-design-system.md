# ImperialSys 界面设计系统（设计阶段定稿）

> 2026-06-28 界面设计会话（grill-with-docs）产出。服务北极星 [完美体验标准](./2026-06-28-experience-standard.md)，喂给架构 [地基重构方案](./2026-06-28-architecture-refactor-plan.md) 的 P2/P6/P7/P8。
> 决策依据见 `docs/adr/`（含本阶段新增 [ADR-0007 设计令牌分层](../adr/0007-design-token-layering.md)）。
> **A–E 全部敲定**；明/唐 token 真值定稿，宋为规划级草案（专属门户待《清明上河图》素材）。

## 0. 研究基线（2026-06 验证，非继承）

三线程并行研究的结论（证据/引用存 `scratchpad/`，关键结论已采纳）：

- **动画/滚动栈**：保持 **Motion（`m`+`LazyMotion` 瘦身）+ GSAP/ScrollTrigger + `@gsap/react`**。穿越转场继续用 **GSAP 持久覆盖层时间线**，**不切 View Transitions**（Next 集成实验性 / Firefox 无降级）。**GSAP 全插件 2025-04 起商用免费**（DrawSVG/MorphSVG/SplitText 可用）。**CSS scroll-driven** 作可选渐进增强（`@supports` 守卫，钉屏/scrub 仍归 GSAP）。三态降级双轨：`MotionConfig reducedMotion="user"` + `gsap.matchMedia()`。
- **关系图谱**：**运行时零布局库**——elkjs 仅离线起草分层坐标 → 入库 → 人工微调；连线 `d3-shape` + 自写 elbow/arc；描边 Motion `pathLength` 为主、DrawSVG 专供招牌滚动。
- **L2 深读**：`@next/mdx`（编译期）+ 动态 import 懒加载；**Velite 仅做构建期 Zod 校验**（救活死代码 Zod）；contentlayer 已死勿用。遮罩基座用 **Base UI Dialog**（焦点锁/scroll lock/Esc/ARIA 齐全）。⚠️ 坑：`@next/mdx` 默认无 frontmatter；Next16 默认 Turbopack 下 Velite 的 webpack 插件失效，须 programmatic `build()` 或独立 CLI。
- **视觉参考锚点**：宣纸暖白 `#FBFBF9`（非纯白）+ 墨色浓淡分层；故宫名画记「概览→详情→笔触级」缩放即叙事（→ L0/L1/L2 + 门户）；NYT Snow Fall 滚动语法但**严守信息密度**；图谱铁律「连线必承载信息 / 每图 1–2 焦点」。

## 1. 设计令牌分层 → [ADR-0007](../adr/0007-design-token-layering.md)

**结构令牌平台共享**（间距/圆角/阴影/字阶比例/动效/组件解剖与交互模式）= 看不见的交互语法。
**表达令牌朝代独占**（配色/字体家族/纹样/氛围/招牌构图）= 看得见的世界。
**站位**：朝代在共享阶梯上选档（密度/阴影暖度/描边墨色），不另造阶梯。

## 2. 结构令牌 · 间距与版式节奏（A2 ✅）

- **基准单位** 4px（对齐 Tailwind v4 `--spacing`）。
- **间距阶梯**：`2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192`（3xs→6xl）。
- **阅读栏宽（中文优化）**：正文/序言/深读 **32–40rem**（≈26–34 汉字/行）；舞台宽（Hero/图谱/招牌）至 72rem 或满幅。
- **分区纵向节奏（桌面）**：叙事分区间呼吸 96–192px；招牌/钉屏场景 = 100vh。
- **空间气质**：**慷慨留白为平台默认（airy）**——博物馆仪式感 + 编辑级克制。
- **密度站位**（ADR-0007 杠杆）：`compact ×0.85 / default ×1.0 / airy ×1.15`，作用于分区节奏 + 卡片内距 + 间隙。**明 = default（官僚理性、信息密度稍高）；唐 = airy（宫廷恢弘、留白更大）。**

## 3. 结构令牌 · 字阶（A3 ✅）

**字阶比例 = 高对比**：正文/UI 克制冷静，招牌/Hero 标题巨大 —— Apple/NYT 的「安静文字 + 巨大时刻」，把电影感预算花在招牌。

- **角色系统**（朝代各自把字体家族映射到这些角色）：`display`（招牌/Hero 大标题、数字）· `heading`（分区/机构标题 h1–h3）· `body`（正文/UI）· `reading`（深读长文，行高更松）· `caption`（脚注/史料标识/外链）
- **字号阶梯**（px）：`caption 13 · small 14 · body 16 · reading 18 · lead 20 · h3 24 · h2 30 · h1 38 · display-sm 48 · display 64 · display-lg 88`
- **display 层流体化**：Hero/招牌标题用 `clamp()` 随视口缩放（如 display-lg `clamp(56px, 8vw, 88px)`），保证桌面巨大、移动端不溢出。
- **CJK 行高**：display 1.1 / heading 1.25 / body 1.6 / reading **1.85** / caption 1.5
- **细节**：数字/年份 `tabular-nums`；display 标题字距 `letter-spacing` 作为**站位**杠杆（唐 airy 标题字距更阔、明克制）。

## 4. 结构令牌 · 圆角 / 阴影 / 描边 / 材质（A4 ✅）

**材质气质 = 宣纸层叠 + 克制硬朗**：材质感来自「纸与墨」而非投影。

- **表面**：半透明「宣纸」面层（细微纸纹，CSS 渐变/噪点低强度叠加，非贴图）；面层间靠透明度与墨线分层，而非重投影。`--card` 维持半透明白（现 `rgba(255,255,255,0.72)`）思路。
- **圆角阶梯**：`sm 4 · md 8 · lg 12 · xl 16`（克制小圆角，无气泡感）；卡片 8–12px。
- **阴影/层级**：`0 平铺 · 1 卡片静置 · 2 卡片悬起 · 3 抽屉 · 4 遮罩/模态`，一律柔和低透明；**不用 Material 重投影**。**暖度＝站位**（明＝墨褐 tint、唐＝暖金褐 tint）。
- **描边**：`hairline 1px · regular 1.5px · accent 2px`，偏「细墨发丝线」而非粗框；**墨色＝站位**（用本朝 ink 低透明度）。

## 5. 结构令牌 · 动效 token（A5 ✅）→ 喂架构 P6 `tokens.ts`

**节奏性格 = 沉稳舒缓·水墨晕开**：入场像墨在纸上渐渐晕开——柔顺减速、稍偏慢、关键时刻缓缓涨起；**绝不弹跳**，一切「落定」。内容动效**不用 spring**（仅极小触控元件可酌情）。

- **时长**：`instant 0 · fast 150 · base 260 · slow 400 · slower 600 · cinematic 900–1100`
- **缓动（双表示）**：`standard` `cubic-bezier(0.22,1,0.36,1)`（柔顺减速，入场默认）· `emphasized` `cubic-bezier(0.16,1,0.3,1)`（强减速，关键时刻）· `exit` `cubic-bezier(0.4,0,1,1)`
- **错峰**：列表/卡片基准 70ms（dense 收紧 40ms）
- **位移**：reveal 上浮 16–24px
- **范式**：Motion `whileInView` 微浮+淡入；钉屏/scrub/穿越归 GSAP；**reduced-motion → 仅淡入或直显终态**（双轨 `MotionConfig` + `gsap.matchMedia`）

> **A 分支（设计系统基底）完成**：A1 令牌分层 · A2 间距/版式 · A3 字阶 · A4 圆角/阴影/描边/材质 · A5 动效。下接 B（朝代表达令牌真值）。

## 6. 表达令牌 · 各朝代世界（视觉方向 + token 真值）（B）

### 6.0 调色板语义槽位契约（结构共享，每朝代填值）

`paper / paper-bright / paper-dark`（宣纸底三阶）· `ink-strong / ink-muted / ink-subtle`（墨三阶）· `accent` + `accent-wash`（招牌主色 + 低透染）· `accentAlt`（辅）· `gold`（金点缀）· `line`（描边墨）· `bgGradient`（body 氛围）· `fonts{display/heading/body/reading/caption}` · `decorative{pattern/particle}` · `站位{density/shadowTint/lineInk}`。
类别色 CATEGORY_COLORS **v1 平台共享**；关系类型墨色 RELATION_STYLES 结构共享、可按朝代 tint。

### 6.1 明 · 「奏章与朱批」（✅，零回归基线）

**视觉灵魂**：票拟批红——宣纸奏章素白 + 朱砂批红 + 浓墨字 + 印章钤记。气质肃穆、理性、制衡张力，官僚精密。

| 槽位 | 值 |
|---|---|
| paper / bright / dark | `#F5F0E8` / `#FFFAF2` / `#EDE5D8` |
| ink strong / muted / subtle | `#2C2C2C` / `#51463E` / `#7C6D5F` |
| accent / accent-wash | `#C0392B`（朱砂红）/ `rgba(192,57,43,0.08)` |
| accentAlt | `#8B4513`（赭石）|
| gold | `#B8860B`（暗金，印玺点缀）|
| line | `rgba(68,50,31,0.12)`（墨褐发丝）|
| bgGradient | 顶部暗金径向晕 + 宣纸→米白纵向渐变（现 body 渐变）|

- **字体**：display/heading = 宋体 `"Songti SC","STSong","Source Han Serif SC","SimSun",serif`（庄重朝堂）；body/UI = 黑体 `"PingFang SC","Hiragino Sans GB",sans-serif`；reading（深读）= 宋体（书卷感）；caption = 黑体小号。
- **纹样/氛围**：宣纸细纹 + **朱印钤记**作点缀；particle = `ink-wash`。
- **站位**：density `default`（官僚理性、密度稍高）；shadowTint 墨褐；lineInk 墨褐。

### 6.2 唐 · 「绢帛与鎏金·盛唐金韵」（✅，真设计·定稿替换占位）

**视觉灵魂**：盛世恢弘 + 三省公文流转——暖绢底 + 鎏金奢华层 + 深红朱主强调 + 唐三彩青绿点睛 + 暖褐墨。气质开阔自信、富丽而不俗、守编辑克制。与明「素白朱墨·肃穆」迥异：唐更暖·更金·更开阔（airy）。

| 槽位 | 值 |
|---|---|
| paper / bright / dark | `#FAF3E2` / `#FFFCF3` / `#F1E6C8`（绢黄暖）|
| ink strong / muted / subtle | `#2A2018`（暖褐墨）/ `#5C4A33` / `#8A7350` |
| accent / accent-wash | `#9E2B2B`（深红朱）/ `rgba(158,43,43,0.08)` |
| gold（鎏金·奢华层）| `#C49A42`；Hero 亮金 `#E3C36B` |
| accentAlt（点睛）| `#356B5B`（唐三彩青绿，克制少用）|
| line | `rgba(120,90,40,0.16)`（金褐发丝）|
| bgGradient | 顶部鎏金径向晕 `rgba(196,154,66,0.18)`（更暖更强）+ 绢色纵向渐变 |

- **字体**：display/heading = 楷体 `"Kaiti SC","STKaiti","KaiTi",serif`（盛唐书风）；body/UI = 黑体 sans；reading（深读）= 宋体（长文易读）；caption = 黑体小号。
- **纹样/氛围**：唐草纹 / 宝相花 + **鎏金 flourish**；particle = `gold-dust`。
- **站位**：density `airy`（宫廷恢弘、留白更大）；shadowTint 暖金褐；lineInk 金褐。

> **金为奢华层（边框/分隔/印记/Hero flourish 处金更显），明则朱为主、金仅暗金点缀**——这是两朝并排最直观的「迥然不同」。

### 6.3 宋 · 「天青与长卷·文人雅致」（规划级草案，token 待定稿 + 专属门户待素材）

**视觉灵魂**：汝窑天青 + 水墨山水 + 文人极简，《清明上河图》市井烟火**收进「门户时刻」**、世界本体保持清淡雅致。宋瓷美学是三朝里最贴「编辑级克制」的——大留白、淡彩、瘦金书。

**草案配色方向**（实做+素材到位再定稿）：paper 冷青白 `#EFF1ED`；ink 偏冷水墨 `#232826`；**accent = 汝窑天青 `#7FA7A3`（灵魂色）**；accentAlt 淡赭 `#B08A5E`（暖点）；**gold 几乎不用**（宋尚素，仅史料印记淡金）；line 冷墨发丝；bgGradient 天青淡晕 + 冷青纵向；particle 烟雨水汽。
**字体方向**：display = 瘦金体（徽宗书风，字体可得性待核；fallback 楷/宋）；body 黑体；reading 宋体。**站位**：density 偏 airy（文人留白）；tint 冷青墨。

**三朝差异轴**：冷暖（唐暖 / 宋冷 / 明中性偏冷）× 浓淡（唐富丽 / 宋清淡 / 明肃穆）× 金属（唐鎏金显 / 明暗金点缀 / 宋几乎无金）。新增第 4 朝代须落在此轴上拉开。

**招牌门户**：《清明上河图》长卷推拉/视差（昼夜微动），俯瞰繁华→入画穿越。**高清素材+授权待** → 先用通用门户兜底（见 §7 / §8）。

## 7. 招牌场景设计（C）→ 喂架构 P7（图谱）/ P8（穿越）

> 三朝各一招牌，体现制度内核；GSAP 钉屏 + scrub 编排；**reduced-motion 一律直显终态**；移动端降级为静态分帧（不钉屏）。

### 7.1 明 · 票拟批红「制衡天平」（✅）

**手法 = 编辑级抽象天平 + 奏章实物感**：抽象优雅的「横梁-支点」图式（非卡通秤），奏章/朱批是有质感的「实物」（宣纸纹 + DrawSVG 墨/朱笔触），制衡关系用朱红双向虚线。克制·机制清·电影感·无缝接图谱。

**滚动编排（钉屏 scrub）**：
- **幕0**：空白奏章浮于宣纸舞台中央。
- **幕1**：内阁·票拟——墨笔拟票 DrawSVG 逐笔写出，左「内阁」标签涨起。
- **幕2**：奏章滑向右，司礼监·批红——朱砂朱批 DrawSVG 覆写，右「司礼监」标签起。
- **幕3**：天平显形——内阁/司礼监两端、皇权居支点；横梁先倾后「落定」归制衡；朱红双向虚线自绘连入。
- **幕4**：化入明朝制衡关系全景图谱（无缝接 §8.6 / P7）。
- **reduced-motion / 移动**：直显终态（已批红奏章 + 已平衡天平 + 静态图谱）。

### 7.2 唐 · 三省封驳的公文流转（✅）

**结构 = 公文流转 + 封驳回环为高潮**：横向流转，「门下封驳」是电影高潮，让否决权可见可感——区别于明的「天平对峙」，唐靠**程序/封驳**制衡。手法沿用平台语法（编辑级抽象 + 实物感 + GSAP scrub）。

**滚动编排（钉屏 scrub，横向流转）**：
- **幕1**：中书省·草诏——诏书以楷书 DrawSVG 逐笔写出（鎏金/朱），「中书」工位亮。
- **幕2（高潮）**：公文流向门下省·封驳——门下审核；演**驳回回环**：公文被朱笔「驳」字钤回中书 → 修正 → 再行（GSAP 时间线往返）。否决权由此可视。
- **幕3**：通过 → 尚书省·执行 → 六部 flourish 展开（鎏金 stagger）。
- **政事堂**居上贯穿（宰相议政，淡金匾额/光晕）。
- **幕4**：化入唐三省关系图谱（接 §8.6 / P7）。
- **reduced-motion / 移动**：直显终态（诏书已成 + 三省流向 + 六部已展 + 静态图谱），驳回回环用一帧「驳」字 + 回指箭头表意。

### 7.3 宋 · 清明上河图门户（✅ 编排锁定，待素材增量）

**宋专属门户**（高清画卷素材 + 授权待）：俯瞰《清明上河图》→ GSAP 推拉镜头推入 + 多层视差（前景舟桥 / 中景人潮 / 远景城郭，分层异速）+ 昼夜微动（光位轻移，非活体模拟，守温度 A）→ 入画落于**城门洞「抵达」**宋世界 Hero。
**回退**：素材未到位时，宋入口走**通用门户**（水墨色洗 + 宋天青钤印，见 §8.7）。
**通用门户机制** = 平台级穿越转场，详见 §8.7（水墨色洗 + 朝代钤印）。

## 8. 关键界面设计（D）

### 8.1 首页 / 世界入口（D1 ✅）
**时间长河·朝代为门**：一条编辑级「时间长河」，每朝代是河上一扇「门」；滚河＝穿越时间，每门**预告本朝世界色**（明朱墨 / 唐金 / 宋青）；点门即触发穿越转场入世界。直接兑现「时间旅行之门」愿景，入口即预览「迥然不同」。reduced-motion：长河转静态时间轴列表，门为卡片。

### 8.2 分区展厅（D2 ✅，套系统）
叙事动线垂直滚动：**序言**（叙事引文，lead 字号）→ **展品网格**（机构卡 L0，airy 留白 + 70ms stagger reveal）→ **层内关系图解**（局部策展 SVG，接 §8.6 原语）→ **层间过渡带**（跨层关系的电影化编排，GSAP）。只滚动即得完整叙事（引导叙事为骨）。

### 8.3 机构卡片 L0（D3 ✅，套系统）
宣纸卡（圆角 8–12px、细墨发丝边、elevation-1）：一句话定位 + **类别色点** + 核心职能（图标/词）。hover → 微浮(translateY 16–24px 反向)/line 加深/elevation-2（沉稳缓动）。click → 抽屉 L1。`useSelection` 驱动（架构 P3）。

### 8.4 详情抽屉 L1（D4 ✅，套系统）
右侧抽屉，**Base UI Dialog/Drawer**（焦点锁/scroll lock/Esc/ARIA）。4 Tab：职能与结构 / 关系网络（单机构 incoming/outgoing）/ 历史演变 / 代表人物。Tab 切换 `AnimatePresence` 淡入淡出（受控）。底部「深读 →」入口通 L2。

### 8.5 深读遮罩 L2（D5 ✅）→ 架构 P5
**沉浸单栏长读 + 浮动目录/进度**：全屏遮罩（Base UI Dialog），单栏阅读 32–40rem（reading 18px / 行高 1.85）；侧边可折叠**细目录 + 阅读进度**；深度契约分节（沿革 / 运作 / 为何如此 / 关键事件 / 史料引文 / 延伸阅读）；**史料引文行内脚注式**，**延伸阅读置最末**（克制靠后、新标签）；内容原子互链行内链接。`?atom=type:id` 深链接复原。阅读为中心、沉浸优先——电影预算留给招牌，不在每篇深读。reduced-motion：遮罩淡入、无 scrub。

### 8.6 关系图谱全景（D6 ✅）→ 架构 P7
**静息全景淡显 → 聚焦渐显**：静息时全图可见但克制淡显（低对比、不「糊全网」）；hover/点机构 → 其关系**墨色点亮、余者隐退**。先给权力全貌再渐进聚焦（合 ADR-0004）。
- **策展坐标**：elkjs **离线**起草分层 → 入库 → 人工微调；**运行时零布局库**。
- **墨色编码**（RELATION_STYLES，结构共享可按朝代 tint）：制衡＝朱红双向虚线 · 统辖＝实线 · 监察＝点线 · …
- **连线** d3-shape + 自写 elbow/arc；**描边** Motion `pathLength`（聚焦触发）/ DrawSVG（招牌滚动）。
- **铁律**（研究）：每条连线必承载信息，否则删；每图聚焦 1–2 节点。
- **不可拖拽 / 不劫持滚轮**（ADR-0004）；平台原语 `RelationGraph`，**每朝代策展自己的布局与墨色**。
- reduced-motion：直显终态静图（聚焦用点击切换，无自绘动画）。

### 8.7 穿越过场（D7 ✅）→ 架构 P8
**平台级穿越转场**＝GSAP 持久覆盖层时间线，跨路由存活；统一经「世界」出入。
- **通用门户**：**水墨色洗 + 朝代钤印**——cover：墨晕色洗到目标朝代色板；reveal：朝代印章/铭牌钤入作「抵达」标记 + 世界浮现。cover/reveal 各 0.8–1.2s；reveal 须等新页主题 DOM 就绪再揭幕（防闪错色）。
- **宋专属门户**：清明上河图长卷推拉（§7.3），待素材；未到位回退通用门户。
- **深链接/硬加载不播门户**（首帧/SEO 不被遮挡），只播 Hero 入场。
- **reduced-motion**：跳过推拉/色洗编排，直接换色 + 钤印淡入（内容完整）。

## 9. 微交互 / 打磨规范（E ✅，特化自 `make-interfaces-feel-better`）

**排印（CJK 特化）**
- 根布局 `-webkit-font-smoothing: antialiased`（macOS 更利落）。
- 年份/统计/数字一律 `tabular-nums`（防跳动）。
- 标题 `text-wrap: balance`；正文 `text-wrap: pretty`。**字距只给 display CJK 标题**（站位杠杆），正文 CJK 不加 letter-spacing。

**表面（宣纸层叠特化）**
- **同心圆角**：外＝内+padding（卡 12px / 内部按钮 8px，禁止父子同圆角）。
- **深度用柔和暖 tint 阴影**（分层 box-shadow，暖度＝站位）；**细墨发丝边是审美墨线**（hairline，非分隔重框）——二者分工：阴影给深度、墨线给质感。
- 文物/画作图加 `1px` 低透明描边（亮底 `rgba(0,0,0,0.1)`，纯黑非染色），防边缘脏。
- 交互元素命中区 ≥ 40×40px（小图标用伪元素扩区，不重叠）。

**动效（水墨晕开特化）**
- 交互态用**可打断 CSS transition**；招牌分幕序列用 **GSAP keyframe/timeline**（运行一次）。
- 入场**拆分 + 错峰**（70ms stagger、whileInView）；退出**克制**（小幅 translateY，比入场更轻）。
- 图标微切换：`scale 0.25→1 / opacity 0→1 / blur 4px→0`，Motion `spring bounce:0`（**bounce 必为 0**，合「绝不弹跳」）。
- 按压 `scale(0.96)`（恒用 0.96，<0.95 过夸张；reduced 时禁用）。
- `AnimatePresence` 默认态元素加 `initial={false}`（防加载即播）。
- **朱印/钤记母题**：选中/抵达/批红用「钤印」微交互（缩放 0.25→1 + 墨晕扩散 + opacity），不用弹跳。
- **关系连线 hover**：墨色点亮 + 可选流光（pathLength/DrawSVG），余者隐退。

**性能 / 三态**
- **绝不 `transition: all`**——只列具体属性（`scale, opacity` 等）。
- `will-change` 仅限 transform/opacity/filter，且仅在首帧抖动时加。
- **三态降级双轨贯穿全部**（`MotionConfig reducedMotion="user"` + `gsap.matchMedia()`）：full（桌面沉浸）/ mobile（保底可读、不钉屏不视差）/ reduced（直显终态、内容完整）。1024px 阈值。

## 10. 与架构的接口 + 研究增补（喂下一阶段）

| 本设计交付 | 喂给架构 |
|---|---|
| §1 令牌分层（ADR-0007）+ §6 表达令牌真值（明/唐定稿、宋草案）| **P2 主题管线**（`theme.ts` 只携带表达令牌+站位；结构令牌住平台）|
| §2–§5 结构令牌（间距/字阶/圆角阴影描边/动效）| **P6 动画基建** `tokens.ts` + 通用组件 |
| §7 招牌场景（明天平 / 唐封驳 / 宋门户）| **P7 关系图谱 / P8 穿越转场** |
| §8.6 图谱全景 | **P7 关系图谱原语** |
| §8.5 深读 L2 | **P5 内容原子 + MDX 遮罩** |
| §8.7 穿越过场 | **P8 穿越转场系统** |

**研究增补（落给架构方案，实做时遵循）：**
- **P6**：三态双轨（`MotionConfig` + `gsap.matchMedia`）；CSS scroll-driven 作 `@supports` 守卫的可选增强层；GSAP 全插件已免费（DrawSVG/MorphSVG/SplitText 可用）；Motion 用 `m`+`LazyMotion` 瘦身。
- **P7**：elkjs **离线**起草坐标 + 入库 + **运行时零布局库**；连线 d3-shape + 自写 elbow/arc；描边 Motion `pathLength` / DrawSVG。**新增任务：离线布局脚本 + 坐标 schema（接 Zod 校验）。**
- **P8**：维持 GSAP 持久覆盖层；**View Transitions 暂实验性，留作未来渐进增强**。
- **P5**：`@next/mdx` 编译期 + 动态 import 懒加载；**Velite 仅做构建期 Zod 校验**（救活死代码 Zod）；遮罩基座 **Base UI Dialog**。⚠️ `@next/mdx` 默认无 frontmatter（原子元数据走 `export const metadata` 或 Velite）；**Next16 默认 Turbopack 下 Velite webpack 插件失效**，须 programmatic `build()` 或独立 CLI。

## 下一步

界面/视觉/交互设计**全部敲定**（A 设计系统基底 · B 朝代世界令牌真值 · C 招牌场景 · D 关键界面 · E 微交互）。下一个 focus = **架构实现**，从 P1 质量门起步，P2 主题管线接入本文件 §6 的 token 真值。宋专属门户与 L2 内容撰写为独立长尾，不阻塞架构。
