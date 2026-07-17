"use client";

import { useEffect } from "react";

export function LedgerReveal() {
  useEffect(() => {
    const rows = document.querySelectorAll(".fork-moment");
    if (!rows.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle("in-view", entry.isIntersecting);
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);
  return null;
}
