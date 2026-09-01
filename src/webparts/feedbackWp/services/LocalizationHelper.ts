import { WebPartContext } from '@microsoft/sp-webpart-base';

// Maps SharePoint's UI culture prefix to the column-name suffix used in list schemas.
// Extend this if more languages get added later.
const LANGUAGE_COLUMN_SUFFIX: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
};

/**
 * Returns the column-name suffix (e.g. "Spanish") for the current page's language,
 * or undefined if the current language is English (or unsupported/unmapped) —
 * meaning callers should just use the base column value with no suffix.
 */
export function getLanguageSuffix(context: WebPartContext): string | undefined {
  const cultureName = context.pageContext.cultureInfo?.currentUICultureName; // e.g. "es-ES"
  if (!cultureName) {
    return undefined;
  }

  const langCode = cultureName.split('-')[0].toLowerCase();
  return LANGUAGE_COLUMN_SUFFIX[langCode];
}

/**
 * Returns the translated value for the current language if one exists and is
 * non-empty, otherwise falls back to the base (English) value. This handles
 * the expected case where an editor hasn't filled in every translation yet.
 */
export function getLocalizedText(
  baseValue: string,
  translations: Record<string, string | undefined>,
  languageSuffix: string | undefined
): string {
  if (!languageSuffix) {
    return baseValue;
  }

  const translated = translations[languageSuffix];
  return translated && translated.trim().length > 0 ? translated : baseValue;
}