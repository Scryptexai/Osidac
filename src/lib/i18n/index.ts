import "server-only";
import { defaultLocale, isLocale, type Locale } from "./config";
import en from "./messages/en.json";
import id from "./messages/id.json";

const dictionaries = { en, id };

export type Dictionary = typeof en;

export async function getDictionary(locale: string): Promise<Dictionary> {
  const safe: Locale = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}
