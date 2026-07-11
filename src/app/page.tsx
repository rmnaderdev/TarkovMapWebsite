import { Maps } from "@/data/maps";
import MapCard from "@/components/home/MapCard";

export default function Home() {
  return (
    <>
      <h1 className="page-heading">Tarkov Maps</h1>
      <p>Maps updated as of game version <b>1.0.6.0.46010</b></p>
      <p>Welcome to a Tarkov map site. It is very much a WIP.</p>
      <p className="mt-3">
        I created this site to make it easier to navigate between Tarkov maps
        and to have them all in one place. I take no credit for the creation of
        any of these maps. All credit goes to the original map creators.{" "}
        <b>
          You can find a link to their work in the bottom right corner of each
          map.
        </b>
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Maps.map((map) => (
          <MapCard key={map.name} map={map} />
        ))}
      </div>

      <p className="mt-8 font-light">
        Created by a dude who doesn&apos;t want to pay for MapGenie.
      </p>
      {/* GitHub Link */}
      <p className="mt-2">
        <a
          href="https://github.com/rmnaderdev/TarkovMapWebsite"
          target="_blank"
          rel="noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/github/stars/rmnaderdev/TarkovMapWebsite?style=social"
            alt="GitHub Stars"
          />
        </a>
      </p>
    </>
  );
}
