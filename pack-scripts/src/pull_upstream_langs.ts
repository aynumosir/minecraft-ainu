import fs from "fs/promises";
import AdmZip from "adm-zip";

import { fetchAsset, fetchLatestAssetIndex, fetchLatestClientJar } from "./libs/api/index.js";

const jarBlob = await fetchLatestClientJar();
const jarBuffer = Buffer.from(await jarBlob.arrayBuffer());
const clientJar = new AdmZip(jarBuffer);

const en_us = clientJar.getEntry("assets/minecraft/lang/en_us.json");
await fs.writeFile("en_us.json", en_us?.getData(), "utf-8");

const assetIndex = await fetchLatestAssetIndex();
const ja_jpHash = assetIndex.objects["minecraft/lang/ja_jp.json"].hash;
const ja_jp = await fetchAsset(ja_jpHash);
await fs.writeFile("ja_jp.json", await ja_jp.text(), "utf-8");

