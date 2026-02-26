import { ReactNode } from 'react';

type CardProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function Card({ title, actions, children }: CardProps) {
  return (
    <section className="card">
      {(title || actions) && (
        <div className="card-hdr">
          {title ? <div className="card-title">{title}</div> : <div />}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
