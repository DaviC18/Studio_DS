// Registro único dos plugins. Todo código de motion importa gsap daqui.
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);

// Condições de gsap.matchMedia() usadas por todos os presets.
export const MOTION_QUERIES = {
  full: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
};

export { CustomEase, gsap, ScrollTrigger, SplitText, useGSAP };
