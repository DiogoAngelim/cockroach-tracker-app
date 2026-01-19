"use client"

import { useEffect } from "react";
import { useRoachData } from "@/lib/roach-context";

export function HueInvertEffect() {
  const { entries } = useRoachData();

  useEffect(() => {
    let filter = "hue-rotate(45deg) invert(0)";
    if (entries.length > 0) {
      const latest = entries[0];
      const count = latest.count || 0;
      if (count === 0) {
        filter = "hue-rotate(45deg) invert(1)";
      }
    }
    document.documentElement.style.setProperty("filter", filter);
    return () => {
      document.documentElement.style.removeProperty("filter");
    };
  }, [entries]);

  return null;
}
