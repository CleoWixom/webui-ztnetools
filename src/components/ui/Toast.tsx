import { useCallback, useSyncExternalStore } from 'react';

export type ToastType = 'ok' | 'err';

export interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

type Listener = () => void;

const queue: ToastItem[] = [];
const listeners = new Set<Listener>();
let nextId = 1;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return [...queue];
}

export function enqueueToast(msg: string, type: ToastType = 'ok') {
  const item: ToastItem = { id: nextId++, msg, type };
  queue.push(item);
  emit();

  window.setTimeout(() => {
    const index = queue.findIndex((t) => t.id === item.id);
    if (index >= 0) {
      queue.splice(index, 1);
      emit();
    }
  }, 3200);
}

export function useToastQueue() {
  const toasts = useSyncExternalStore(subscribe, snapshot, snapshot);
  const toast = useCallback((msg: string, type: ToastType = 'ok') => {
    enqueueToast(msg, type);
  }, []);

  return { toasts, toast };
}

export function Toast() {
  const { toasts } = useToastQueue();

  return (
    <div id="toast-wrap">
      {toasts.map((item) => (
        <div key={item.id} className={`toast ${item.type}`}>
          {item.type === 'ok' ? (
            <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
          ) : (
            <span style={{ color: 'var(--red)', flexShrink: 0 }}>✕</span>
          )}{' '}
          {item.msg}
        </div>
      ))}
    </div>
  );
}
