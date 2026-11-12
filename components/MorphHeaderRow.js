"use client";
import { useRef } from "react";
import { BellIcon, ChevronRight, PinIcon, SearchIcon } from "./Icons";

export default function MorphHeaderRow({
  city,
  searching,
  query,
  onQueryChange,
  onOpenSearch,
  onCloseSearch,
  onOpenLocation,
  onOpenNotifications
}) {
  const inputRef = useRef(null);

  const handleOpen = () => {
    onOpenSearch();
    // باید داخل همین کلیک فوکوس شود تا کیبورد iOS باز شود
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={`header-row morph-row${searching ? " is-searching" : ""}`}>
      <div className="location-bar">
        {/* حالت عادی: انتخاب لوکیشن | حالت جستجو: دکمه‌ی برگشت */}
        <button
          type="button"
          className="location-pin location-toggle"
          aria-label={searching ? "Close search" : "Change delivery location"}
          onClick={searching ? onCloseSearch : onOpenLocation}
        >
          <span className="pin-ic pin-ic-pin"><PinIcon /></span>
          <span className="pin-ic pin-ic-back">
            <ChevronRight style={{ transform: "rotate(180deg)" }} />
          </span>
        </button>

        <div className="location-text">
          <button
            type="button"
            className="location-label"
            tabIndex={searching ? -1 : 0}
            onClick={onOpenLocation}
          >
            <small>Restaurant address</small>
            <strong>{city}</strong>
          </button>

          <div className="location-search">
            <SearchIcon width="20" height="20" />
            <input
              ref={inputRef}
              id="menu-search"
              type="search"
              placeholder="Search..."
              autoComplete="off"
              aria-label="Search food"
              tabIndex={searching ? 0 : -1}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") onCloseSearch(); }}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                tabIndex={searching ? 0 : -1}
                onClick={() => { onQueryChange(""); inputRef.current?.focus(); }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* دکمه‌ی دو بخشی: چپ = سرچ ، راست = نوتیف */}
      <div className="duo" role="group" aria-label="Quick actions">
        <button type="button" className="duo-btn" aria-label="Search" onClick={handleOpen}>
          <SearchIcon />
        </button>
        <span className="duo-sep" aria-hidden="true" />
        <button type="button" className="duo-btn" aria-label="Notifications" onClick={onOpenNotifications}>
          <BellIcon />
        </button>
      </div>
    </div>
  );
}