const STORAGE_KEY = "amsterdamografie:language";

export function getLanguage() {
  return localStorage.getItem(STORAGE_KEY) || "nl";
}

export function setLanguage(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}
