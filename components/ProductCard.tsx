import Link from "next/link";
import Image from "next/image";

// Define the exact shape of your Database Product
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    series: string;
    basePrice: number;      // Matches DB
    images: { url: string }[]; // Matches DB Relation
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Safe check to get the first image URL or use a placeholder
  const mainImage = product.images?.[0]?.url || "/placeholder.jpg";

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square bg-[#133159] rounded-xl overflow-hidden mb-4 border border-white/5 group-hover:border-white/20 transition-colors">
        {/* Product Image */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white font-bold text-lg group-hover:text-[#C9D1D9] transition-colors">
          {product.name}
        </h3>
        <p className="text-[#C9D1D9] opacity-70 text-sm">{product.series}</p>
        <p className="text-white font-mono">₹{product.basePrice.toLocaleString()}</p>
      </div>
    </Link>
  );
}