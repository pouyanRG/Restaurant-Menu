import LocationSelector from "./LocationSelector";
import NotificationButton from "./NotificationButton";

export default function HeaderBar({ onOpenLocation, onOpenNotifications }) {
  return (
    <header className="header-bar">
      <LocationSelector city="New York, Us" onClick={onOpenLocation} />
      <NotificationButton onClick={onOpenNotifications} />
    </header>
  );
}
