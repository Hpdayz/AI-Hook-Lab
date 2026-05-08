import { useState, useCallback } from 'react';
import type { GenerationRecord } from '../types';
import { getHistory, addHistory, removeHistory, clearHistory } from '../utils/storage';

interface UseHistoryReturn {
  history: GenerationRecord[];
  add: (record: GenerationRecord) => void;
  remove: (id: string) => void;
  clear: () => void;
  refresh: () => void;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<GenerationRecord[]>(getHistory);

  const add = useCallback((record: GenerationRecord) => {
    addHistory(record);
    setHistory(prev => [record, ...prev].slice(0, 50));
  }, []);

  const remove = useCallback((id: string) => {
    removeHistory(id);
    setHistory(prev => prev.filter(r => r.id !== id));
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const refresh = useCallback(() => setHistory(getHistory()), []);

  return { history, add, remove, clear, refresh };
}
