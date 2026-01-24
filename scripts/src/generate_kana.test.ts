import { describe, expect, it } from "bun:test";
import { safeConvertToKana } from "./generate_kana";

describe("safeConvertToKana", () => {
  it("keeps protected text but strips escape markers", () => {
    const input = "-{Copyright}- Aynumosir. iteki eymek yan!";
    const output = safeConvertToKana(input);

    expect(output).toBe("Copyright　アイヌモシㇼ。　イテキ　エイメㇰ　ヤン！");
  });

  it("keeps protected format tokens unchanged", () => {
    const input = "%s TEST";
    const output = safeConvertToKana(input);

    expect(output).toBe("%s　TEST");
  });

  it("keeps acronyms and converts surrounding words", () => {
    const input = "LAN or ta maka";
    const output = safeConvertToKana(input);

    expect(output).toBe("LAN　オㇿ　タ　マカ");
  });
});
