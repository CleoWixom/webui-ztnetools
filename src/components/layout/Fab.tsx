import { Button } from '../ui/Button';

type FabProps = {
  onClick: () => void;
};

export function Fab({ onClick }: FabProps) {
  return (
    <div className="fab-wrap">
      <Button variant="primary" className="fab" onClick={onClick}>
        ⊕
      </Button>
    </div>
  );
}
