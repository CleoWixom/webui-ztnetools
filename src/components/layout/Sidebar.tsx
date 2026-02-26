import { NavGroup, PanelId } from './types';

type SidebarProps = {
  groups: NavGroup[];
  activePanel: PanelId;
  open: boolean;
  onNavigate: (id: PanelId) => void;
  onClose: () => void;
};

export function Sidebar({ groups, activePanel, open, onNavigate, onClose }: SidebarProps) {
  return (
    <>
      <div className="sidebar-overlay" style={{ display: open ? 'block' : 'none' }} onClick={onClose} />
      <aside id="sidebar" style={{ transform: open ? 'translateX(0)' : undefined }}>
        {groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => (
              <div
                key={item.panelId}
                className={`nav-item ${activePanel === item.panelId ? 'active' : ''}`}
                onClick={() => onNavigate(item.panelId)}
              >
                <span className="nav-ic">{item.icon}</span>
                {item.label}
                {typeof item.badge === 'number' ? <span className="nav-badge">{item.badge}</span> : null}
              </div>
            ))}
          </div>
        ))}
      </aside>
    </>
  );
}
