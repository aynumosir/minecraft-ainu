import fs from "fs/promises";
import path from "path";
import { default as ainu } from "ainu-utils";

const VARIABLE = /%(\d\$)?[sdf]{1}/g;
const SAFE_VARIABLE = /\$([0-9]+)/g;

function safeConvertToKana(text: string) {
  const counter = 0;
  const registry = new Map<string, string>();

  let safeText = text.replace(VARIABLE, (match) => {
    const key = `$${counter}`;
    registry.set(key, match);
    return key;
  });
  safeText = safeText.replace(/’/g, "'");

  const kana = ainu.to_kana(safeText);

  return kana.replace(SAFE_VARIABLE, (match, p1) => {
    return registry.get(`$${p1}`) ?? match;
  });
}

const base = process.argv[2];

const latnPath = path.join(base, "assets/minecraft/lang/ain_latn.json");
const latnJson = await fs.readFile(latnPath, "utf-8");
const latn = JSON.parse(latnJson);

const kana = Object.fromEntries(
  Object
    .entries(latn)
    .map(([key, value]) => [key, safeConvertToKana(value as string)])
);
const kanaJson = JSON.stringify(kana, null, 2);
const kanaPath = path.join(base, "assets/minecraft/lang/ain_kana.json");

await fs.writeFile(kanaPath, kanaJson, "utf-8");

