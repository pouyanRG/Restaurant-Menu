import { ChevronRight } from "./Icons";

export default function AddToCartCTA({ label, onClick }) {
  return (
    <button type="button" className="cta" aria-label={`Add ${label} to cart`} onClick={onClick}>
      <ChevronRight />
    </button>
  );
}
