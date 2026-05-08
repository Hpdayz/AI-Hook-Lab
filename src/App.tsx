import { useMemo, useState, useEffect, useRef } from 'react';
import type { HookResult, GenerationRecord } from './types';
import { getApiKey } from './utils/storage';
import { useGeneration } from './hooks/useGeneration';
import { useBookmarks } from './hooks/useBookmarks';
import { useHistory } from './hooks/useHistory';
import { showToast } from './components/Toast';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import HookGrid from './components/HookGrid';
import ApiKeyModal from './components/ApiKeyModal';
import HistoryModal from './components/HistoryModal';

export default function App() {
  const gen = useGeneration();
  const bm = useBookmarks();
  const hist = useHistory();

  const [showApiModal, setShowApiModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const bookmarkedIds = useMemo(() => new Set(bm.bookmarks.map(b => b.id)), [bm.bookmarks]);

  // Auto-write to history when generation succeeds
  const prevStatus = useRef(gen.status);
  useEffect(() => {
    if (gen.status === 'success' && prevStatus.current === 'loading') {
      const record: GenerationRecord = {
        id: `gen-${Date.now()}`,
        request: { topic: gen.topic, platform: gen.platform, contentType: gen.contentType },
        results: gen.results,
        timestamp: Date.now(),
      };
      hist.add(record);
    }
    prevStatus.current = gen.status;
  }, [gen.status, gen.results, gen.topic, gen.platform, gen.contentType, hist]);

  const handleGenerate = () => {
    const apiKey = getApiKey();
    if (!apiKey) { setShowApiModal(true); return; }
    gen.generate();
  };

  const handleCopy = (_hook: HookResult) => {
    // copy handled inside HookCard
  };

  const handleCopyAll = () => {
    const text = gen.results.map(r => r.hook).join('\n\n');
    navigator.clipboard.writeText(text).then(
      () => showToast('已复制全部', 'success'),
      () => showToast('复制失败', 'error')
    );
  };

  const handleToggleBookmark = (hook: HookResult) => {
    const nowBookmarked = bm.toggle(hook);
    showToast(nowBookmarked ? '已收藏' : '已取消收藏', nowBookmarked ? 'success' : 'info');
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <Header
        hasApiKey={!!getApiKey()}
        onOpenSettings={() => setShowApiModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Left Panel */}
          <div>
            <div className="lg:sticky lg:top-20">
              <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
                <InputPanel
                  topic={gen.topic}
                  platform={gen.platform}
                  contentType={gen.contentType}
                  status={gen.status}
                  onTopicChange={gen.setTopic}
                  onPlatformChange={gen.setPlatform}
                  onContentTypeChange={gen.setContentType}
                  onGenerate={handleGenerate}
                />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div>
            {/* Loading State */}
            {gen.status === 'loading' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-pink-500/40 animate-spin" style={{ borderTopColor: 'transparent' }} />
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
                    </div>
                    <p className="text-gray-400 text-sm">AI 正在为你创作爆款 Hook...</p>
                    <p className="text-gray-600 text-xs mt-1">分析平台特性，生成多样化风格</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-white/5 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success State */}
            {gen.status === 'success' && (
              <HookGrid
                results={gen.results}
                bookmarkedIds={bookmarkedIds}
                onCopy={handleCopy}
                onToggleBookmark={handleToggleBookmark}
                onCopyAll={handleCopyAll}
              />
            )}

            {/* Error State */}
            {gen.status === 'error' && (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm mb-1">{gen.error?.message || '生成失败'}</p>
                <p className="text-gray-500 text-xs mb-4">{gen.error?.detail || ''}</p>
                <button onClick={handleGenerate}
                  className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 text-sm hover:bg-white/20 transition-all">
                  重试
                </button>
              </div>
            )}

            {/* Empty State */}
            {gen.status === 'idle' && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">输入主题，选择平台和内容类型</p>
                  <p className="text-gray-600 text-xs mt-1">AI 将为你一键生成 10 个爆款开头</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ApiKeyModal open={showApiModal} onClose={() => setShowApiModal(false)} />
      <HistoryModal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={hist.history}
        bookmarks={bm.bookmarks}
        onRemoveHistory={hist.remove}
        onClearHistory={hist.clear}
        onToggleBookmark={bm.toggle}
        isBookmarked={bm.isBookmarked}
      />
    </div>
  );
}
