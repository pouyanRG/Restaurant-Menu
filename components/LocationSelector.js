import { PinIcon } from "./Icons";

export default function LocationSelector({ city }) {
  return (
    <button className="location" aria-label="Change delivery location" type="button">
      <span className="location-pin"><PinIcon /></span>
      <span className="location-text">
        <small>Delivery to</small>
        <strong>{city}</strong>
      </span>
    </button>
  );
}
