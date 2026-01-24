import fs from "fs/promises";
import path from "path";
import { default as ainu } from "ainu-utils";
import { fileURLToPath } from "url";

export const PROTECTED_TOKENS = /(%(?:\d+\$)?[sdf]|\b[A-Z]+\b|-\{[^}]+\}-)/;

export function stripEscapeMarkers(text: string) {
  return text.replace(/’/g, "'").replace(/-\{([^}]+)\}-/g, "$1");
}

export function safeConvertToKana(text: string) {
  const normalized = text.replace(/’/g, "'");

  return normalized
    .split(PROTECTED_TOKENS)
    .map((part) => {
      if (part.startsWith("-{") && part.endsWith("}-")) {
        return part.slice(2, -2);
      }
      if (PROTECTED_TOKENS.test(part)) {
        return part;
      }
      return ainu.to_kana(part);
    })
    .join("");
}

async function main() {
  const base = process.argv[2];

  const latnPath = path.join(base, "assets/minecraft/lang/ain_latn.json");
  const latnJson = await fs.readFile(latnPath, "utf-8");
  const latn = JSON.parse(latnJson);

  const cleanedLatn = Object.fromEntries(
    Object
      .entries(latn)
      .map(([key, value]) => [key, stripEscapeMarkers(value as string)])
  );
  const cleanedLatnJson = JSON.stringify(cleanedLatn, null, 2);
  await fs.writeFile(latnPath, cleanedLatnJson, "utf-8");

  const kana = Object.fromEntries(
    Object
      .entries(cleanedLatn)
      .map(([key, value]) => [key, safeConvertToKana(value as string)])
  );
  const kanaJson = JSON.stringify(kana, null, 2);
  const kanaPath = path.join(base, "assets/minecraft/lang/ain_kana.json");

  await fs.writeFile(kanaPath, kanaJson, "utf-8");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
