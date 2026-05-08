import type { HookResult } from '../types';
import HookCard from './HookCard';

interface Props {
  results: HookResult[];
  bookmarkedIds: Set<string>;
  onCopy: (hook: HookResult) => void;
  onToggleBookmark: (hook: HookResult) => void;
  onCopyAll: () => void;
}

export default function HookGrid({ results, bookmarkedIds, onCopy, onToggleBookmark, onCopyAll }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-300">
          生成结果<span className="text-gray-500 ml-1">({results.length}个)</span>
        </h2>
        <button onClick={onCopyAll}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          复制全部
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((hook, i) => (
          <HookCard
            key={hook.id}
            hook={hook}
            index={i}
            isBookmarked={bookmarkedIds.has(hook.id)}
            onCopy={onCopy}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}
