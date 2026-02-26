import { useCallback } from 'react';
import { useAppStore, type NetworkLike } from '../../frontend/src/store/appStore';
import { ztDelete, ztGet, ztPost } from '../api/ztApi';
import { useToastQueue } from '../components/ui/Toast';

export function useNetworks() {
  const { toast } = useToastQueue();
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const nodeId = useAppStore((s) => s.nodeId);
  const networks = useAppStore((s) => s.networks);
  const setNetworks = useAppStore((s) => s.setNetworks);

  const apiCtx = { host, token, onNetworkError: (message: string) => toast(message, 'err') };

  const loadNetworks = useCallback(async () => {
    const list = await ztGet<Record<string, unknown>>('/controller/network', apiCtx);
    if (!list?.ok || !list.data) return list;

    const items: NetworkLike[] = [];
    for (const id of Object.keys(list.data)) {
      const nr = await ztGet<NetworkLike>(`/controller/network/${id}`, apiCtx);
      items.push({ id, name: nr?.data?.name || '', private: nr?.data?.private ?? true, ...(nr?.data ?? {}) });
    }

    setNetworks(items);
    return list;
  }, [apiCtx, setNetworks]);

  const createNetwork = useCallback(async (body: unknown, btnId?: string) => {
    if (!nodeId) {
      toast('Connect first to get your Node ID', 'err');
      return null;
    }

    const res = await ztPost(`/controller/network/${nodeId}______`, apiCtx, body, { btnId });
    if (res?.ok) toast('Network created', 'ok');
    return res;
  }, [apiCtx, nodeId, toast]);

  const deleteNetwork = useCallback(async (nwid: string) => {
    const res = await ztDelete(`/controller/network/${nwid}`, apiCtx);
    if (res?.ok) {
      setNetworks(networks.filter((n) => n.id !== nwid));
      toast('Network deleted', 'ok');
    }
    return res;
  }, [apiCtx, networks, setNetworks, toast]);

  return { loadNetworks, createNetwork, deleteNetwork };
}
