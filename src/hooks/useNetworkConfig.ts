import { useCallback } from 'react';
import { useAppStore } from '../../frontend/src/store/appStore';
import { ztGet, ztPost } from '../api/ztApi';
import { useToastQueue } from '../components/ui/Toast';

interface NetworkConfigResponse {
  ipAssignmentPools?: Array<{ ipRangeStart?: string; ipRangeEnd?: string }>;
  routes?: Array<{ target?: string; via?: string | null }>;
  dns?: { servers?: string[]; domain?: string };
}

export function useNetworkConfig() {
  const { toast } = useToastQueue();
  const host = useAppStore((s) => s.host);
  const token = useAppStore((s) => s.token);
  const setSelectedNwid = useAppStore((s) => s.setSelectedNwid);
  const setPools = useAppStore((s) => s.setPools);
  const setRoutes = useAppStore((s) => s.setRoutes);
  const setV6Pools = useAppStore((s) => s.setV6Pools);
  const setV6Routes = useAppStore((s) => s.setV6Routes);
  const setDnsServers = useAppStore((s) => s.setDnsServers);
  const setDnsDomain = useAppStore((s) => s.setDnsDomain);
  const pools = useAppStore((s) => s.pools);
  const routes = useAppStore((s) => s.routes);
  const v6pools = useAppStore((s) => s.v6pools);
  const v6routes = useAppStore((s) => s.v6routes);
  const dnsServers = useAppStore((s) => s.dnsServers);
  const dnsDomain = useAppStore((s) => s.dnsDomain);

  const apiCtx = { host, token, onNetworkError: (message: string) => toast(message, 'err') };

  const loadNetworkConfig = useCallback(async (nwid: string) => {
    if (!nwid) {
      toast('Enter a Network ID', 'err');
      return null;
    }

    const res = await ztGet<NetworkConfigResponse>(`/controller/network/${nwid}`, apiCtx);
    if (!res?.ok || !res.data) return res;

    setSelectedNwid(nwid);

    const allPools = res.data.ipAssignmentPools ?? [];
    const allRoutes = res.data.routes ?? [];

    setPools(allPools.filter((p) => !p.ipRangeStart?.includes(':')).map((p) => ({ ipRangeStart: p.ipRangeStart || '', ipRangeEnd: p.ipRangeEnd || '' })));
    setV6Pools(allPools.filter((p) => p.ipRangeStart?.includes(':')).map((p) => ({ ipRangeStart: p.ipRangeStart || '', ipRangeEnd: p.ipRangeEnd || '' })));

    setRoutes(allRoutes.filter((r) => !r.target?.includes(':')).map((r) => ({ target: r.target || '', via: r.via ?? null })));
    setV6Routes(allRoutes.filter((r) => r.target?.includes(':')).map((r) => ({ target: r.target || '', via: r.via ?? null })));

    setDnsServers(res.data.dns?.servers ? [...res.data.dns.servers] : []);
    setDnsDomain(res.data.dns?.domain || '');

    return res;
  }, [apiCtx, setDnsDomain, setDnsServers, setPools, setRoutes, setSelectedNwid, setV6Pools, setV6Routes, toast]);

  const saveNetworkConfig = useCallback(async (nwid: string, partialBody: Record<string, unknown>) => {
    const allPools = [...(pools || []), ...(v6pools || [])];
    const allRoutes = [...(routes || []), ...(v6routes || [])];

    const body = {
      ...partialBody,
      ipAssignmentPools: allPools,
      routes: allRoutes,
      dns: (dnsServers || []).length || dnsDomain
        ? { domain: dnsDomain, servers: dnsServers || [] }
        : undefined,
    };

    const res = await ztPost(`/controller/network/${nwid}`, apiCtx, body);
    if (res?.ok) toast('Network config saved', 'ok');
    return res;
  }, [apiCtx, dnsDomain, dnsServers, pools, routes, toast, v6pools, v6routes]);

  return { loadNetworkConfig, saveNetworkConfig };
}
