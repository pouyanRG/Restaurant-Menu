import { BellIcon } from "./Icons";

export default function NotificationButton({ onClick }) {
  return (
    <button className="icon-btn glass" aria-label="Notifications" type="button" onClick={onClick}>
      <BellIcon />
    </button>
  );
}
