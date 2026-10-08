import Link from "next/link";
import WishlistToggle from "./WishlistToggle";
import DiscountBadge from "./DiscountBadge";
import { ChevronRight } from "./Icons";

export default function ProductCard({ product, liked, onToggleLike }) {
  const final = product.price * (1 - product.discount / 100);

  return (
    <article className={`card glass-card theme-${product.theme}`}>
      <Link href={`/food/${product.id}`} className="card-link" aria-label={`View ${product.name}`} />
      <div className="card-top">
        <h3>{product.name}</h3>
        <WishlistToggle label={product.name} on={liked} onToggle={onToggleLike} />
      </div>
      <p className="price">
        ${final.toFixed(2)} <s className="old-price">${product.price.toFixed(2)}</s>
      </p>
      <div className="card-media">
        <img className="card-img" src={product.image} alt="" draggable="false" />
      </div>
      <span className="cta" aria-hidden="true"><ChevronRight /></span>
      <DiscountBadge percent={product.discount} />
    </article>
  );
}
