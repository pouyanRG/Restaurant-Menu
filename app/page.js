"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import HeaderBar from "@/components/HeaderBar";
import NotificationPanel from "@/components/NotificationPanel";
import SearchSection from "@/components/SearchSection";
import CategoryHorizontalScroller from "@/components/CategoryHorizontalScroller";
import ProductGrid from "@/components/ProductGrid";
import CurvedBottomNavigation from "@/components/CurvedBottomNavigation";
import ChatSection from "@/components/ChatSection";
import { categories, products, navItems } from "@/data/products";
import { initialNotifications } from "@/data/notifications";
import useFavs from "@/lib/useFavs";

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 1600);
  };

  const [favs, toggleFav] = useFavs();

  const openFilters = () => showToast("Filters coming soon");
  const openNotifications = () => setNotifOpen(true);
  const closeNotifications = useCallback(() => setNotifOpen(false), []);
  const markAllRead = () => setNotifications((list) => list.map((item) => ({ ...item, read: true })));
  const markOneRead = (id) =>
    setNotifications((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const openLocation = () => showToast("Location picker coming soon");

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
            <HeaderBar showLocation onOpenLocation={openLocation} onOpenNotifications={openNotifications} />
            <SearchSection value={query} onChange={setQuery} onOpenFilters={openFilters} />
            <CategoryHorizontalScroller items={categories} active={category} onSelect={setCategory} />
            <ProductGrid products={visible} liked={favs} onToggleLike={toggleFav} />
          </>
        ) : tab === "favorite" ? (
          <>
            <HeaderBar showLocation={false} onBack={() => setTab("home")} onOpenNotifications={openNotifications} />
            <ProductGrid products={favoriteProducts} liked={favs} onToggleLike={toggleFav} />
          </>
        ) : tab === "message" ? (
          <>
            <HeaderBar showLocation={false} onBack={() => setTab("home")} onOpenNotifications={openNotifications} />
            <ChatSection />
          </>
        ) : (
          <>
            <HeaderBar showLocation={false} onBack={() => setTab("home")} onOpenNotifications={openNotifications} />
            <p className="empty">Coming soon</p>
          </>
        )}
      </div>
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
      {tab !== "message" && (
        <CurvedBottomNavigation items={navItems} active={tab} onSelect={setTab} />
      )}
      {notifOpen && (
        <NotificationPanel
          items={notifications}
          onClose={closeNotifications}
          onMarkAllRead={markAllRead}
          onItemClick={markOneRead}
        />
      )}
    </AppLayout>
  );
}
