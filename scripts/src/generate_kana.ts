import fs from "fs/promises";
import path from "path";
import { default as ainu } from "ainu-utils";

const PROTECTED_TOKENS = /(%(?:\d+\$)?[sdf]|\b[A-Z]+\b|-\{[^}]+\}-)/;

function safeConvertToKana(text: string) {
  const normalized = text.replace(/’/g, "'");

  return normalized
    .split(PROTECTED_TOKENS)
    .map((part) => {
      if (PROTECTED_TOKENS.test(part)) {
        return part;
      }
      return ainu.to_kana(part);
    })
    .join("");
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
