import { useState } from 'react';
import { getApiKey, setApiKey, clearApiKey } from '../utils/storage';
import { showToast } from './Toast';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ open, onClose }: Props) {
  const [key, setKey] = useState(getApiKey);
  const [showKey, setShowKey] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) { showToast('请输入 API Key', 'error'); return; }
    if (!trimmed.startsWith('sk-')) { showToast('API Key 格式不正确，应以 sk- 开头', 'error'); return; }
    setApiKey(trimmed);
    showToast('API Key 已保存', 'success');
    onClose();
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    showToast('API Key 已清除', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-1">API 设置</h2>
        <p className="text-sm text-gray-400 mb-5">输入 DeepSeek API Key，密钥仅存储在本地浏览器。</p>
        <div className="relative mb-4">
          <input type={showKey ? 'text' : 'password'} value={key} onChange={e => setKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxx"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm" />
          <button onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm">
            {showKey ? '隐藏' : '显示'}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
            保存
          </button>
          {key && (
            <button onClick={handleClear}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all">
              清除
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          获取 Key：<a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noreferrer"
            className="text-purple-400 hover:text-purple-300 underline">DeepSeek Console</a>
        </p>
      </div>
    </div>
  );
}
