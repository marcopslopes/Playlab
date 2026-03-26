import en from '../../locales/en.json';
import pt from '../../locales/pt.json';
import es from '../../locales/es.json';
import ca from '../../locales/ca.json';
import { useSettings } from '../contexts/settings-context';

type Language = 'en' | 'pt' | 'es' | 'ca';

const locales: Record<Language, Record<string, unknown>> = { en, pt, es, ca };

function resolve(obj: Record<string, unknown>, key: string): string {
  const value = key.split('.').reduce<unknown>((o, k) => {
    if (o && typeof o === 'object') return (o as Record<string, unknown>)[k];
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : key;
}

export function useTranslation() {
  const { language } = useSettings();
  const translations = locales[language] ?? locales.en;

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = resolve(translations as Record<string, unknown>, key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return { t };
}
