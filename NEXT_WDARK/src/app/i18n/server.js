import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, languages } from './settings';

const initI18next = async (lng = fallbackLng, ns = 'common') => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => 
      import(`../../../public/locales/${language}/${namespace}.json`)
    ))
    .init({
      lng,
      fallbackLng,
      ns,
      defaultNS: 'common',
      supportedLngs: languages,
    });
  return i18nInstance;
};

export async function useTranslation(lng, ns = 'common') {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns),
    i18n: i18nextInstance,
  };
}