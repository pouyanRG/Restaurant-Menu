"use client";

import { useEffect, useRef } from "react";
import { ChevronRight } from "./Icons";

export default function NotificationPanel({ items, onClose, onMarkAllRead, onItemClick }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  const unread = items.filter((item) => !item.read).length;

  return (
    <div className="np-overlay" onClick={onClose}>
      <section
        className="np-panel glass"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="np-head">
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-btn glass"
            aria-label="Close notifications"
            onClick={onClose}
          >
            <ChevronRight style={{ transform: "rotate(-90deg)" }} />
          </button>
          <h2>
            Notifications {unread > 0 && <span className="np-count">{unread}</span>}
          </h2>
          <button type="button" className="np-mark" onClick={onMarkAllRead} disabled={unread === 0}>
            Mark all read
          </button>
        </header>

        {items.length === 0 ? (
          <p className="empty">No notifications yet.</p>
        ) : (
          <ul className="np-list">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`np-item${item.read ? "" : " is-unread"}`}
                  onClick={() => onItemClick(item.id)}
                >
                  <span className="np-dot" aria-hidden="true" />
                  <span className="np-body">
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                  <time>{item.time}</time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
