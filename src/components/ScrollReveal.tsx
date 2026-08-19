import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delayMs?: number;
}

export function ScrollReveal({ children, className = '', delayMs = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.unobserve(element);
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = { '--reveal-delay': `${delayMs}ms` } as CSSProperties;

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${visible ? 'scroll-reveal--visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
