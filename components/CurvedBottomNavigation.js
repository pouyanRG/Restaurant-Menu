import { HomeIcon, MessageIcon, HeartIcon } from "./Icons";

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

export default function CurvedBottomNavigation({ items, active, onSelect }) {
  const left = items.slice(0, 2);
  const right = items.slice(2);
  return (
    <div className="bottom-wrap">
      <nav className="bottom-nav" aria-label="Main navigation">
        <div className="nav-group">{left.map((i) => <Item key={i.id} {...i} active={active === i.id} onSelect={onSelect} />)}</div>
        <div className="nav-group">{right.map((i) => <Item key={i.id} {...i} active={active === i.id} onSelect={onSelect} />)}</div>
      </nav>
    </div>
  );
}
