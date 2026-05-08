import type { GenerationRecord, HookResult } from '../types';

const KEYS = {
  API_KEY: 'ai-hook-lab-key',
  HISTORY: 'ai-hook-lab-history',
  BOOKMARKS: 'ai-hook-lab-bookmarks',
} as const;

// ---- API Key ----
export function getApiKey(): string {
  return localStorage.getItem(KEYS.API_KEY) || '';
}
export function setApiKey(key: string): void {
  localStorage.setItem(KEYS.API_KEY, key.trim());
}
export function clearApiKey(): void {
  localStorage.removeItem(KEYS.API_KEY);
}

// ---- History ----
export function getHistory(): GenerationRecord[] {
  try { return JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]'); }
  catch { return []; }
}
export function addHistory(record: GenerationRecord): void {
  try {
    const list = getHistory();
    list.unshift(record);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(list.slice(0, 50)));
  } catch { /* quota exceeded, silently skip */ }
}
export function removeHistory(id: string): void {
  const list = getHistory().filter(r => r.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(list));
}
export function clearHistory(): void {
  localStorage.setItem(KEYS.HISTORY, '[]');
}

// ---- Bookmarks (single hooks) ----
export function getBookmarks(): HookResult[] {
  try { return JSON.parse(localStorage.getItem(KEYS.BOOKMARKS) || '[]'); }
  catch { return []; }
}
export function addBookmark(hook: HookResult): void {
  try {
    const list = getBookmarks();
    if (!list.find(b => b.id === hook.id)) {
      list.unshift(hook);
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(list));
    }
  } catch { /* quota exceeded */ }
}
export function removeBookmark(id: string): void {
  const list = getBookmarks().filter(b => b.id !== id);
  localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(list));
}
export function isBookmarked(id: string): boolean {
  return getBookmarks().some(b => b.id === id);
}
