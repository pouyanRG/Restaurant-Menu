"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import HeaderBar from "@/components/HeaderBar";
import NotificationPanel from "@/components/NotificationPanel";
import ProductGrid from "@/components/ProductGrid";
import CurvedBottomNavigation from "@/components/CurvedBottomNavigation";
import ChatSection from "@/components/ChatSection";
import { products, navItems } from "@/data/products";
import { initialNotifications } from "@/data/notifications";
import useFavs from "@/lib/useFavs";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const openSearch = () => setSearching(true);
  const closeSearch = () => { setSearching(false); setQuery(""); };
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

  const openNotifications = () => setNotifOpen(true);
  const closeNotifications = useCallback(() => setNotifOpen(false), []);
  const markAllRead = () => setNotifications((list) => list.map((item) => ({ ...item, read: true })));
  const markOneRead = (id) =>
    setNotifications((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const openLocation = () => showToast("Location picker coming soon");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [query]);

  const favoriteProducts = useMemo(() => products.filter((p) => favs.has(p.id)), [favs]);

  return (
    <AppLayout>
      <div className={`content${tab === "home" ? " menu-content" : ""}`}>
        {tab === "home" ? (
          <>
            <HeaderBar
              menu
              showLocation
              searching={searching}
              query={query}
              onQueryChange={setQuery}
              onOpenSearch={openSearch}
              onCloseSearch={closeSearch}
              onOpenLocation={openLocation}
              onOpenNotifications={openNotifications}
            />
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
