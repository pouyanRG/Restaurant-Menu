import ProductCard from "./ProductCard";

export default function ProductGrid({ products, liked, onToggleLike }) {
  if (!products.length) {
    return <p className="empty">Nothing found. Try another search or category.</p>;
  }

  const sortedProducts = [...products].sort((a, b) => a.id - b.id);

  return (
    <section className="grid" aria-label="Products">
      {sortedProducts.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          liked={liked.has(p.id)}
          onToggleLike={() => onToggleLike(p.id)}
        />
      ))}
    </section>
  );
}



