---
status: accepted
date: 2026-06-28
---

# 体验温度定为「编辑级克制 + 关键电影感」，技术栈 Motion + GSAP，不引入 pixijs/remotion

`想法.md` 最初点名希望用 pixijs / remotion 做「丰富动画」，而项目自己的 `docs/research/animation-interaction-libraries.md` 否决了二者、推荐 Motion+GSAP——此冲突一直悬而未决。在 2026-06-28 的设计访谈中，我们先定义「完美体验」的**体验温度**：在「清爽微交互 ↔ 全程电影级奇观」光谱上，选定中高位的 **「编辑级克制为底色 + 少数关键节点的电影感大场面」**（气质对标 Apple 产品页 / NYT 顶级滚动长卷 / 故宫数字文物）。据此，动画技术栈定为 **Motion（主力）+ GSAP ScrollTrigger（关键场景的钉屏 / 滚动驱动编排）**，**不引入 pixijs / remotion / Three.js**。

## Considered Options

- **B · 全程电影级奇观**（pixijs / remotion / Three.js）：最炫、最沉浸，是 `想法.md` 的原始倾向。否决——与水墨/宣纸题材的克制气质冲突；重度自定义渲染对静态导出、移动端、内容可读性都有张力；奇观会压过「制衡关系」这一内容核心。
- **C · 清爽精致 · 微交互为主**（纯 Motion）：最稳、最快、最易维护。否决——不足以兑现「有趣好玩 / 沉浸感」，离「博物馆级丝滑」有距离。
- **A · 编辑级克制 + 关键电影感**（Motion + GSAP）：✅ 选中。水墨题材的「有趣好玩」靠编排与质感、而非特效奇观；制衡关系始终清晰可读；契合 Vercel 静态导出。

## Consequences

- `docs/research` 对 pixijs/remotion 的否决就此正式采纳；`想法.md` 的原始动画库愿望被**有意识地放弃**（本 ADR 即为记录，避免日后反复追问「为何不用 pixijs」）。
- GSAP 从当前「装了却零调用的死代码」转为「即将接入的关键能力」——`platform/animation/scroll.ts` 应被真正消费，而非删除。
- 「完美」的可验收标准尚需进一步定义：到底哪几个是配享「关键电影感」的招牌场景，留待后续访谈节点确定。
