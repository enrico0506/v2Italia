import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/shop`, lastModified: now },
    { url: `${baseUrl}/about`, lastModified: now },
    { url: `${baseUrl}/support`, lastModified: now },
    { url: `${baseUrl}/legal/terms`, lastModified: now },
    { url: `${baseUrl}/legal/privacy`, lastModified: now },
    { url: `${baseUrl}/legal/cookies`, lastModified: now },
    { url: `${baseUrl}/legal/returns`, lastModified: now },
    { url: `${baseUrl}/legal/shipping`, lastModified: now },
    ...products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
