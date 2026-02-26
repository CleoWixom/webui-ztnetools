import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { PanelComponentProps } from './panelTypes';

export function NetworksPanel({ onNavigate }: PanelComponentProps) {
  return (
    <div id="panel-networks" className="panel">
      <PageHeader title="Networks" subtitle="All controller-managed networks" actions={<Button onClick={() => onNavigate('panel-create-network')}>Create</Button>} />
    </div>
  );
}
