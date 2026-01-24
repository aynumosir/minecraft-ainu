import { describe, expect, it } from "vitest";
import { safeConvertToKana } from "./generate_kana";

describe("safeConvertToKana", () => {
  it("keeps protected text but strips escape markers", () => {
    const input = "-{Copyright}- Aynumosir. iteki eymek yan!";
    const output = safeConvertToKana(input);

    expect(output).toBe("Copyright　アイヌモシㇼ。　イテキ　エイメㇰ　ヤン！");
  });

  it("keeps protected format tokens unchanged", () => {
    const input = "%s a=rayke wa isam";
    const output = safeConvertToKana(input);

    expect(output).toBe("%s　アライケ　ワ　イサㇺ");
  });

  it("keeps numbered format tokens unchanged", () => {
    const input = "%1$s itokpa %2$s";
    const output = safeConvertToKana(input);

    expect(output).toBe("%1$s　イトㇰパ　%2$s");
  });

  it("keeps acronyms and converts surrounding words", () => {
    const input = "LAN or ta maka";
    const output = safeConvertToKana(input);

    expect(output).toBe("LAN　オㇿ　タ　マカ");
  });
});
