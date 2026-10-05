import { SearchIcon } from "./Icons";
import FilterModalTrigger from "./FilterModalTrigger";

export default function SearchSection({ value, onChange }) {
  return (
    <div className="search glass">
      <SearchIcon className="search-lead" />
      <input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search food"
      />
      <FilterModalTrigger />
    </div>
  );
}
