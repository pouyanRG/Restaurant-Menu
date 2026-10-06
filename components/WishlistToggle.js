import { HeartIcon } from "./Icons";

export default function WishlistToggle({ label, on, onToggle }) {
  return (
    <button
      type="button"
      className={`wish${on ? " is-on" : ""}`}
      aria-label={`${on ? "Remove" : "Add"} ${label} ${on ? "from" : "to"} favorites`}
      aria-pressed={on}
      onClick={onToggle}
    >
      <HeartIcon filled={on} />
    </button>
  );
}
