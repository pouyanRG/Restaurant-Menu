import WishlistToggle from "./WishlistToggle";
import DiscountBadge from "./DiscountBadge";
import AddToCartCTA from "./AddToCartCTA";

export default function ProductCard({ product, onAdd, liked, onToggleLike }) {
  const final = product.price * (1 - product.discount / 100);

  return (
    <article className={`card glass-card theme-${product.theme}`}>
      <div className="card-top">
        <h3>{product.name}</h3>
        <WishlistToggle label={product.name} on={liked} onToggle={onToggleLike} />
      </div>
      <p className="price">
        ${final.toFixed(2)} <s className="old-price">${product.price.toFixed(2)}</s>
      </p>
      <img className={`card-img ${product.imgClass}`} src={product.image} alt="" draggable="false" />
      <AddToCartCTA label={product.name} onClick={() => onAdd(product)} />
      <DiscountBadge percent={product.discount} />
    </article>
  );
}
