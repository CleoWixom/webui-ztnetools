import { PanelId } from '../layout/types';

export type PanelComponentProps = {
  onNavigate: (panelId: PanelId) => void;
};
