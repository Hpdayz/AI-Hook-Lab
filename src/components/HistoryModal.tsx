import { useState, useEffect } from 'react';
import type { GenerationRecord, HookResult } from '../types';
import { PLATFORM_LABELS, CONTENT_TYPE_LABELS } from '../types';
import { showToast } from './Toast';

interface Props {
  open: boolean;
  onClose: () => void;
  history: GenerationRecord[];
  bookmarks: HookResult[];
  onRemoveHistory: (id: string) => void;
  onClearHistory: () => void;
  onToggleBookmark: (hook: HookResult) => void;
  isBookmarked: (id: string) => boolean;
}

type Tab = 'history' | 'bookmarks';

export default function HistoryModal({ open, onClose, history, bookmarks, onRemoveHistory, onClearHistory, onToggleBookmark, isBookmarked }: Props) {
  const [tab, setTab] = useState<Tab>('history');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { if (open) setExpandedId(null); }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[80vh] rounded-t-2xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex gap-1">
            <button onClick={() => setTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'history' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400 hover:text-gray-200'}`}>
              生成历史
            </button>
            <button onClick={() => setTab('bookmarks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'bookmarks' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400 hover:text-gray-200'}`}>
              我的收藏
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'history' ? (
            history.length === 0 ? (
              <div className="text-center py-12"><p className="text-gray-500 text-sm">暂无历史记录</p></div>
            ) : (
              <>
                <button onClick={() => { onClearHistory(); showToast('已清空', 'info'); }}
                  className="text-xs text-gray-500 hover:text-red-400 transition-all mb-2">清空全部</button>
                {history.map(rec => (
                  <div key={rec.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <button onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                      className="w-full flex items-center justify-between p-3 text-left">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-white truncate">{rec.request.topic}</span>
                        <span className="shrink-0 text-[11px] text-gray-500 px-1.5 py-0.5 rounded bg-white/5">{PLATFORM_LABELS[rec.request.platform]}</span>
                        <span className="shrink-0 text-[11px] text-gray-500 px-1.5 py-0.5 rounded bg-white/5">{CONTENT_TYPE_LABELS[rec.request.contentType]}</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${expandedId === rec.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {expandedId === rec.id && (
                      <div className="px-3 pb-3 space-y-2">
                        {rec.results.map(hook => (
                          <div key={hook.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] p-2.5">
                            <p className="flex-1 text-xs text-gray-300 leading-relaxed">{hook.hook}</p>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-gray-500">{hook.score}分</span>
                              <button onClick={() => onToggleBookmark(hook)}
                                className={`p-1 text-xs ${isBookmarked(hook.id) ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'}`}>
                                {isBookmarked(hook.id) ? '★' : '☆'}
                              </button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => { onRemoveHistory(rec.id); showToast('已删除', 'info'); }}
                          className="text-xs text-gray-500 hover:text-red-400 transition-all">删除此记录</button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )
          ) : (
            bookmarks.length === 0 ? (
              <div className="text-center py-12"><p className="text-gray-500 text-sm">暂无收藏</p></div>
            ) : (
              bookmarks.map(hook => (
                <div key={hook.id}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-relaxed truncate">{hook.hook}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-purple-400">{hook.style}</span>
                      <span className="text-[10px] text-gray-500">{hook.score}分</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={async () => { await navigator.clipboard.writeText(hook.hook); showToast('已复制', 'success'); }}
                      className="p-1.5 text-gray-400 hover:text-white transition-all" title="复制">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button onClick={() => onToggleBookmark(hook)}
                      className={`p-1.5 transition-all ${isBookmarked(hook.id) ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'}`} title="取消收藏">
                      <svg className="w-3.5 h-3.5" fill={isBookmarked(hook.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
