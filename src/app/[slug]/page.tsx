import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Maps } from "@/data/maps";
import MapContainer from "@/components/map/MapContainer";

function slugFor(link: string) {
  return link.replace(/^\//, "");
}

function findMap(slug: string) {
  return Maps.find((map) => slugFor(map.link) === slug);
}

export function generateStaticParams() {
  return Maps.map((map) => ({ slug: slugFor(map.link) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const map = findMap(slug);
  return { title: map ? `Map - ${map.name}` : "Tarkov Maps" };
}

export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const map = findMap(slug);

  if (!map) {
    notFound();
  }

  return (
    <>
      <h1 className="page-heading">{map.name}</h1>
      <MapContainer key={slug} mapUrl={map.img} mapCredit={map.credit} />
    </>
  );
}
