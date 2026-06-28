import path from 'node:path';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // 让 .md/.mdx 进编译管线（内容驻 dynasties/*/content/，非 app/ 路由，不生成页面）
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

// createMDX 无 remark/rehype 插件 → turbopack 安全（函数传不进 Rust）；不加 webpack 配置。
const withMDX = createMDX({});

export default withMDX(nextConfig);
