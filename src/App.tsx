import { useMemo, useState } from 'react';
import { Fab } from './components/layout/Fab';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import { NavGroup, PanelId } from './components/layout/types';
import { CreateNetworkPanel } from './components/panels/CreateNetworkPanel';
import { CurlBuilderPanel } from './components/panels/CurlBuilderPanel';
import { DashboardPanel } from './components/panels/DashboardPanel';
import { MemberDetailPanel } from './components/panels/MemberDetailPanel';
import { MembersPanel } from './components/panels/MembersPanel';
import { NetworkConfigPanel } from './components/panels/NetworkConfigPanel';
import { NetworksPanel } from './components/panels/NetworksPanel';
import { RawApiPanel } from './components/panels/RawApiPanel';
import { SettingsPanel } from './components/panels/SettingsPanel';
import { StatusPanel } from './components/panels/StatusPanel';

const panelComponents: Record<PanelId, (props: { onNavigate: (id: PanelId) => void }) => JSX.Element> = {
  'panel-dashboard': DashboardPanel,
  'panel-status': StatusPanel,
  'panel-networks': NetworksPanel,
  'panel-create-network': CreateNetworkPanel,
  'panel-network-config': NetworkConfigPanel,
  'panel-members': MembersPanel,
  'panel-member-detail': MemberDetailPanel,
  'panel-raw-api': RawApiPanel,
  'panel-terminal': CurlBuilderPanel,
  'panel-settings': SettingsPanel,
};

export function App() {
  const [activePanel, setActivePanel] = useState<PanelId>('panel-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [host, setHost] = useState('http://localhost:9993');
  const [token, setToken] = useState('');
  const [nodeId, setNodeId] = useState('NOT CONNECTED');

  const navGroups: NavGroup[] = useMemo(
    () => [
      { label: 'Overview', items: [{ panelId: 'panel-dashboard', label: 'Dashboard', icon: '⬡' }, { panelId: 'panel-status', label: 'Node Status', icon: '◉' }] },
      { label: 'Networks', items: [{ panelId: 'panel-networks', label: 'All Networks', icon: '⬢' }, { panelId: 'panel-create-network', label: 'Create Network', icon: '⊕' }, { panelId: 'panel-network-config', label: 'Configure Network', icon: '⚙' }] },
      { label: 'Members', items: [{ panelId: 'panel-members', label: 'Members', icon: '◎' }, { panelId: 'panel-member-detail', label: 'Member Detail', icon: '◐' }] },
      { label: 'Developer', items: [{ panelId: 'panel-raw-api', label: 'Raw API', icon: '≺/≻' }, { panelId: 'panel-terminal', label: 'cURL Builder', icon: '$_' }] },
      { label: 'System', items: [{ panelId: 'panel-settings', label: 'Connection', icon: '◧' }] },
    ],
    [],
  );

  const navigate = (panelId: PanelId) => {
    setActivePanel(panelId);
    setSidebarOpen(false);
  };

  const ActivePanel = panelComponents[activePanel];

  return (
    <>
      <Header
        host={host}
        token={token}
        nodeId={nodeId}
        connected={nodeId !== 'NOT CONNECTED'}
        sidebarOpen={sidebarOpen}
        onHostChange={setHost}
        onTokenChange={setToken}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onNavigateDashboard={() => navigate('panel-dashboard')}
        onConnect={() => setNodeId('connected-node-id')}
      />
      <div className="app-body">
        <Sidebar groups={navGroups} activePanel={activePanel} open={sidebarOpen} onNavigate={navigate} onClose={() => setSidebarOpen(false)} />
        <main id="main">
          <ActivePanel onNavigate={navigate} />
        </main>
      </div>
      <MobileNav groups={navGroups} activePanel={activePanel} onNavigate={navigate} />
      <Fab onClick={() => navigate('panel-create-network')} />
    </>
  );
}

export default App;
