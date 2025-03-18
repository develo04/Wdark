'use client';

import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { fallbackLng, languages } from './settings';

i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language, namespace) => 
    import(`../../../public/locales/${language}/${namespace}.json`)
  ))
  .init({
    lng: fallbackLng,
    fallbackLng,
    supportedLngs: languages,
  });

export function useTranslation(lng = fallbackLng, ns = 'common') {
  const [mounted, setMounted] = useState(false);
  const ret = useTranslationOrg(ns);
  const { i18n } = ret;
  
  useEffect(() => {
    if (i18n.resolvedLanguage !== lng) {
      i18n.changeLanguage(lng);
    }
    setMounted(true);
  }, [i18n, lng]);
  
  return {
    ...ret,
    mounted,
  };
}