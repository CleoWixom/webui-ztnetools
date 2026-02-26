import { useCallback } from 'react';
import { useAppStore } from '../../frontend/src/store/appStore';
import { ztGet } from '../api/ztApi';
import { useToastQueue } from '../components/ui/Toast';

interface StatusResponse {
  address?: string;
}

export function useConnection() {
  const { toast } = useToastQueue();
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const setHost = useAppStore((s) => s.setHost);
  const setToken = useAppStore((s) => s.setToken);
  const setNodeId = useAppStore((s) => s.setNodeId);
  const setConnected = useAppStore((s) => s.setConnected);

  const savePrefs = useCallback(() => {
    try {
      localStorage.setItem('ztnet_host', host);
      localStorage.setItem('ztnet_token', token);
    } catch {
      // preserve silent failure
    }
  }, [host, token]);

  const loadPrefs = useCallback(() => {
    try {
      const h = localStorage.getItem('ztnet_host');
      const t = localStorage.getItem('ztnet_token');
      if (h) setHost(h);
      if (t) setToken(t);
    } catch {
      // preserve silent failure
    }
  }, [setHost, setToken]);

  const testConnection = useCallback(async () => {
    if (!token) {
      toast('Enter auth token first', 'err');
      return null;
    }

    const res = await ztGet<StatusResponse>('/status', {
      host,
      token,
      onNetworkError: (message) => toast(message, 'err'),
    });

    if (res?.ok) {
      const nodeId = res.data?.address || '';
      setNodeId(nodeId);
      setConnected(true);
      savePrefs();
      toast(`Connected · ${nodeId}`, 'ok');
    } else {
      setConnected(false);
      toast('Connection failed — check host & token', 'err');
    }

    return res;
  }, [host, savePrefs, setConnected, setNodeId, toast, token]);

  return { savePrefs, loadPrefs, testConnection };
}
