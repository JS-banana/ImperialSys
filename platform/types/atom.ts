// 外链与深度契约（ADR-0006）。schema 真值源见 platform/utils/validation.ts。

// 站外引用：唯一站外出口，host 强白名单（与 source 一致）由 schema 构建期校验。
export interface ExternalRef {
  label: string;
  url: string;
  source: 'wikipedia' | 'baidu' | 'ctext' | 'other';
}

// 深度契约：全 optional（先 optional 后收紧）。可铺到任意原子（机构/关系/人物/事件/概念）。
// links 为站内互链（AtomRef "type:id" 字符串，经注册表解析保完整性）；
// citations/furtherReading 为站外史料/延伸阅读（克制靠后）。
export interface DepthContract {
  institutionalRole?: string;
  keyMoments?: string[];
  links?: string[];
  citations?: ExternalRef[];
  furtherReading?: ExternalRef[];
}
