"use client";
import Link from "next/link";
import { ChevronRight, HeartIcon } from "./Icons";
import useFavs from "@/lib/useFavs";

export default function FoodDetails({ product }) {
  const [favs, toggleFav] = useFavs();
  const liked = favs.has(product.id);
  const final = product.price * (1 - product.discount / 100);

  return (
    <div className="details">
      <header className="details-top">
        <Link href="/" className="icon-btn glass" aria-label="Back to menu">
          <ChevronRight style={{ transform: "rotate(180deg)" }} />
        </Link>
        <h1>Details</h1>
        <button
          type="button"
          className={`icon-btn glass details-fav${liked ? " is-on" : ""}`}
          aria-pressed={liked}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFav(product.id)}
        >
          <HeartIcon filled={liked} />
        </button>
      </header>

      <img className="details-img" src={product.photo || product.image} alt={product.name} />

      <h2 className="details-name">{product.name}</h2>

      <div className="details-meta">
        <span>⏱ {product.time} min</span>
        <span>⭐ {product.rating}</span>
        <span>🔥 {product.calories} kcal</span>
      </div>

      <p className="details-desc">{product.description}</p>

      <div className="details-chips">
        {product.ingredients.map((i) => <span key={i}>{i}</span>)}
      </div>

      <div className="details-bottom">
        <div>
          <small>Price</small>
          <strong>${final.toFixed(2)}</strong>
        </div>
        <Link href="/" className="details-back">Back to menu</Link>
      </div>
    </div>
  );
}