import { create } from 'zustand';

export interface IpAssignmentPool {
  ipRangeStart: string;
  ipRangeEnd: string;
}

export interface Route {
  target: string;
  via: string | null;
}

export interface NetworkLike {
  id: string;
  name?: string;
  private?: boolean;
  [key: string]: unknown;
}

export interface AppState {
  host: string;
  token: string;
  nodeId: string;
  connected: boolean;
  networks: NetworkLike[];
  selectedNwid: string;
  memberIps: string[];
  pools: IpAssignmentPool[];
  routes: Route[];
  dnsServers: string[];
  dnsDomain: string;
  v6pools: IpAssignmentPool[];
  v6routes: Route[];
}

export interface AppActions {
  setHost: (host: string) => void;
  setToken: (token: string) => void;
  setNodeId: (nodeId: string) => void;
  setConnected: (connected: boolean) => void;
  setNetworks: (networks: NetworkLike[]) => void;
  setSelectedNwid: (selectedNwid: string) => void;
  setMemberIps: (memberIps: string[]) => void;
  setPools: (pools: IpAssignmentPool[]) => void;
  setRoutes: (routes: Route[]) => void;
  setDnsServers: (dnsServers: string[]) => void;
  setDnsDomain: (dnsDomain: string) => void;
  setV6Pools: (v6pools: IpAssignmentPool[]) => void;
  setV6Routes: (v6routes: Route[]) => void;
  resetConnectionState: () => void;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
  host: 'http://localhost:9993',
  token: '',
  nodeId: '',
  connected: false,
  networks: [],
  selectedNwid: '',
  memberIps: [],
  pools: [],
  routes: [],
  dnsServers: [],
  dnsDomain: '',
  v6pools: [],
  v6routes: [],
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setHost: (host) => set({ host }),
  setToken: (token) => set({ token }),
  setNodeId: (nodeId) => set({ nodeId }),
  setConnected: (connected) => set({ connected }),
  setNetworks: (networks) => set({ networks }),
  setSelectedNwid: (selectedNwid) => set({ selectedNwid }),
  setMemberIps: (memberIps) => set({ memberIps }),
  setPools: (pools) => set({ pools }),
  setRoutes: (routes) => set({ routes }),
  setDnsServers: (dnsServers) => set({ dnsServers }),
  setDnsDomain: (dnsDomain) => set({ dnsDomain }),
  setV6Pools: (v6pools) => set({ v6pools }),
  setV6Routes: (v6routes) => set({ v6routes }),
  resetConnectionState: () => set({
    connected: false,
    nodeId: '',
    networks: [],
    selectedNwid: '',
    memberIps: [],
    pools: [],
    routes: [],
    dnsServers: [],
    dnsDomain: '',
    v6pools: [],
    v6routes: [],
  }),
}));
