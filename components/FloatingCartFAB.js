import { BagIcon } from "./Icons";

export default function FloatingCartFAB({ count = 0, onClick }) {
  return (
    <button type="button" className="fab" aria-label={`Open cart${count ? `, ${count} items` : ""}`} onClick={onClick}>
      <BagIcon />
      {count > 0 && <span className="fab-count">{count}</span>}
    </button>
  );
}
