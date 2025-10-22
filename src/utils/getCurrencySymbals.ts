// utils/currency.ts
export function getCurrencySymbol(code: string): string {
  if (!code) return "";

  const map: Record<string, string> = {
    usd: "$",    // US Dollar
    eur: "€",    // Euro
    gbp: "£",    // British Pound
    jpy: "¥",    // Japanese Yen
    aud: "a$",   // Australian Dollar
    cad: "c$",   // Canadian Dollar
    chf: "chf",  // Swiss Franc
    cny: "¥",    // Chinese Yuan
    hkd: "hk$",  // Hong Kong Dollar
    nzd: "nz$",  // New Zealand Dollar
    sek: "kr",   // Swedish Krona
    krw: "₩",    // South Korean Won
    sgd: "s$",   // Singapore Dollar
    nok: "kr",   // Norwegian Krone
    mxn: "mex$", // Mexican Peso
    inr: "₹",    // Indian Rupee
    rub: "₽",    // Russian Ruble
    zar: "r",    // South African Rand
    try: "₺",    // Turkish Lira
    brl: "r$",   // Brazilian Real

    // 🔹 Riyal / Rial
    sar: "﷼",    // Saudi Riyal
    qar: "﷼",    // Qatari Riyal
    omr: "﷼",    // Omani Rial

    // 🔹 Dinar
    kwd: "kd",   // Kuwaiti Dinar
    bhd: "bd",   // Bahraini Dinar
    jod: "jd",   // Jordanian Dinar
    iqd: "ع.د",  // Iraqi Dinar

    // 🔹 Extra (common in hotels/travel)
    aed: "د.إ",  // UAE Dirham
    egp: "£",    // Egyptian Pound
    lkr: "₨",    // Sri Lankan Rupee
  };

  return map[code.toLowerCase()] || code;
}
