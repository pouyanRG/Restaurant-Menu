import LocationSelector from "./LocationSelector";
import NotificationButton from "./NotificationButton";

export default function HeaderBar() {
  return (
    <header className="header-bar">
      <LocationSelector city="New York, Us" />
      <NotificationButton />
    </header>
  );
}
