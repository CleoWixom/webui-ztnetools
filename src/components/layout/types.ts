export type PanelId =
  | 'panel-dashboard'
  | 'panel-status'
  | 'panel-networks'
  | 'panel-create-network'
  | 'panel-network-config'
  | 'panel-members'
  | 'panel-member-detail'
  | 'panel-raw-api'
  | 'panel-terminal'
  | 'panel-settings';

export type NavItem = {
  panelId: PanelId;
  label: string;
  icon: string;
  badge?: number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
