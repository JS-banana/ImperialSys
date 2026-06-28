import type { Metadata } from 'next';
import './globals.css';

// 站点级中性默认（覆盖首页 / 非朝代页）。朝代页 title/description 由
// app/dynasty/[dynastyId] 的 generateMetadata 按朝代覆盖（不再硬写明朝）。
export const metadata: Metadata = {
  title: '中国古代政治制度可视化',
  description: '以数字博物馆理念，用滚动叙事与交互图解直观呈现中国古代历朝的权力结构与制度设计。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
