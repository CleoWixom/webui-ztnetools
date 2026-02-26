import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { PanelComponentProps } from './panelTypes';

export function MembersPanel({ onNavigate }: PanelComponentProps) {
  return <div id="panel-members" className="panel"><PageHeader title="Members" subtitle="Authorize and manage members" actions={<Button onClick={() => onNavigate('panel-member-detail')}>Open Detail</Button>} /></div>;
}
