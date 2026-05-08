interface Props {
  hasApiKey: boolean;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

export default function Header({ hasApiKey, onOpenSettings, onOpenHistory }: Props) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07070f]/80 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
            H
          </div>
          <div>
            <span className="text-white font-semibold text-sm leading-tight block">AI Hook Lab</span>
            <span className="text-[10px] text-gray-500 leading-tight">爆款开头生成器</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            历史
          </button>
          <button onClick={onOpenSettings}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
              hasApiKey ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-amber-400 hover:bg-amber-500/10'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            {hasApiKey ? '已连接' : '设置API'}
          </button>
        </div>
      </div>
    </header>
  );
}
