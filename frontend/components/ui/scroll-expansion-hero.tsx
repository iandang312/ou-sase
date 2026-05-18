'use client';

import {
  useEffect,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';

interface ScrollExpandHeroProps {
  mediaSrc: string;
  bgColor?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  ctas?: ReactNode;
  children?: ReactNode;
}

export default function ScrollExpandHero({
  mediaSrc,
  bgColor = '#F5F0E8',
  kicker,
  title,
  subtitle,
  ctas,
  children,
}: ScrollExpandHeroProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const cardWidth = 90 + scrollProgress * 10;
  const cardHeight = 75 + scrollProgress * 25;
  const cardRadius = 16 - scrollProgress * 16;

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: bgColor }}>
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center">
        <div
          className="relative block overflow-hidden"
          style={{
            width: `${cardWidth}vw`,
            height: `${cardHeight}vh`,
            borderRadius: `${cardRadius}px`,
            boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Image
            src={mediaSrc}
            alt=""
            fill
            sizes="100vw"
            preload
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
            style={{
              opacity: 1 - scrollProgress,
              transition: 'opacity 80ms linear',
            }}
          >
            <div className="flex max-w-4xl flex-col items-center gap-6 text-center text-white">
              {kicker && (
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/80">
                  {kicker}
                </p>
              )}
              <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
                {title}
              </h1>
              {subtitle && (
                <p className="max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                  {subtitle}
                </p>
              )}
              {ctas && (
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">{ctas}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-6 py-20 sm:py-32"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}
      >
        {children}
      </section>
    </div>
  );
}
