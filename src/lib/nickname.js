const STORAGE_KEY = "amsterdamografie:nickname";

export function getNickname() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

export function setNickname(name) {
  localStorage.setItem(STORAGE_KEY, name);
}
