import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  root = null,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, rootMargin, root]);

  return { elementRef, isIntersecting };
}
