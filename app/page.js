"use client";
import { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import HeaderBar from "@/components/HeaderBar";
import SearchSection from "@/components/SearchSection";
import CategoryHorizontalScroller from "@/components/CategoryHorizontalScroller";
import ProductGrid from "@/components/ProductGrid";
import CurvedBottomNavigation from "@/components/CurvedBottomNavigation";
import { categories, products, navItems } from "@/data/products";

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("home");
  const [cart, setCart] = useState([]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const byCat = category === "All" || p.category === category;
      const byQuery = !q || p.name.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [category, query]);

  return (
    <AppLayout>
      <div className="content">
        <HeaderBar />
        <SearchSection value={query} onChange={setQuery} />
        <CategoryHorizontalScroller items={categories} active={category} onSelect={setCategory} />
        <ProductGrid products={visible} onAdd={(p) => setCart((c) => [...c, p])} />
      </div>
      <CurvedBottomNavigation items={navItems} active={tab} onSelect={setTab} cartCount={cart.length} />
    </AppLayout>
  );
}
