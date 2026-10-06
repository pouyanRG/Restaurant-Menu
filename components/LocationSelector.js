import { PinIcon } from "./Icons";

export default function LocationSelector({ city, onClick }) {
  return (
    <button className="location" aria-label="Change delivery location" type="button" onClick={onClick}>
      <span className="location-pin"><PinIcon /></span>
      <span className="location-text">
        <small>Delivery to</small>
        <strong>{city}</strong>
      </span>
    </button>
  );
}
