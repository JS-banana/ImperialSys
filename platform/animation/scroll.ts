'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * GSAP ScrollTrigger 动画工具
 * 提供滚动触发动画、Pinning、时间线编排等能力
 */

// 动态导入 GSAP（避免 SSR 问题）
async function getGSAP() {
  const gsapModule = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsapModule.gsap.registerPlugin(ScrollTrigger);
  return { gsap: gsapModule.gsap, ScrollTrigger };
}

/**
 * 滚动触发动画 hook
 * 元素进入视口时执行动画
 */
export function useScrollReveal<T extends HTMLElement>(
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    trigger?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cleanup: (() => void) | undefined;

    getGSAP().then(({ gsap, ScrollTrigger }) => {
      const animation = gsap.fromTo(
        element,
        {
          y: options.y ?? 40,
          opacity: options.opacity ?? 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: options.duration ?? 0.8,
          delay: options.delay ?? 0,
          ease: options.ease ?? 'power2.out',
          scrollTrigger: {
            trigger: options.trigger ? document.querySelector(options.trigger) ?? element : element,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      cleanup = () => {
        animation.scrollTrigger?.kill();
        animation.kill();
      };
    });

    return () => cleanup?.();
  }, []);

  return ref;
}

/**
 * Pinning 动画 hook
 * 固定元素在滚动期间
 */
export function useScrollPin<T extends HTMLElement>(
  options: {
    pin?: boolean;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cleanup: (() => void) | undefined;

    getGSAP().then(({ ScrollTrigger }) => {
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: options.start ?? 'top top',
        end: options.end ?? '+=500',
        pin: options.pin ?? true,
        scrub: options.scrub ?? false,
      });

      cleanup = () => trigger.kill();
    });

    return () => cleanup?.();
  }, []);

  return ref;
}

/**
 * 交错动画 hook
 * 子元素依次入场
 */
export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cleanup: (() => void) | undefined;

    getGSAP().then(({ gsap, ScrollTrigger }) => {
      const children = element.querySelectorAll(childSelector);
      if (children.length === 0) return;

      const animation = gsap.fromTo(
        children,
        {
          y: options.y ?? 30,
          opacity: options.opacity ?? 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: options.duration ?? 0.6,
          stagger: options.stagger ?? 0.1,
          ease: options.ease ?? 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: options.start ?? 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      cleanup = () => {
        animation.scrollTrigger?.kill();
        animation.kill();
      };
    });

    return () => cleanup?.();
  }, []);

  return ref;
}
