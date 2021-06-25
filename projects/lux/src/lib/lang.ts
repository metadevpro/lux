/** Language detector based on Navigator preferences */
export const languageDetector = (): string => {
  const lang = navigator.language.split('-')[0];
  if (lang === 'es' || lang === 'en') {
    return lang;
  }
  return 'en'; // default
};
