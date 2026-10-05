import { FilterIcon } from "./Icons";

export default function FilterModalTrigger({ onClick }) {
  return (
    <button className="search-trail" aria-label="Open filters" type="button" onClick={onClick}>
      <FilterIcon />
    </button>
  );
}
