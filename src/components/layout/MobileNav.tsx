import { NavGroup, PanelId } from './types';

type MobileNavProps = {
  groups: NavGroup[];
  activePanel: PanelId;
  onNavigate: (panelId: PanelId) => void;
};

export function MobileNav({ groups, activePanel, onNavigate }: MobileNavProps) {
  const items = groups.flatMap((group) => group.items).slice(0, 5);
  return (
    <nav className="mob-nav">
      {items.map((item) => (
        <button
          key={item.panelId}
          className={`mob-nav-item ${activePanel === item.panelId ? 'active' : ''}`}
          onClick={() => onNavigate(item.panelId)}
          type="button"
        >
          <span>{item.icon}</span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}
