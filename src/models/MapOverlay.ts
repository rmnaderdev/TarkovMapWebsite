export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

export type ExtractFaction = "pmc" | "scav" | "shared";

export interface MapExtract {
  id: string;
  name: string;
  faction: ExtractFaction;
  position: WorldPosition;
}

export interface MapBossZone {
  position: WorldPosition;
  categories: string[];
  sides: string[];
  zoneName: string;
}

export interface MapBossSpawnLocation {
  name: string;
  chance: number;
}

export interface MapBoss {
  boss: { name: string };
  spawnChance: number;
  spawnLocations: MapBossSpawnLocation[];
}

export interface MapHazard {
  hazardType: string;
  name: string;
  position: WorldPosition;
  top: number;
  bottom: number;
}

export interface MapLootContainer {
  lootContainer: { name: string; normalizedName: string };
  position: WorldPosition;
}

export interface MapOverlayData {
  fetchedAt: string;
  transform: [number, number, number, number];
  coordinateRotation: number;
  viewBox: [number, number];
  extracts: MapExtract[];
  bossZones: MapBossZone[];
  bosses: MapBoss[];
  hazards: MapHazard[];
  lootContainers: MapLootContainer[];
}
