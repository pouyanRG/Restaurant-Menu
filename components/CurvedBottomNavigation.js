import { HomeIcon, MessageIcon, HeartIcon, SearchIcon } from "./Icons";

function Item({ id, label, active, onSelect }) {
  const icon =
    id === "home" ? <HomeIcon /> :
    id === "message" ? <MessageIcon /> :
    id === "favorite" ? <HeartIcon width="24" height="24" /> :
    <img className="nav-avatar" src="/images/avatar.svg" alt="" />;
  return (
    <button type="button" className={`nav-item${active ? " is-active" : ""}`} aria-label={label} onClick={() => onSelect(id)}>
      <span className="nav-ic">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}

export default function CurvedBottomNavigation({ items, active, onSelect, onSearch }) {
  return (
    <div className="bottom-wrap">
      <nav className="bottom-nav" aria-label="Main navigation">
        {items.map((i) => (
          <Item key={i.id} {...i} active={active === i.id} onSelect={onSelect} />
        ))}
      </nav>
      <button type="button" className="nav-search" aria-label="Search" onClick={onSearch}>
        <SearchIcon width="26" height="26" />
      </button>
    </div>
  );
}