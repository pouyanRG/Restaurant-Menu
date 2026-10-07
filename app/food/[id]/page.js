import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import FoodDetails from "@/components/FoodDetails";
import { getProduct, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = getProduct(id);
  return { title: p ? `${p.name} | Menu` : "Menu" };
}

export default async function FoodPage({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <AppLayout>
      <FoodDetails product={product} />
    </AppLayout>
  );
}