"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [favs, setFavs] = useState(new Set());
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 1600);
  };

  const toggleFav = (id) => {
    setFavs((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToCart = (p) => {
    setCart((c) => [...c, p]);
    showToast(`${p.name} added to cart`);
  };

  const openFilters = () => showToast("Filters coming soon");
  const openNotifications = () => showToast("Notifications coming soon");
  const openLocation = () => showToast("Location picker coming soon");
  const openCart = () => {
    const items = cart.length;
    showToast(items ? `${items} item${items > 1 ? "s" : ""} in cart` : "Your cart is empty");
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const byCat = category === "All" || p.category === category;
      const byQuery = !q || p.name.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [category, query]);

  const favoriteProducts = useMemo(() => products.filter((p) => favs.has(p.id)), [favs]);

  return (
    <AppLayout>
      <div className="content">
        {tab === "home" ? (
          <>
            <HeaderBar onOpenLocation={openLocation} onOpenNotifications={openNotifications} />
            <SearchSection value={query} onChange={setQuery} onOpenFilters={openFilters} />
            <CategoryHorizontalScroller items={categories} active={category} onSelect={setCategory} />
            <ProductGrid products={visible} onAdd={addToCart} liked={favs} onToggleLike={toggleFav} />
          </>
        ) : tab === "favorite" ? (
          <>
            <HeaderBar onOpenLocation={openLocation} onOpenNotifications={openNotifications} />
            <ProductGrid products={favoriteProducts} onAdd={addToCart} liked={favs} onToggleLike={toggleFav} />
          </>
        ) : (
          <>
            <HeaderBar onOpenLocation={openLocation} onOpenNotifications={openNotifications} />
            <p className="empty">Coming soon</p>
          </>
        )}
      </div>
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
      <CurvedBottomNavigation
        items={navItems}
        active={tab}
        onSelect={setTab}
        cartCount={cart.length}
        onOpenCart={openCart}
      />
    </AppLayout>
  );
}
