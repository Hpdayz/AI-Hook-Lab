import type { Platform, ContentType, GenerationStatus } from '../types';
import { PLATFORM_LABELS, PLATFORM_ICONS, CONTENT_TYPE_LABELS, CONTENT_TYPE_ICONS } from '../types';

interface Props {
  topic: string;
  platform: Platform;
  contentType: ContentType;
  status: GenerationStatus;
  onTopicChange: (v: string) => void;
  onPlatformChange: (p: Platform) => void;
  onContentTypeChange: (c: ContentType) => void;
  onGenerate: () => void;
}

const PLATFORMS: Platform[] = ['xiaohongshu', 'douyin', 'bilibili'];
const CONTENT_TYPES: ContentType[] = ['video', 'image-text', 'product-ad', 'tutorial', 'opinion'];

export default function InputPanel({
  topic, platform, contentType, status,
  onTopicChange, onPlatformChange, onContentTypeChange, onGenerate,
}: Props) {
  const isLoading = status === 'loading';
  const charCount = topic.length;
  const canGenerate = topic.trim().length >= 2 && !isLoading;

  const counterColor = charCount >= 100 ? 'text-red-400' : charCount >= 80 ? 'text-amber-400' : 'text-gray-500';

  return (
    <div className="space-y-5">
      {/* Topic */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">主题</label>
        <div className="relative">
          <textarea
            value={topic}
            onChange={e => onTopicChange(e.target.value)}
            placeholder="输入你的内容主题，例如：如何在家做出完美的手冲咖啡..."
            rows={3}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none text-sm disabled:opacity-50"
          />
          {charCount > 0 && (
            <span className={`absolute bottom-3 right-3 text-[11px] ${counterColor}`}>
              {charCount}/100
            </span>
          )}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">平台</label>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map(p => (
            <button key={p} disabled={isLoading} onClick={() => onPlatformChange(p)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                platform === p ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/5'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}>
              <span>{PLATFORM_ICONS[p]}</span><span>{PLATFORM_LABELS[p]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">内容类型</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CONTENT_TYPES.map(ct => (
            <button key={ct} disabled={isLoading} onClick={() => onContentTypeChange(ct)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                contentType === ct ? 'bg-pink-600/20 border border-pink-500/40 text-pink-300 shadow-lg shadow-pink-500/5'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}>
              <span>{CONTENT_TYPE_ICONS[ct]}</span><span>{CONTENT_TYPE_LABELS[ct]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button onClick={onGenerate} disabled={!canGenerate}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          canGenerate ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/20 active:scale-[0.98]'
          : 'bg-white/5 text-gray-500 cursor-not-allowed'
        }`}>
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            AI 生成中...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            一键生成 10 个爆款 Hook
          </>
        )}
      </button>
      {topic.trim().length < 2 && topic.length > 0 && (
        <p className="text-[11px] text-gray-500 text-center -mt-2">输入至少 2 个字开始</p>
      )}
    </div>
  );
}
