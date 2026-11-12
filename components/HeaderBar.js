import MorphHeaderRow from "./MorphHeaderRow";
import NotificationButton from "./NotificationButton";
import { ChevronRight } from "./Icons";

export default function HeaderBar({
  onOpenLocation,
  onOpenNotifications,
  showLocation,
  onBack,
  menu = false,
  searching = false,
  query = "",
  onQueryChange,
  onOpenSearch,
  onCloseSearch,
  children
}) {
  return (
    <header className={`header-bar${menu ? " menu-header" : ""}`}>
      {showLocation ? (
        <MorphHeaderRow
          city="New York, Us"
          searching={searching}
          query={query}
          onQueryChange={onQueryChange}
          onOpenSearch={onOpenSearch}
          onCloseSearch={onCloseSearch}
          onOpenLocation={onOpenLocation}
          onOpenNotifications={onOpenNotifications}
        />
      ) : (
        <div className="header-row">
          <button type="button" className="icon-btn glass" aria-label="Back to menu" onClick={onBack}>
            <ChevronRight style={{ transform: "rotate(180deg)" }} />
          </button>
          <NotificationButton onClick={onOpenNotifications} />
        </div>
      )}
      {children}
    </header>
  );
}