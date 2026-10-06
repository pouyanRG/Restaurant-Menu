import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAdd, liked, onToggleLike }) {
  if (!products.length) {
    return <p className="empty">Nothing found. Try another search or category.</p>;
  }

  return (
    <section className="grid" aria-label="Products">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAdd={onAdd}
          liked={liked.has(p.id)}
          onToggleLike={() => onToggleLike(p.id)}
        />
      ))}
    </section>
  );
}
