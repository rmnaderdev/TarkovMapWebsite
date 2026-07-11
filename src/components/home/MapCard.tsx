import Image from "next/image";
import Link from "next/link";
import { MapDefinition } from "@/models/MapDefinition";

export default function MapCard({ map }: { map: MapDefinition }) {
  return (
    <Link
      href={map.link}
      className="group block overflow-hidden rounded-lg border border-olive-700 bg-base-900 transition-colors hover:border-rust-500"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={map.thumbnail}
          alt={map.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white group-hover:text-rust-400">
          {map.navLinkName || map.name}
        </h3>
        {map.credit && (
          <p className="mt-1 text-sm text-gray-400">Map by {map.credit.creditText}</p>
        )}
      </div>
    </Link>
  );
}
