import { useState } from 'react';
import type { HookResult } from '../types';
import { showToast } from './Toast';

interface Props {
  hook: HookResult;
  isBookmarked: boolean;
  index: number;
  onCopy: (hook: HookResult) => void;
  onToggleBookmark: (hook: HookResult) => void;
}

export default function HookCard({ hook, isBookmarked, index, onCopy, onToggleBookmark }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.hook);
      setCopied(true);
      showToast('已复制', 'success');
      setTimeout(() => setCopied(false), 2000);
      onCopy(hook);
    } catch { showToast('复制失败', 'error'); }
  };

  const scoreColor = hook.score >= 90 ? 'text-emerald-400' : hook.score >= 75 ? 'text-amber-400' : 'text-gray-400';
  const isTopCard = hook.score >= 90;

  return (
    <div
      className={`group relative rounded-xl border bg-gradient-to-b p-4 transition-all duration-300 hover:border-white/15 hover:from-white/[0.06] hover:to-white/[0.02] opacity-0 translate-y-2
        ${isTopCard ? 'border-purple-500/20 from-purple-500/[0.04] to-transparent shadow-[0_0_20px_-5px_rgba(168,85,247,0.1)]'
          : 'border-white/[0.06] from-white/[0.04] to-white/[0.01]'}`}
      style={{
        animation: `fadeInUp 300ms ease-out ${index * 60}ms forwards`,
      }}
    >
      {/* Score badge */}
      <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f0f1a] border border-white/10 text-xs font-bold shadow-lg">
        <span className={scoreColor}>{hook.score}</span>
        <span className="text-gray-500">分</span>
      </div>

      {/* Hook text */}
      <p className="text-white text-sm leading-relaxed mb-3 pr-8">{hook.hook}</p>

      {/* Footer: style tag + actions */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium">
          {hook.style}
        </span>
        <div className="flex items-center gap-0.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="复制">
            {copied ? (
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
          <button onClick={() => onToggleBookmark(hook)}
            className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'text-amber-400 hover:bg-amber-500/10' : 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10'}`}
            title={isBookmarked ? '取消收藏' : '收藏'}>
            <svg className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
        </div>
      </div>

      {/* Reason */}
      <p className="mt-2 text-[11px] text-gray-500 leading-relaxed">{hook.reason}</p>
    </div>
  );
}
