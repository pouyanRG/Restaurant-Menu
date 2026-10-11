import LocationSelector from "./LocationSelector";
import NotificationButton from "./NotificationButton";
import { ChevronRight } from "./Icons";

export default function HeaderBar({ onOpenLocation, onOpenNotifications, showLocation, onBack }) {
  return (
    <header className="header-bar">
      {showLocation ? (
        <LocationSelector city="New York, Us" onClick={onOpenLocation} />
      ) : (
        <button type="button" className="icon-btn glass" aria-label="Back to menu" onClick={onBack}>
          <ChevronRight style={{ transform: "rotate(180deg)" }} />
        </button>
      )}
      <NotificationButton onClick={onOpenNotifications} />
    </header>
  );
}
