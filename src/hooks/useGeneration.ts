import { useState, useCallback, useRef } from 'react';
import type { Platform, ContentType, HookResult, AppError, GenerationStatus } from '../types';
import { generateHooks } from '../utils/api';

interface UseGenerationReturn {
  topic: string;
  platform: Platform;
  contentType: ContentType;
  results: HookResult[];
  status: GenerationStatus;
  error: AppError | null;
  setTopic: (v: string) => void;
  setPlatform: (p: Platform) => void;
  setContentType: (c: ContentType) => void;
  generate: () => void;
  reset: () => void;
}

export function useGeneration(): UseGenerationReturn {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('xiaohongshu');
  const [contentType, setContentType] = useState<ContentType>('video');
  const [results, setResults] = useState<HookResult[]>([]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<AppError | null>(null);
  const generating = useRef(false);

  const generate = useCallback(() => {
    const trimmed = topic.trim();
    if (trimmed.length < 2 || generating.current) return;

    generating.current = true;
    setStatus('loading');
    setError(null);

    generateHooks({ topic: trimmed, platform, contentType })
      .then((data) => {
        setResults(data);
        setStatus('success');
        generating.current = false;
      })
      .catch((e: AppError) => {
        setError(e);
        setStatus('error');
        generating.current = false;
      });
  }, [topic, platform, contentType]);

  const reset = useCallback(() => {
    setTopic('');
    setStatus('idle');
    setError(null);
    setResults([]);
  }, []);

  return {
    topic, platform, contentType, results, status, error,
    setTopic: (v) => setTopic(v.slice(0, 100)),
    setPlatform, setContentType, generate, reset,
  };
}
