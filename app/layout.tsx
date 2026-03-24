import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '明朝政治制度可视化',
  description: '以纵向叙事与关系图解形式，直观呈现明朝中央政治制度的权力结构、制衡逻辑与历史人物。',
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
