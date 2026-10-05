import WishlistToggle from "./WishlistToggle";
import DiscountBadge from "./DiscountBadge";
import AddToCartCTA from "./AddToCartCTA";

export default function ProductCard({ product, onAdd }) {
  return (
    <article className={`card glass-card theme-${product.theme}`}>
      <div className="card-top">
        <h3>{product.name}</h3>
        <WishlistToggle label={product.name} />
      </div>
      <p className="price">${product.price.toFixed(2)}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`card-img ${product.imgClass}`} src={product.image} alt={product.name} draggable="false" />
      <AddToCartCTA label={product.name} onClick={() => onAdd(product)} />
      <DiscountBadge percent={product.discount} />
    </article>
  );
}
