import en from "./messages/en.json";
import id from "./messages/id.json";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries = { en, id };

export type ClientDictionary = typeof en;

export function getClientDictionary(locale: string): ClientDictionary {
  const safe: Locale = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}
