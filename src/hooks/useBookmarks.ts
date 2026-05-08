import { useState, useCallback } from 'react';
import type { HookResult } from '../types';
import { getBookmarks, addBookmark, removeBookmark } from '../utils/storage';

interface UseBookmarksReturn {
  bookmarks: HookResult[];
  toggle: (hook: HookResult) => boolean;
  isBookmarked: (id: string) => boolean;
  refresh: () => void;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<HookResult[]>(getBookmarks);

  const toggle = useCallback((hook: HookResult): boolean => {
    if (bookmarks.some(b => b.id === hook.id)) {
      removeBookmark(hook.id);
      setBookmarks(prev => prev.filter(b => b.id !== hook.id));
      return false;
    } else {
      addBookmark(hook);
      setBookmarks(prev => [hook, ...prev]);
      return true;
    }
  }, [bookmarks]);

  const isBookmarkedFn = useCallback((id: string) => {
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const refresh = useCallback(() => setBookmarks(getBookmarks()), []);

  return { bookmarks, toggle, isBookmarked: isBookmarkedFn, refresh };
}
