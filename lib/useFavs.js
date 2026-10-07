"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "menu-favs";

export default function useFavs() {
  const [favs, setFavs] = useState(new Set());

  useEffect(() => {
    try {
      setFavs(new Set(JSON.parse(localStorage.getItem(KEY) || "[]")));
    } catch {}
  }, []);

  const toggle = useCallback((id) => {
    setFavs((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  return [favs, toggle];
}