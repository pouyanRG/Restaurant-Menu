import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAdd }) {
  return (
    <section className="grid" aria-label="Products">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </section>
  );
}
