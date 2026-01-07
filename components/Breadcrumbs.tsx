import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-[#C9D1D9]/60 mb-6 font-sans">
      <Link href="/" className="hover:text-white transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <Link
            href={item.href}
            className={`hover:text-white transition-colors uppercase tracking-wide ${
              index === items.length - 1 ? "text-white font-bold" : ""
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}