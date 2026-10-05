import { StatusIcons } from "./Icons";

// Decorative iOS-style status bar (matches the design mockup). Remove from layout on real devices.
export default function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span className="status-time">9:41</span>
      <span className="status-island" />
      <StatusIcons />
    </div>
  );
}
