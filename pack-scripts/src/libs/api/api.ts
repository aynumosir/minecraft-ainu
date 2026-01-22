import { AssetIndex } from "./asset_index.js";
import { Package } from "./package.js";
import { VersionManifest } from "./version_manifest.js";

const VERSION_MANIFEST_URL = new URL("https://launchermeta.mojang.com/mc/game/version_manifest.json");

const fetchVersionManifest = async (): Promise<VersionManifest> => {
  const res = await fetch(VERSION_MANIFEST_URL);
  const data = await res.json();
  return data as VersionManifest;
}

export const fetchLatestPackage = async (): Promise<Package> => {
  const versionManifest = await fetchVersionManifest();

  const id = versionManifest.latest.release;
  const version = versionManifest.versions.find((version) => version.id === id)!;

  const res = await fetch(version.url);
  const data = await res.json();

  return data as Package;;
}

export const fetchLatestAssetIndex = async (): Promise<AssetIndex> => {
  const pkg = await fetchLatestPackage();
  const res = await fetch(pkg.assetIndex.url);
  const data = await res.json();

  return data as AssetIndex;
}

export const fetchAsset = async (hash: string): Promise<Blob> => {
  const url = new URL(`${hash.slice(0, 2)}/${hash}`, "https://resources.download.minecraft.net");
  const res = await fetch(url);
  const data = await res.blob();

  return data;
}

export const fetchLatestClientJar = async (): Promise<Blob> => {
  const pkg = await fetchLatestPackage();
  const res = await fetch(pkg.downloads.client.url);
  return res.blob();
}

