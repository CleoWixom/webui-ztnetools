import { Button } from '../ui/Button';

type HeaderProps = {
  host: string;
  token: string;
  nodeId: string;
  connected: boolean;
  sidebarOpen: boolean;
  onHostChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onToggleSidebar: () => void;
  onNavigateDashboard: () => void;
  onConnect: () => void;
};

export function Header({
  host,
  token,
  nodeId,
  connected,
  sidebarOpen,
  onHostChange,
  onTokenChange,
  onToggleSidebar,
  onNavigateDashboard,
  onConnect,
}: HeaderProps) {
  return (
    <header>
      <button className={`menu-btn ${sidebarOpen ? 'open' : ''}`} onClick={onToggleSidebar} aria-label="Menu" type="button">
        <span />
        <span />
        <span />
      </button>

      <a className="logo" href="#" onClick={(e) => {
        e.preventDefault();
        onNavigateDashboard();
      }}>
        <div className="logo-text">
          <div className="logo-main">ZT<em>NET</em></div>
          <div className="logo-tagline">CONTROLLER TOOLS</div>
        </div>
      </a>

      <div className="hdr-conn">
        <input className="form-input host-input" value={host} onChange={(e) => onHostChange(e.target.value)} placeholder="http://localhost:9993" />
        <input className="form-input token-input" type="password" value={token} onChange={(e) => onTokenChange(e.target.value)} placeholder="X-ZT1-AUTH token" />
        <Button variant="primary" onClick={onConnect}>⚡ Connect</Button>
      </div>

      <div className="hdr-right">
        <div className="conn-indicator">
          <div className={`status-dot ${connected ? 'online' : ''}`} />
          <span className="node-id-text">{connected ? nodeId : 'NOT CONNECTED'}</span>
        </div>
      </div>
    </header>
  );
}
