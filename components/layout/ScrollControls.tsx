// src/components/layout/ScrollControls.tsx
import React, { useEffect, useState } from "react";

const getSections = () =>
  Array.from(document.querySelectorAll<HTMLElement>("section[data-bg-index]"));

function getActiveIndex(sections: HTMLElement[]): number {
  if (!sections.length) return 0;

  const viewportMid = window.innerHeight * 0.5;
  let bestIdx = 0;
  let bestDist = Infinity;

  sections.forEach((el, idx) => {
    const rect = el.getBoundingClientRect();
    const center = (rect.top + rect.bottom) / 2;
    const dist = Math.abs(center - viewportMid);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = idx;
    }
  });

  return bestIdx;
}

const ScrollControls: React.FC = () => {
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const s = getSections();
    setSections(s);

    const handle = () => {
      if (!s.length) return;
      setActiveIndex(getActiveIndex(s));
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  const scrollToIndex = (targetIndex: number) => {
    const section = sections[targetIndex];
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!sections.length) return null;

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === sections.length - 1;

  const canScrollUp = !isFirst;
  const canScrollDown = !isLast;

  return (
    <div className="fixed z-30 flex flex-col items-center gap-3 pointer-events-none right-6 bottom-8">
      {canScrollUp && (
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          className="pointer-events-auto group flex flex-col items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-2 border border-white/30 shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
          aria-label="Scroll to previous section"
        >
          <span className="inline-flex items-center justify-center border border-red-600 rounded-full h-9 w-9">
            {/* Up arrow (chevron) */}
            <span className="block w-3 h-3 transition-colors rotate-45 border-t border-l border-red-600 group-hover:border-black/90" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-red-600 group-hover:text-black">
            Up
          </span>
        </button>
      )}

      {canScrollDown && (
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          className="pointer-events-auto group flex flex-col items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-2 border border-white/30 shadow-lg transition-transform duration-200 hover:translate-y-0.5"
          aria-label="Scroll to next section"
        >
          <span className="inline-flex items-center justify-center border border-red-600 rounded-full h-9 w-9">
            {/* Down arrow (chevron) */}
            <span className="block w-3 h-3 transition-colors border-t border-l border-red-600 -rotate-135 group-hover:border-black/90" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-red-600 group-hover:text-black">
            Down
          </span>
        </button>
      )}
    </div>
  );
};

export default ScrollControls;
