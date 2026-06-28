'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0;

      setProgress(nextProgress);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-6 top-12 z-30 hidden h-[calc(100vh-6rem)] w-1 overflow-hidden rounded-full bg-[rgba(44,44,44,0.08)] xl:block">
      <div
        className="absolute inset-x-0 bottom-0 rounded-full bg-[var(--vermillion)] transition-[height] duration-150"
        style={{ height: `${Math.max(progress * 100, 3)}%` }}
      />
    </div>
  );
}
