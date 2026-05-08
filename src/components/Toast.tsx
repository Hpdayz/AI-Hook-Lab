import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

let nextId = 0;
const listeners = new Set<(msg: ToastMessage) => void>();

export function showToast(text: string, type: ToastType = 'info') {
  const msg: ToastMessage = { id: ++nextId, text, type };
  listeners.forEach(fn => fn(msg));
}

export default function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => setMessages(prev => [...prev.slice(-2), msg]);
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2 max-sm:bottom-4 max-sm:right-4 max-sm:left-4">
      {messages.map(msg => (
        <ToastItem key={msg.id} msg={msg} onDone={() => setMessages(prev => prev.filter(m => m.id !== msg.id))} />
      ))}
    </div>
  );
}

function ToastItem({ msg, onDone }: { msg: ToastMessage; onDone: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => { setShow(false); setTimeout(onDone, 300); }, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const style = msg.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/40'
    : msg.type === 'error' ? 'bg-red-500/90 border-red-400/40'
    : 'bg-white/10 border-white/20 backdrop-blur-xl';

  const icon = msg.type === 'success' ? '✓' : msg.type === 'error' ? '✕' : 'ℹ';

  return (
    <div
      className={`px-4 py-3 rounded-xl border text-sm text-white shadow-2xl transition-all duration-300 ${style} ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      }`}
    >
      <span className="mr-1.5">{icon}</span>{msg.text}
    </div>
  );
}
