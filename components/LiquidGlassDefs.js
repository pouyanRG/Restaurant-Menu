"use client";
import { useEffect } from "react";

// نقشه‌ی جابه‌جایی: R = افقی، G = عمودی. مقدار 128 یعنی بدون جابه‌جایی (وسط)، لبه‌ها جابه‌جا میشن.
const MAP = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="36" viewBox="0 0 100 36">
    <defs>
      <linearGradient id="r" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="rgb(255,0,0)"/>
        <stop offset=".25" stop-color="rgb(128,0,0)"/>
        <stop offset=".75" stop-color="rgb(128,0,0)"/>
        <stop offset="1" stop-color="rgb(0,0,0)"/>
      </linearGradient>
      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="rgb(0,255,0)"/>
        <stop offset=".3" stop-color="rgb(0,128,0)"/>
        <stop offset=".7" stop-color="rgb(0,128,0)"/>
        <stop offset="1" stop-color="rgb(0,0,0)"/>
      </linearGradient>
    </defs>
    <rect width="100" height="36" fill="url(#r)"/>
    <rect width="100" height="36" fill="url(#g)" style="mix-blend-mode:screen"/>
  </svg>`
);

export default function LiquidGlassDefs() {
  useEffect(() => {
    const ua = navigator.userAgent;
    // فقط Chromium (نه Safari/Firefox و نه Chrome روی iOS)
    if (/Chrome\//.test(ua) && !/CriOS|EdgiOS|FxiOS/.test(ua)) {
      document.documentElement.classList.add("glass-refract");
    }
  }, []);

  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={`data:image/svg+xml,${MAP}`} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="14" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}