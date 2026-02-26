import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PageHeader } from '../ui/PageHeader';
import { PanelComponentProps } from './panelTypes';

export function DashboardPanel({ onNavigate }: PanelComponentProps) {
  return (
    <div id="panel-dashboard" className="panel active">
      <PageHeader
        title="Dashboard"
        subtitle="ZeroTier Controller Overview"
        actions={<Button onClick={() => onNavigate('panel-status')}>Node Status</Button>}
      />
      <Card title="Overview">Dashboard widgets migrated from `panel-dashboard`.</Card>
    </div>
  );
}
