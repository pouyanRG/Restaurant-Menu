"use client";
import { useEffect } from "react";

export default function useKeyboardInset(active) {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return undefined;

    const root = document.documentElement;
    const update = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--kb", `${Math.round(kb)}px`);
      root.style.setProperty("--vvh", `${Math.round(vv.height)}px`);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.removeProperty("--kb");
      root.style.removeProperty("--vvh");
    };
  }, [active]);
}
