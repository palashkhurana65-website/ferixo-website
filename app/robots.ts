import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db'; // Ensure this points to your DB instance

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // REPLACE with your actual domain
  const baseUrl = 'https://ferixo.com'; 

  // 1. Fetch All Products from Database
  // We grab the ID and updated date to tell Google when content changed
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  // 2. Generate URLs for Products
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Define Static Pages (Home, Shop, Cart)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1, // Homepage is most important
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    // Add other static pages like /about or /contact here if they exist
  ];

  return [...staticRoutes, ...productUrls];
}