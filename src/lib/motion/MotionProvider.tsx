import Lenis from "lenis";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "./gsap";

/**
 * Lenis + ScrollTrigger num único loop: o gsap.ticker move o Lenis e cada
 * scroll do Lenis atualiza o ScrollTrigger. Com reduced-motion o Lenis segue
 * ativo (âncoras, API), mas sem smooth: rolagem nativa e saltos imediatos.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES, (context) => {
      const reduce = Boolean(context.conditions?.reduce);
      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: !reduce,
        anchors: reduce ? { immediate: true } : true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    // Fonte trocada (swap) muda alturas: recalcula os pontos de disparo.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  });

  return children;
}
