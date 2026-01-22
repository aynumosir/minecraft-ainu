import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";

import { fetchAsset, fetchLatestAssetIndex, fetchLatestClientJar, fetchLatestPackage, fetchVersionManifest } from "./libs/api/index.js";

const versionManifest = await fetchVersionManifest();
console.info(`Pulling Minecraft ${versionManifest.latest.release}`);

const pkg = await fetchLatestPackage(versionManifest);
const jarBlob = await fetchLatestClientJar(pkg);
const jarBuffer = Buffer.from(await jarBlob.arrayBuffer());
const clientJar = new AdmZip(jarBuffer);

const outdir = process.argv[2];

const en_us = clientJar.getEntry("assets/minecraft/lang/en_us.json");
if (!en_us) {
  console.error("No en_us.json found");
} else {
  const filepath = path.resolve(outdir, "assets/minecraft/lang/en_us.json");
  await fs.writeFile(filepath, en_us.getData(), "utf-8");
  console.info(`Craeted ${filepath}`);
}

const assetIndex = await fetchLatestAssetIndex(versionManifest);
const ja_jpAssetIndex = assetIndex.objects["minecraft/lang/ja_jp.json"];
if (!ja_jpAssetIndex) {
  console.error("No ja_jp.json found");
} else {
  const hash = ja_jpAssetIndex.hash;
  const ja_jp = await fetchAsset(hash);
  const filepath = path.resolve(outdir, "assets/minecraft/lang/ja_jp.json");
  await fs.writeFile(filepath, await ja_jp.text(), "utf-8");
  console.info(`Craeted ${filepath}`);
}

