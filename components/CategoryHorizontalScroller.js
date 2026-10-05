export default function CategoryHorizontalScroller({ items, active, onSelect }) {
  return (
    <nav className="chips" aria-label="Food categories">
      {items.map((c) => (
        <button
          key={c}
          type="button"
          className={`chip${c === active ? " is-active" : ""}`}
          aria-pressed={c === active}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </nav>
  );
}
